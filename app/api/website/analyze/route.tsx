import { request as httpRequest, type IncomingMessage } from "node:http"
import { request as httpsRequest } from "node:https"
import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import OpenAI from "openai"
import { NextResponse } from "next/server"
import { WebsiteAnalysisSchema } from "@/lib/ai/contracts"

export const runtime = "nodejs"

const MAX_REDIRECTS = 3
const MAX_RESPONSE_BYTES = 1_000_000
const FETCH_TIMEOUT_MS = 8_000
const OPENAI_TIMEOUT_MS = 12_000

class UrlSafetyError extends Error {}

interface ResolvedPublicHost {
  hostname: string
  address: string
  family: 4 | 6
}

interface ValidatedPublicUrl {
  url: URL
  host: ResolvedPublicHost
}

export async function POST(request: Request) {
  let normalizedUrl = ""

  try {
    const body = await request.json()
    const rawUrl = typeof body?.url === "string" ? body.url.trim() : ""
    if (!rawUrl) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 })
    }

    const validatedUrl = await validatePublicUrl(rawUrl)
    normalizedUrl = validatedUrl.url.toString()
    const htmlContent = await fetchWebsiteContent(validatedUrl)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getFallbackAnalysis(normalizedUrl, "Análisis no disponible"))
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 800,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Analiza el contenido de un sitio web y extrae información relevante para un diagnóstico de digitalización. Responde solo con JSON válido.",
        },
        {
          role: "user",
          content: `Analiza este contenido de sitio web y responde en JSON:\n\nURL: ${normalizedUrl}\nCONTENIDO: ${htmlContent}\n\nResponde con este JSON exacto:\n{
  "titulo": "título o nombre del negocio detectado",
  "descripcion": "1 oración describiendo el negocio",
  "resumen_contenido": "párrafo de 2-3 oraciones sobre qué ofrece, a quién y cómo se presenta online",
  "tiene_blog": true/false,
  "tiene_ecommerce": true/false,
  "tiene_formulario_contacto": true/false,
  "redes_sociales": ["lista de redes detectadas en el contenido"],
  "keywords_detectadas": ["5-8 palabras clave del negocio"],
  "oportunidades_mejora": ["2-3 oportunidades de mejora digital detectadas del sitio"]
}`,
        },
      ],
    }, { signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS) })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const analysis = WebsiteAnalysisSchema.safeParse({ url: normalizedUrl, ...JSON.parse(text) })
    if (!analysis.success) throw new Error("Respuesta de análisis web inválida")

    return NextResponse.json(analysis.data)
  } catch (error) {
    if (error instanceof UrlSafetyError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error("Error analizando sitio web:", error)
    return NextResponse.json(getFallbackAnalysis(normalizedUrl, "No se pudo analizar el sitio web"))
  }
}

async function validatePublicUrl(rawUrl: string): Promise<ValidatedPublicUrl> {
  const candidate = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  let parsed: URL

  try {
    parsed = new URL(candidate)
  } catch {
    throw new UrlSafetyError("Ingresa una URL válida")
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UrlSafetyError("Solo se permiten URLs HTTP o HTTPS")
  }
  if (parsed.username || parsed.password || parsed.port) {
    throw new UrlSafetyError("La URL no puede incluir credenciales ni puertos personalizados")
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, "")
  if (hostname.endsWith(".local") || hostname === "localhost") {
    throw new UrlSafetyError("La URL debe apuntar a un sitio público")
  }

  return { url: parsed, host: await resolvePublicHost(hostname) }
}

async function resolvePublicHost(hostname: string): Promise<ResolvedPublicHost> {
  const literalFamily = isIP(hostname)
  if (literalFamily) {
    if (isPrivateAddress(hostname)) {
      throw new UrlSafetyError("La URL debe apuntar a una dirección pública")
    }
    return { hostname, address: hostname, family: literalFamily as 4 | 6 }
  }

  let addresses: { address: string; family: number }[]
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw new UrlSafetyError("No se pudo resolver el dominio indicado")
  }

  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new UrlSafetyError("La URL debe apuntar a una dirección pública")
  }

  const selected = addresses[0]
  if (selected.family !== 4 && selected.family !== 6) {
    throw new UrlSafetyError("El dominio no resolvió a una dirección IP válida")
  }

  return { hostname, address: selected.address, family: selected.family }
}

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "")
  if (normalized.includes(":")) {
    return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:")
  }

  const [first = 0, second = 0] = normalized.split(".").map(Number)
  return first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && (second === 0 || second === 168))
    || (first === 198 && (second === 18 || second === 19))
    || first >= 224
}

async function fetchWebsiteContent(initialUrl: ValidatedPublicUrl): Promise<string> {
  let current = initialUrl

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await requestPinnedUrl(current, controller.signal)
      const status = response.statusCode ?? 0

      if (status >= 300 && status < 400) {
        const location = response.headers.location
        response.resume()
        if (!location || Array.isArray(location)) throw new UrlSafetyError("El sitio devolvió una redirección inválida")
        if (redirectCount === MAX_REDIRECTS) throw new UrlSafetyError("El sitio tiene demasiadas redirecciones")
        current = await validatePublicUrl(new URL(location, current.url).toString())
        continue
      }

      if (status < 200 || status >= 300) throw new Error(`El sitio respondió con estado ${status}`)
      const contentType = response.headers["content-type"]?.toLowerCase() ?? ""
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        response.resume()
        throw new UrlSafetyError("La URL debe devolver una página HTML")
      }

      return cleanHtml(await readLimitedBody(response))
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new UrlSafetyError("No se pudo seguir la redirección del sitio")
}

function requestPinnedUrl(target: ValidatedPublicUrl, signal: AbortSignal): Promise<IncomingMessage> {
  const requestUrl = target.url
  const sendRequest = requestUrl.protocol === "https:" ? httpsRequest : httpRequest

  return new Promise((resolve, reject) => {
    const request = sendRequest(requestUrl, {
      headers: { "User-Agent": "Brujula-Bot/1.0 (+website-analysis)" },
      lookup: (hostname, _options, callback) => {
        if (hostname !== target.host.hostname) {
          callback(new Error("El cliente intentó resolver un hostname no validado"), "", 0)
          return
        }
        callback(null, target.host.address, target.host.family)
      },
      signal,
    }, resolve)

    request.once("error", reject)
    request.end()
  })
}

async function readLimitedBody(response: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of response) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.byteLength
    if (size > MAX_RESPONSE_BYTES) {
      response.destroy()
      throw new UrlSafetyError("La página excede el tamaño permitido para análisis")
    }
    chunks.push(buffer)
  }

  return Buffer.concat(chunks).toString("utf-8")
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000)
}

function getFallbackAnalysis(url: string, error: string) {
  return {
    url,
    resumen_contenido: "",
    redes_sociales: [],
    keywords_detectadas: [],
    oportunidades_mejora: [],
    error,
  }
}

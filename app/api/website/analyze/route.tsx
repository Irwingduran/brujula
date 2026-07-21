import { isIP } from "node:net"
import { lookup } from "node:dns/promises"
import OpenAI from "openai"
import { NextResponse } from "next/server"
import { WebsiteAnalysisSchema } from "@/lib/ai/contracts"

export const runtime = "nodejs"

const MAX_REDIRECTS = 3
const MAX_RESPONSE_BYTES = 1_000_000
const FETCH_TIMEOUT_MS = 8_000
const OPENAI_TIMEOUT_MS = 12_000

class UrlSafetyError extends Error {}

export async function POST(request: Request) {
  let normalizedUrl = ""

  try {
    const body = await request.json()
    const rawUrl = typeof body?.url === "string" ? body.url.trim() : ""
    if (!rawUrl) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 })
    }

    normalizedUrl = await validatePublicUrl(rawUrl)
    const htmlContent = await fetchWebsiteContent(normalizedUrl)

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
          content: `Analiza este contenido de sitio web y responde en JSON:\n\nURL: ${normalizedUrl}\nCONTENIDO: ${htmlContent}\n\nResponde con este JSON exacto:\n{\n  "titulo": "título o nombre del negocio detectado",\n  "descripcion": "1 oración describiendo el negocio",\n  "resumen_contenido": "párrafo de 2-3 oraciones sobre qué ofrece, a quién y cómo se presenta online",\n  "tiene_blog": true/false,\n  "tiene_ecommerce": true/false,\n  "tiene_formulario_contacto": true/false,\n  "redes_sociales": ["lista de redes detectadas en el contenido"],\n  "keywords_detectadas": ["5-8 palabras clave del negocio"],\n  "oportunidades_mejora": ["2-3 oportunidades de mejora digital detectadas del sitio"]\n}`,
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

async function validatePublicUrl(rawUrl: string): Promise<string> {
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
  if (parsed.hostname.endsWith(".local") || parsed.hostname === "localhost") {
    throw new UrlSafetyError("La URL debe apuntar a un sitio público")
  }

  await assertPublicHost(parsed.hostname)
  return parsed.toString()
}

async function assertPublicHost(hostname: string): Promise<void> {
  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new UrlSafetyError("La URL debe apuntar a una dirección pública")
    return
  }

  let addresses: { address: string }[]
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw new UrlSafetyError("No se pudo resolver el dominio indicado")
  }

  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new UrlSafetyError("La URL debe apuntar a una dirección pública")
  }
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

async function fetchWebsiteContent(initialUrl: string): Promise<string> {
  let currentUrl = initialUrl

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch(currentUrl, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "Brujula-Bot/1.0 (+website-analysis)" },
      })

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location")
        if (!location) throw new UrlSafetyError("El sitio devolvió una redirección inválida")
        if (redirectCount === MAX_REDIRECTS) throw new UrlSafetyError("El sitio tiene demasiadas redirecciones")
        currentUrl = await validatePublicUrl(new URL(location, currentUrl).toString())
        continue
      }

      if (!response.ok) throw new Error(`El sitio respondió con estado ${response.status}`)
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        throw new UrlSafetyError("La URL debe devolver una página HTML")
      }

      return cleanHtml(await readLimitedBody(response))
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new UrlSafetyError("No se pudo seguir la redirección del sitio")
}

async function readLimitedBody(response: Response): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ""

  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel()
      throw new UrlSafetyError("La página excede el tamaño permitido para análisis")
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
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
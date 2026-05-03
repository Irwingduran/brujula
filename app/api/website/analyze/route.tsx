import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 })
    }

    // Normalizar URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

    // 1. Hacer scraping del sitio
    let htmlContent = ""
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout

      const res = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Brujula-Bot/1.0)",
        },
      })
      clearTimeout(timeout)

      const html = await res.text()

      // Extraer texto limpio del HTML (sin tags, scripts, styles)
      htmlContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 6000) // limitar tokens

    } catch (fetchError) {
      return NextResponse.json({
        url: normalizedUrl,
        resumen_contenido: "",
        tiene_blog: false,
        tiene_ecommerce: false,
        tiene_formulario_contacto: false,
        redes_sociales: [],
        keywords_detectadas: [],
        error: "No se pudo acceder al sitio web",
      })
    }

    if (!process.env.OPEN_ROUTER_KEY) {
      return NextResponse.json(getFallbackAnalysis(normalizedUrl))
    }

    // 2. Analizar con IA
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
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
          content: `Analiza este contenido de sitio web y responde en JSON:

URL: ${normalizedUrl}
CONTENIDO: ${htmlContent}

Responde con este JSON exacto:
{
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
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const analysis = JSON.parse(text)
    return NextResponse.json({ url: normalizedUrl, ...analysis })

  } catch (error) {
    console.error("Error analizando sitio web:", error)
    return NextResponse.json(getFallbackAnalysis(""))
  }
}

function getFallbackAnalysis(url: string) {
  return {
    url,
    titulo: "",
    descripcion: "",
    resumen_contenido: "No se pudo analizar el sitio automáticamente.",
    tiene_blog: false,
    tiene_ecommerce: false,
    tiene_formulario_contacto: false,
    redes_sociales: [],
    keywords_detectadas: [],
    oportunidades_mejora: [],
    error: "Análisis no disponible",
  }
}
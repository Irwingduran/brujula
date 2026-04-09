import OpenAI from "openai"
import { NextResponse } from "next/server"
import { PAIN_POINTS, INDUSTRY_PAIN_OVERRIDES, INDUSTRY_PAIN_HINTS } from "@/lib/constants"
import type { PainPoint } from "@/lib/types"

interface PainOverride {
  label: string
  description: string
}

interface AIResponse {
  overrides: Record<string, PainOverride>
  hints: string[]
}

function getFallback(industria: string): AIResponse {
  const overrides = INDUSTRY_PAIN_OVERRIDES[industria] ?? {}
  const hints = INDUSTRY_PAIN_HINTS[industria] ?? []
  const result: Record<string, PainOverride> = {}
  for (const [key, value] of Object.entries(overrides)) {
    if (value) result[key] = value
  }
  return { overrides: result, hints }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { industria, industria_otra } = body

    if (!industria) {
      return NextResponse.json({ error: "Industria requerida" }, { status: 400 })
    }

    if (!process.env.OPEN_ROUTER_KEY) {
      return NextResponse.json(getFallback(industria))
    }

    const industriaDisplay = industria === "otra" && industria_otra
      ? industria_otra
      : industria.replace(/_/g, " ")

    const painList = PAIN_POINTS
      .filter((p) => p.value !== "otro")
      .map((p) => `- "${p.value}": actualmente dice "${p.label}" / "${p.description}"`)
      .join("\n")

    const prompt = `Eres un consultor senior de transformación digital para PYMEs en Latinoamérica.

Un prospecto acaba de indicar que su negocio pertenece a la industria: "${industriaDisplay}".

Necesito que personalices los siguientes desafíos empresariales para que sean 100% relevantes y específicos para esa industria. Cada desafío debe sentirse como si un consultor experto en "${industriaDisplay}" lo hubiera escrito.

DESAFÍOS ACTUALES (genéricos):
${painList}

INSTRUCCIONES:
1. Para CADA desafío, genera un "label" (título corto, 3-6 palabras) y una "description" (1 frase, máx 15 palabras) que sean específicos para "${industriaDisplay}".
2. No uses jerga técnica. Lenguaje conversacional en español LATAM.
3. El label debe nombrar el problema real que vive esa industria, no solo reformular el genérico.
4. La description debe hacer que el prospecto piense "sí, eso me pasa a mí".
5. También genera 3 "hints": frases cortas (1 oración cada una) describiendo problemáticas reales y comunes de "${industriaDisplay}" que un dueño reconocería inmediatamente.

EJEMPLO para "restaurante":
- procesos_manuales → label: "Cocina y caja desconectados", description: "Pedidos, inventario y facturación se manejan por separado y a mano."
- hint: "Pérdida de insumos por falta de control de inventario en tiempo real."

Responde ÚNICAMENTE con JSON válido:
{
  "overrides": {
    "procesos_manuales": { "label": "...", "description": "..." },
    "falta_visibilidad": { "label": "...", "description": "..." },
    "ventas_estancadas": { "label": "...", "description": "..." },
    "presencia_online": { "label": "...", "description": "..." },
    "sin_trazabilidad": { "label": "...", "description": "..." },
    "atencion_cliente": { "label": "...", "description": "..." }
  },
  "hints": ["...", "...", "..."]
}`

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      max_tokens: 600,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Responde siempre con JSON válido. No incluyas texto fuera del JSON." },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía del LLM")

    const parsed: AIResponse = JSON.parse(text)

    // Validate structure
    if (!parsed.overrides || typeof parsed.overrides !== "object") {
      throw new Error("Estructura inválida")
    }

    // Sanitize: keep only known pain point keys
    const validKeys = PAIN_POINTS.map((p) => p.value).filter((v) => v !== "otro")
    const sanitized: Record<string, PainOverride> = {}
    for (const key of validKeys) {
      const entry = parsed.overrides[key]
      if (entry && typeof entry.label === "string" && typeof entry.description === "string") {
        sanitized[key] = {
          label: entry.label.slice(0, 80),
          description: entry.description.slice(0, 120),
        }
      }
    }

    const hints = Array.isArray(parsed.hints)
      ? parsed.hints.filter((h): h is string => typeof h === "string").slice(0, 3).map((h) => h.slice(0, 150))
      : []

    return NextResponse.json({ overrides: sanitized, hints })
  } catch (error) {
    console.error("Error en /api/ai/pain-points:", error)
    try {
      const body = await request.clone().json().catch(() => ({ industria: "" }))
      return NextResponse.json(getFallback(body.industria ?? ""))
    } catch {
      return NextResponse.json({ overrides: {}, hints: [] })
    }
  }
}

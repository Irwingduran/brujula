import OpenAI from "openai"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getKnowledgePack, getPromptGuidance } from "@/lib/diagnostico/knowledge"

function mapToIndustryCode(industria: string): string {
  const map: Record<string, string> = {
    restaurante: "servicios",
    retail: "retail",
    servicios_profesionales: "servicios",
    salud: "servicios",
    educacion: "servicios",
    inmobiliaria: "servicios",
    tecnologia: "servicios",
    manufactura: "servicios",
    logistica: "servicios",
  }
  return map[industria] ?? "servicios"
}

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json()
    if (!leadId) {
      return NextResponse.json({ error: "leadId requerido" }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const industryCode = mapToIndustryCode(lead.industria)
    const knowledge = getKnowledgePack(industryCode)
    const industryLabel = knowledge?.industryLabel ?? lead.industria

    const ra = lead.respuestas_branch as Record<string, string>
    const wa = lead.website_analisis as Record<string, unknown> | null
    const diagIa = lead.diagnostico_ia as Record<string, unknown> | null
    const diag = lead.diagnostico as Record<string, unknown> | null

    const queryContexto = `Plan de desarrollo para ${lead.industria}. Dolores: ${lead.dolores_principales.join(", ")}. Herramientas: ${lead.herramientas_actuales.join(", ")}. Presupuesto: ${lead.presupuesto}. Urgencia: ${lead.urgencia}`
    const guidance = await getPromptGuidance(industryCode, { query: queryContexto, segmento: null, topK: 5 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getFallback(lead.industria, industryLabel))
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `Eres un consultor técnico senior que diseña planes de desarrollo para agencias que venden soluciones digitales a PYMEs. Tu trabajo es analizar los datos de un lead y generar un plan de desarrollo que el AGENCIA/ADMIN pueda ejecutar.

DATOS DEL LEAD:
- Industria: ${lead.industria}
- Tamaño: ${lead.tamano_empresa}
- Dolores principales: ${lead.dolores_principales.join(", ")}
- Herramientas actuales: ${lead.herramientas_actuales.join(", ")}
- Presupuesto: ${lead.presupuesto}
- Urgencia: ${lead.urgencia}
- Respuestas de situación: ${JSON.stringify(ra)}
${lead.respuestas_ia?.length ? `- Respuestas profundas: ${lead.respuestas_ia.join(" | ")}` : ""}
${wa ? `- Análisis de sitio web: ${JSON.stringify(wa)}` : ""}
${diagIa?.patron_negocio ? `- Patrón detectado: ${diagIa.patron_negocio}` : ""}
${diagIa?.riesgo_principal ? `- Riesgo: ${diagIa.riesgo_principal}` : ""}
${diagIa?.cambio_clave ? `- Cambio clave: ${diagIa.cambio_clave}` : ""}

${guidance}

Genera este JSON exacto con el plan de desarrollo para el ADMIN/AGENCIA:

{
  "diagnostico_tecnico": "Análisis técnico del negocio del lead en 3-4 oraciones. ¿Qué está pasando realmente? ¿Cuál es el core del problema desde una perspectiva de soluciones digitales?",

  "soluciones_recomendadas": [
    {
      "problema": "Problema específico del lead (1 oración, referenciando SUS respuestas)",
      "solucion": "Solución concreta que la agencia puede vender/implementar (ej: 'CRM con automatización de seguimiento en HubSpot')",
      "herramientas_sugeridas": ["HubSpot", "Toggl", "PandaDoc"],
      "complejidad": "baja" | "media" | "alta",
      "prioridad": "alta" | "media" | "baja",
      "tiempo_estimado": "string (ej: '1-2 semanas')"
    }
  ],
  "max 4 soluciones, ordenadas por prioridad.",

  "roadmap_implementacion": {
    "fase_1": "Quick wins - qué implementar en las primeras 2 semanas para mostrar valor rápido",
    "fase_2": "Core - implementación principal del sistema recomendado (1-2 meses)",
    "fase_3": "Escalado - optimización, automatización y métricas (mes 3+)"
  },

  "observaciones_sitio_web": "Integración de los hallazgos del sitio web del lead en el plan. Si no hay sitio web analizado, di 'No se analizó sitio web'. Si hay, menciona qué oportunidades del sitio web impactan en las soluciones recomendadas.",

  "plan_seguimiento": "Plan para que el admin/agencia haga seguimiento con el lead. Incluye: qué decir, qué mostrar, cada cuánto contactarlo, y cómo cerrar la venta basado en el diagnóstico."
}

REGLAS:
- No inventes datos. Usa SOLO la información del lead.
- Las soluciones deben ser herramientas y plataformas reales (HubSpot, Toggl, Clockify, PandaDoc, Stripe, Deel, Google Workspace, Shopify, etc.)
- La prioridad debe reflejar la urgencia que el lead indicó.
- La complejidad debe considerar el presupuesto del lead.
- El plan de seguimiento debe ser específico para este lead, no genérico.`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1500,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres un planificador técnico senior para una agencia de soluciones digitales. Tus planes son específicos, ejecutables, y conectan los datos del lead con soluciones reales que la agencia puede implementar.",
        },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(text)

    const required = ["diagnostico_tecnico", "soluciones_recomendadas", "roadmap_implementacion", "observaciones_sitio_web", "plan_seguimiento"]
    for (const key of required) {
      if (!parsed[key]) throw new Error(`Campo faltante: ${key}`)
    }

    // Save to lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { plan_desarrollo: parsed as any },
    })

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando plan de desarrollo:", error)
    const { leadId } = await request.json().catch(() => ({ leadId: null }))
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } }).catch(() => null)
      const industryLabel = lead ? (getKnowledgePack(mapToIndustryCode(lead.industria))?.industryLabel ?? lead.industria) : "PYME"
      const fb = getFallback(lead?.industria ?? "general", industryLabel)
      if (lead) {
        await prisma.lead.update({ where: { id: leadId }, data: { plan_desarrollo: fb as any } }).catch(() => {})
      }
      return NextResponse.json(fb)
    }
    return NextResponse.json({ error: "Error generando plan de desarrollo" }, { status: 500 })
  }
}

function getFallback(industria: string, industryLabel: string) {
  return {
    diagnostico_tecnico: `El lead es del sector ${industryLabel} y reporta procesos manuales como principal dolor. La falta de herramientas digitales limita su capacidad de escalar y medir resultados.`,
    soluciones_recomendadas: [
      {
        problema: "Procesos manuales que consumen tiempo sin métricas claras",
        solucion: "Automatización de procesos con herramientas low-code y CRM básico",
        herramientas_sugeridas: ["HubSpot", "Zapier", "Google Workspace"],
        complejidad: "baja",
        prioridad: "alta",
        tiempo_estimado: "2-3 semanas",
      },
    ],
    roadmap_implementacion: {
      fase_1: "Diagnóstico detallado del lead y priorización del proceso más crítico a automatizar",
      fase_2: "Implementación de la solución core con ajustes basados en feedback",
      fase_3: "Medición de resultados y escalado a procesos secundarios",
    },
    observaciones_sitio_web: "No se pudo analizar el sitio web del lead para integrar hallazgos en el plan.",
    plan_seguimiento: "Contactar al lead a los 3 días de enviado el diagnóstico para presentar el plan. Agenda una llamada de 30 min para mostrar la solución prioritaria.",
  }
}
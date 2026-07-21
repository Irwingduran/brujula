import OpenAI from "openai"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { AIDiagnosisContextSchema, BranchAnswersSchema, DevelopmentPlanSchema, LeadIdRequestSchema, WebsiteAnalysisSchema } from "@/lib/ai/contracts"
import { getKnowledgePack, getPromptGuidance } from "@/lib/diagnostico/knowledge"
import { mapIndustria } from "@/lib/diagnostico/classifier"

export async function POST(request: Request) {
  try {
    const requestData = LeadIdRequestSchema.safeParse(await request.json())
    if (!requestData.success) {
      return NextResponse.json({ error: "leadId requerido" }, { status: 400 })
    }
    const { leadId } = requestData.data

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const industryCode = mapIndustria(lead.industria)
    const knowledge = getKnowledgePack(industryCode)
    const industryLabel = knowledge?.industryLabel ?? lead.industria

    const branchResult = BranchAnswersSchema.safeParse(lead.respuestas_branch)
    const ra = branchResult.success ? branchResult.data : {}
    const websiteResult = WebsiteAnalysisSchema.nullable().safeParse(lead.website_analisis)
    const wa = websiteResult.success ? websiteResult.data : null
    const aiDiagnosisResult = AIDiagnosisContextSchema.nullable().safeParse(lead.diagnostico_ia)
    const diagIa = aiDiagnosisResult.success ? aiDiagnosisResult.data : null

    const queryContexto = `Plan de desarrollo para ${lead.industria}. Dolores: ${lead.dolores_principales.join(", ")}. Herramientas: ${lead.herramientas_actuales.join(", ")}. Presupuesto: ${lead.presupuesto}. Urgencia: ${lead.urgencia}`
    const guidance = await getPromptGuidance(industryCode, { query: queryContexto, segmento: null, etapa: "plan_desarrollo" })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getFallback(industryLabel))
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

    const plan = DevelopmentPlanSchema.parse(JSON.parse(text))

    // Save to lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { plan_desarrollo: plan },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error generando plan de desarrollo:", error)
    const { leadId } = await request.json().catch(() => ({ leadId: null }))
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } }).catch(() => null)
      const industryLabel = lead ? (getKnowledgePack(mapIndustria(lead.industria))?.industryLabel ?? lead.industria) : "PYME"
      const fb = getFallback(industryLabel)
      if (lead) {
        await prisma.lead.update({ where: { id: leadId }, data: { plan_desarrollo: fb } }).catch(() => {})
      }
      return NextResponse.json(fb)
    }
    return NextResponse.json({ error: "Error generando plan de desarrollo" }, { status: 500 })
  }
}

function getFallback(industryLabel: string) {
  return DevelopmentPlanSchema.parse({
    diagnostico_tecnico: `No fue posible validar el diagnóstico técnico del negocio en ${industryLabel}. Antes de recomendar una solución, se debe confirmar el proceso prioritario, su volumen y los indicadores actuales.`,
    soluciones_recomendadas: [
      {
        problema: "Procesos manuales que consumen tiempo sin métricas claras",
        solucion: "Validar el proceso prioritario y seleccionar una solución proporcional al negocio",
        herramientas_sugeridas: [],
        complejidad: "media",
        prioridad: "alta",
        tiempo_estimado: "Por definir después de validar alcance y prerrequisitos",
      },
    ],
    roadmap_implementacion: {
      fase_1: "Diagnóstico detallado del lead y priorización del proceso más crítico a automatizar",
      fase_2: "Implementación de la solución core con ajustes basados en feedback",
      fase_3: "Medición de resultados y escalado a procesos secundarios",
    },
    observaciones_sitio_web: "No se pudo analizar el sitio web del lead para integrar hallazgos en el plan.",
    plan_seguimiento: "Contactar al lead para validar el proceso prioritario, su volumen, responsables y métrica base antes de presentar una propuesta.",
  })
}
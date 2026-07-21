import OpenAI from "openai"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { AIDiagnosisContextSchema, BriefingSchema, LeadIdRequestSchema, ScoreBreakdownSchema, WebsiteAnalysisSchema } from "@/lib/ai/contracts"
import { getPromptGuidance } from "@/lib/diagnostico/knowledge"
import { mapIndustria } from "@/lib/diagnostico/classifier"
import type { Lead } from "@prisma/client"

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

    // Don't regenerate if already exists
    if (lead.briefing_profesional) {
      return NextResponse.json(lead.briefing_profesional)
    }

    if (!process.env.OPENAI_API_KEY) {
      const fallback = getFallback(lead)
      await prisma.lead.update({
        where: { id: leadId },
        data: { briefing_profesional: fallback as object },
      })
      return NextResponse.json(fallback)
    }

    const scoreResult = ScoreBreakdownSchema.nullable().safeParse(lead.score)
    const score = scoreResult.success ? scoreResult.data : null
    const aiDiagnosisResult = AIDiagnosisContextSchema.nullable().safeParse(lead.diagnostico_ia)
    const aiDiag = aiDiagnosisResult.success ? aiDiagnosisResult.data : null
    const websiteResult = WebsiteAnalysisSchema.nullable().safeParse(lead.website_analisis)
    const websiteAnalysis = websiteResult.success ? websiteResult.data : null
    const branchAnswers = lead.respuestas_branch as Record<string, string>

    // Build rich context for the prompt
    const branchContext = Object.entries(branchAnswers)
      .map(([key, val]) => `  - ${key.replace(/_/g, " ")}: ${val}`)
      .join("\n")

    const iaAnswers = lead.respuestas_ia.length > 0
      ? `\nRESPUESTAS DEL ANÁLISIS PROFUNDO:\n${lead.respuestas_ia.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
      : ""

    const websiteContext = websiteAnalysis && !websiteAnalysis.error
      ? `\n\nANÁLISIS DE SU SITIO WEB (${lead.url_sitio}):
- Descripción: ${websiteAnalysis.descripcion ?? "N/A"}
- Contenido: ${websiteAnalysis.resumen_contenido ?? "N/A"}
- Blog: ${websiteAnalysis.tiene_blog ? "Sí" : "No"}
- E-commerce: ${websiteAnalysis.tiene_ecommerce ? "Sí" : "No"}
- Formulario contacto: ${websiteAnalysis.tiene_formulario_contacto ? "Sí" : "No"}
- Redes sociales: ${websiteAnalysis.redes_sociales?.join(", ") || "Ninguna"}
- Oportunidades: ${websiteAnalysis.oportunidades_mejora?.join(", ") || "Ninguna"}`
      : ""

    const aiDiagContext = aiDiag
      ? `\n\nDIAGNÓSTICO IA YA GENERADO:
- Servicio recomendado: ${aiDiag.titulo_servicio}
- Diagnóstico: ${aiDiag.diagnostico_texto}
- Tiempo ahorro estimado: ${aiDiag.tiempo_ahorro}
- Prioridades: ${aiDiag.prioridades_inmediatas?.join(", ") ?? "N/A"}
${aiDiag.hallazgos_web ? `- Fortalezas web: ${aiDiag.hallazgos_web.fortalezas.join(", ")}
- Brechas web: ${aiDiag.hallazgos_web.brechas_criticas.join(", ")}` : ""}`
      : ""

    const scoreContext = score
      ? `\nSCORE: ${score.total}/100 (${score.segmento})
- Presupuesto: ${score.presupuesto}/30
- Urgencia: ${score.urgencia}/25
- Tamaño empresa: ${score.tamano_empresa}/20
- Claridad problema: ${score.claridad_problema}/15
- Industry fit: ${score.industria_fit}/10`
      : ""

    const industryCode = mapIndustria(lead.industria)
    const ragContext = await getPromptGuidance(industryCode, {
      query: `Briefing para llamada con ${lead.industria}. Dolores: ${lead.dolores_principales.join(", ")}. Presupuesto: ${lead.presupuesto}. Urgencia: ${lead.urgencia}`,
      segmento: null,
      etapa: "briefing",
    })
    const ragSection = ragContext
      ? `\n\nCONOCIMIENTO DE LA INDUSTRIA (úsalo para enriquecer el briefing con contexto específico del sector):\n${ragContext}`
      : ""

    const prompt = `Eres un asistente de preparación de meetings para un freelancer/agencia de transformación digital para PYMEs LATAM.

Un prospecto acaba de completar un diagnóstico online. El freelancer tiene una llamada programada con esta persona. Necesitas generar un BRIEFING PROFESIONAL que el freelancer lea en 2 minutos antes del meet.

DATOS DEL PROSPECTO:
- Nombre: ${lead.nombre}
- Email: ${lead.email}
- Industria: ${lead.industria}
- Tamaño: ${lead.tamano_empresa} personas
- Dolores: ${lead.dolores_principales.join(", ")}
- Herramientas actuales: ${lead.herramientas_actuales.join(", ")}
- Presupuesto: ${lead.presupuesto}
- Urgencia: ${lead.urgencia}
- Situación específica:
${branchContext || "  (sin detalles adicionales)"}
${iaAnswers}${scoreContext}${websiteContext}${aiDiagContext}${ragSection}

Genera un briefing COMPLETO con estos campos:

1. resumen_rapido: 3-4 oraciones que resuman TODO lo que el freelancer necesita saber. Incluir: quién es, qué busca, qué tan serio es, y cuál es la oportunidad. Directo y sin rodeos.

2. perfil: Análisis del prospecto:
   - tipo_decision_maker: ¿Quién es? (ej: "Dueño directo del negocio", "Gerente de operaciones", "Emprendedor solo"). Infiere del tamaño de empresa y rol.
   - madurez_digital: "baja", "media" o "alta". Basado en herramientas actuales y respuestas.
   - señales_compra: 3-5 señales positivas (ej: "Urgencia inmediata", "Presupuesto definido >$1K", "Ya intentó soluciones antes"). Basado en datos REALES.
   - riesgos: 2-3 riesgos u objeciones probables (ej: "Presupuesto limitado", "Solo está explorando", "Puede comparar con competencia").

3. ${websiteContext ? `analisis_web_para_profesional: Análisis del sitio web del prospecto PARA EL FREELANCER (no para el cliente):
   - estado_actual: 1-2 oraciones describiendo el estado técnico y visual del sitio. Sé directo.
   - oportunidades_quick_win: 2-3 mejoras rápidas que el freelancer podría ofrecer como gancho.
   - brechas_vs_competencia: 1 oración sobre qué le falta vs. competidores en su industria.
   - recomendacion_tecnica: 1 oración con la recomendación técnica principal.` : 'NO incluyas analisis_web_para_profesional — el prospecto no proporcionó URL de sitio web.'}

4. puntos_conversacion: Guía para el meeting:
   - abrir_con: La frase exacta para abrir la conversación. Debe demostrar que YA revisaste su información. Mencionar algo específico de sus respuestas.
   - profundizar: 3 preguntas clave que el freelancer debe hacer EN EL MEET para entender mejor la oportunidad. No son genéricas — están basadas en lo que el prospecto ya dijo.
   - no_mencionar: 2-3 temas que el freelancer debe EVITAR (ej: "No presionar con precio si dijo que no tiene definido", "No hablar de tecnologías complejas — es negocio chico").
   - cerrar_con: La propuesta o siguiente paso con el que el freelancer debería cerrar el meet.

5. propuesta_sugerida: Propuesta comercial recomendada:
   - servicio_primario: El servicio principal que debería ofrecer (1 frase).
   - servicios_adicionales: 2-3 servicios de cross-sell o upsell que podría sugerir a futuro.
   - rango_precio_sugerido: Rango de precio mensual/proyecto recomendado. REALISTA para LATAM.
   - timeline_implementacion: Tiempo estimado de implementación (ej: "4-6 semanas para MVP").
   - roi_argumento: El argumento de ROI más fuerte. Con números si es posible.

REGLAS CRÍTICAS:
- Este briefing es PARA EL FREELANCER, no para el cliente. Sé directo, analítico, sin marketing.
- Usa los datos REALES del prospecto. No inventes información que no esté en el contexto.
- Los precios deben ser realistas para PYMEs en LATAM (USD).
- Las señales de compra y riesgos deben estar basados en datos concretos de las respuestas.
- El tono es de colega a colega: "Este prospecto tiene X, cuidado con Y, la oportunidad es Z".
- Español LATAM, profesional pero directo.

Responde ÚNICAMENTE con JSON válido:
{
  "resumen_rapido": "...",
  "perfil": {
    "tipo_decision_maker": "...",
    "madurez_digital": "baja|media|alta",
    "señales_compra": ["...", "..."],
    "riesgos": ["...", "..."]
  },${websiteContext ? `
  "analisis_web_para_profesional": {
    "estado_actual": "...",
    "oportunidades_quick_win": ["...", "..."],
    "brechas_vs_competencia": "...",
    "recomendacion_tecnica": "..."
  },` : ''}
  "puntos_conversacion": {
    "abrir_con": "...",
    "profundizar": ["...", "...", "..."],
    "no_mencionar": ["...", "..."],
    "cerrar_con": "..."
  },
  "propuesta_sugerida": {
    "servicio_primario": "...",
    "servicios_adicionales": ["...", "..."],
    "rango_precio_sugerido": "...",
    "timeline_implementacion": "...",
    "roi_argumento": "..."
  }
}`

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1800,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Eres un asistente de preparación de meetings. Generas briefings concisos y accionables para freelancers. Responde siempre con JSON válido." },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const briefing = BriefingSchema.parse({
      ...JSON.parse(text),
      generado_at: new Date().toISOString(),
    })

    // Persist to database
    await prisma.lead.update({
      where: { id: leadId },
      data: { briefing_profesional: briefing as object },
    })

    return NextResponse.json(briefing)
  } catch (error) {
    console.error("Error generando briefing:", error)

    // Try to save fallback
    try {
      const body = await request.clone().json().catch(() => ({ leadId: "" }))
      if (body.leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })
        if (lead) {
          const fallback = getFallback(lead)
          await prisma.lead.update({
            where: { id: body.leadId },
            data: { briefing_profesional: fallback as object },
          })
          return NextResponse.json(fallback)
        }
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      { error: "Error generando briefing" },
      { status: 500 }
    )
  }
}

function getFallback(lead: Pick<Lead, "nombre" | "industria" | "tamano_empresa" | "dolores_principales" | "presupuesto" | "urgencia">) {
  return {
    resumen_rapido: `${lead.nombre} tiene un negocio en el sector ${lead.industria} con un equipo de ${lead.tamano_empresa} personas. Busca soluciones para: ${lead.dolores_principales.join(", ")}. Presupuesto: ${lead.presupuesto}. Urgencia: ${lead.urgencia}.`,
    perfil: {
      tipo_decision_maker: "Contacto directo del negocio",
      madurez_digital: "media" as const,
      señales_compra: [
        "Completó todo el diagnóstico",
        `Urgencia: ${lead.urgencia}`,
        `Presupuesto: ${lead.presupuesto}`,
      ],
      riesgos: [
        "Información limitada para evaluar",
        "Verificar disponibilidad real de presupuesto",
      ],
    },
    puntos_conversacion: {
      abrir_con: `Hola ${lead.nombre}, vi que completaste tu diagnóstico y mencionaste problemas con ${lead.dolores_principales[0]?.replace(/_/g, " ") ?? "tus procesos"} — cuéntame más sobre eso.`,
      profundizar: [
        "¿Cuánto tiempo llevas con este problema?",
        "¿Has intentado resolver esto antes? ¿Qué pasó?",
        "¿Cómo se vería el éxito para ti en 3 meses?",
      ],
      no_mencionar: [
        "No presionar con precio en primera llamada",
        "No usar jerga técnica innecesaria",
      ],
      cerrar_con: "Proponer un plan de acción inicial de 30 días con objetivos medibles.",
    },
    propuesta_sugerida: {
      servicio_primario: "Por definir tras validar las necesidades del negocio",
      servicios_adicionales: [],
      rango_precio_sugerido: "Por definir después de la llamada de validación",
      timeline_implementacion: "Por definir según alcance y prerrequisitos",
      roi_argumento: "No estimado: primero se debe establecer una línea base del proceso a mejorar.",
    },
    generado_at: new Date().toISOString(),
  }
}

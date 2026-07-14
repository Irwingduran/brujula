import OpenAI from "openai"
import { NextResponse } from "next/server"
import { getKnowledgePack, getIndustryBenchmarks } from "@/lib/diagnostico/knowledge"

export async function POST(request: Request) {
  try {
    const { wizardData } = await request.json()

    if (!wizardData?.step1 || !wizardData?.step2) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const step1 = wizardData.step1
    const step2 = wizardData.step2
    const step3 = wizardData.step3

    const industryCode = mapToIndustryCode(step1.industria)
    const knowledge = getKnowledgePack(industryCode)
    const benchmarks = getIndustryBenchmarks(industryCode)
    const guidance = knowledge?.promptGuidance ?? ""

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(getFallback(step1.industria, industryCode))
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const websiteContext = wizardData.websiteAnalysis && !wizardData.websiteAnalysis.error
      ? `
ANÁLISIS DE SU SITIO WEB (${wizardData.websiteAnalysis.url}):
- Descripción detectada: ${wizardData.websiteAnalysis.descripcion}
- Contenido: ${wizardData.websiteAnalysis.resumen_contenido}
- Tiene blog: ${wizardData.websiteAnalysis.tiene_blog ? "Sí" : "No"}
- Tiene tienda online: ${wizardData.websiteAnalysis.tiene_ecommerce ? "Sí" : "No"}
- Tiene formulario de contacto: ${wizardData.websiteAnalysis.tiene_formulario_contacto ? "Sí" : "No"}
- Redes sociales detectadas: ${wizardData.websiteAnalysis.redes_sociales.join(", ") || "Ninguna"}
- Oportunidades detectadas en el sitio: ${wizardData.websiteAnalysis.oportunidades_mejora?.join(", ") || "Ninguna"}`
      : ""

    const benchmarksText = benchmarks.length
      ? `\nBENCHMARKS REALES DE SU INDUSTRIA:\n${benchmarks.map((b) => `- ${b.metrica}: ${b.valor} — ${b.descripcion}`).join("\n")}`
      : ""

    const prompt = `Eres un consultor senior especializado en la industria del prospecto. No eres un consultor genérico de "transformación digital". Eres un experto que entiende los detalles específicos de su tipo de negocio.

DATOS DEL PROSPECTO:
- Industria: ${step1.industria}${step1.industria_otra ? ` (${step1.industria_otra})` : ""}
- Tamaño de empresa: ${step1.tamano_empresa}
- Dolores principales que él mismo identificó: ${step1.dolores_principales.join(", ")}${step1.dolor_otro ? ` (${step1.dolor_otro})` : ""}
- Herramientas que usa hoy: ${step1.herramientas_actuales.join(", ")}${step1.herramienta_otra ? ` (${step1.herramienta_otra})` : ""}
- Presupuesto: ${step2.presupuesto}
- Urgencia: ${step2.urgencia}
- Respuestas a preguntas de situación: ${JSON.stringify(step2.respuestas_branch)}
${step3?.respuestas_ia?.length ? `- Respuestas a preguntas profundas:\n${step3.respuestas_ia.map((r: string, i: number) => `  ${i + 1}. ${r}`).join("\n")}` : ""}
${websiteContext}
${benchmarksText}

${guidance}

INSTRUCCIONES CRÍTICAS (léelas en orden):

1. ANTES DE ESCRIBIR, identifica el patrón principal: ¿cuál es el problema #1 que este negocio tiene basado en SUS propias respuestas? Debes poder señalarlo con datos concretos de lo que dijo.

2. GENERA EXACTAMENTE este JSON. No más campos, no menos. Cada campo tiene un propósito específico:

{
  "diagnostico_texto": "Máximo 4 oraciones. Empieza con 'Notamos que...' o 'Vemos que...' y referencia UNA respuesta concreta del prospecto. Ej: 'Notamos que dedicas 15+ horas semanales a tareas manuales según tus respuestas.' Luego conecta eso con el impacto en su negocio. Sé quirúrgico, no genérico.",

  "beneficios": [
    "Beneficio 1 — Debe empezar con verbo concreto (recupera, elimina, duplica, reduce) e incluir número o porcentaje creíble. Ej: 'Recupera 8 horas semanales que hoy pierdes en cotizaciones manuales.'",
    "Beneficio 2 — Debe estar conectado a OTRO dolor diferente del que usaste en el primero. Ej: 'Elimina la incertidumbre de no saber qué clientes están por renovar.'",
    "Beneficio 3 — Debe ser un resultado aspiracional pero realista. Ej: 'Duplica tus clientes recurrentes con un sistema de seguimiento automático.'"
  ],

  "plan_30_60_90": {
    "dia_30": "Acción concreta y específica para el primer mes. Incluye herramienta o método. Ej: 'Implementa Toggl o Clockify para registrar horas facturables.' Máx 12 palabras.",
    "dia_60": "Acción del segundo mes. Debe construir sobre el primer paso. Ej: 'Automatiza facturación recurrente con Stripe o Deel.' Máx 12 palabras.",
    "dia_90": "Resultado o consolidación. Ej: 'Sistema completo de seguimiento de clientes sin effort manual.' Máx 12 palabras."
  },

  "sugerencia_mejora": "EXACTAMENTE 2 oraciones. PRIMERA: La recomendación más importante que le darías en este momento, en lenguaje de dueño de negocio. SEGUNDA: El impacto específico que tendrá. Ej: 'Empieza por registrar tu tiempo esta semana con una herramienta gratuita como Toggl. Ese simple hábito te mostrará en 7 días exactamente dónde se están escapando tus horas facturables.'",

  "caso_exito": {
    "empresa": "Nombre ficticio pero creíble para esta industria",
    "industria": "${step1.industria}",
    "problema": "1 oración. Debe ser similar al dolor principal del prospecto.",
    "solucion": "1 oración con la solución que implementaron.",
    "resultado": "1 oración con 2 cifras concretas (porcentajes o tiempos)."
  }
}

3. REGLAS DE ORO (violar cualquiera invalida el diagnóstico):
- NO uses la palabra "transformación digital" NUNCA
- NO uses "optimización", "mejora continua", "sinergia", "empoderar", "maximizar"
- NO empieces ninguna oración con frases como "Basado en nuestro análisis" o "Hemos identificado"
- CADA beneficio debe referirse a un dolor específico que el prospecto mencionó
- Si el prospecto dijo que usa Excel, menciónalo. Si dijo que tiene X empleados, úsalo.
- El plan_30_60_90 debe ser tan específico que el prospecto pueda googlear la herramienta que mencionas
- El caso de éxito debe sonar a un negocio real, no a un cuento de marketing

4. EJEMPLO de un buen diagnóstico vs malo:

❌ MALO (genérico, suena a plantilla):
"Tu negocio tiene oportunidades de mejora digital. Implementar herramientas tecnológicas puede ayudarte a ser más eficiente y productivo."

✅ BUENO (específico, usa sus datos):
"Notamos que como consultor independiente, inviertes más de 10 horas semanales en cotizaciones y facturación manual. Eso es tiempo que podrías estar dedicando a clientes que pagan. El problema no es que seas lento, es que no tienes las herramientas adecuadas para un profesional de tu nivel."`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1200,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres un consultor de negocios que habla con dueños de PYME como un colega experimentado, no como un vendedor. Tus diagnósticos son cortos, precisos y tan específicos que el dueño siente que realmente entiendes su negocio. Respondes siempre en JSON válido.",
        },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(text)

    const required = ["diagnostico_texto", "beneficios", "plan_30_60_90", "sugerencia_mejora", "caso_exito"]
    for (const key of required) {
      if (!parsed[key]) throw new Error(`Campo faltante: ${key}`)
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando diagnóstico IA:", error)
    const { wizardData } = await request.json().catch(() => ({ wizardData: null }))
    const industria = wizardData?.step1?.industria ?? "general"
    const industryCode = mapToIndustryCode(industria)
    return NextResponse.json(getFallback(industria, industryCode))
  }
}

function mapToIndustryCode(industria: string): string {
  const map: Record<string, string> = {
    restaurante: "food",
    retail: "retail",
    servicios_profesionales: "servicios",
    salud: "salud",
    educacion: "educacion",
    inmobiliaria: "servicios",
    tecnologia: "servicios",
    manufactura: "manufactura",
    logistica: "manufactura",
  }
  return map[industria] ?? "otro"
}

function getFallback(industria: string, industryCode: string) {
  const knowledge = getKnowledgePack(industryCode)
  const fb = knowledge?.fallbackDiagnosis
  const story = knowledge?.successStories?.[0]
  const label = knowledge?.industryLabel ?? industria

  if (fb) {
    return {
      diagnostico_texto: fb.texto,
      beneficios: fb.beneficios,
      plan_30_60_90: fb.plan,
      sugerencia_mejora: fb.sugerencia,
      caso_exito: story ?? {
        empresa: "Negocio Digital MX",
        industria,
        problema: "Perdían horas cada semana en procesos manuales y seguimiento a clientes.",
        solucion: "Implementaron un sistema de automatización y CRM digital adaptado a su operación.",
        resultado: "Redujeron un 40% el tiempo operativo y aumentaron sus ventas un 25% en 3 meses.",
      },
    }
  }

  return {
    diagnostico_texto: "Revisamos tu situación y encontramos un patrón claro: hay procesos que consumen más tiempo del necesario. La buena noticia es que los cambios más importantes no requieren gran inversión, solo un enfoque distinto.",
    beneficios: [
      "Menos tiempo en tareas que no generan ingresos",
      "Más claridad sobre el estado real de tu negocio",
      "Mejor relación con tus clientes gracias a seguimiento constante",
    ],
    plan_30_60_90: {
      dia_30: "Identifica el proceso que más tiempo consume y documéntalo",
      dia_60: "Implementa una herramienta digital para ese proceso específico",
      dia_90: "Evalúa resultados y repite con el siguiente proceso prioritario",
    },
    sugerencia_mejora: "Empieza por algo pequeño pero concreto: elige EL proceso que más te frustre y busca una herramienta específica para resolverlo. No intentes cambiar todo a la vez.",
    caso_exito: {
      empresa: "Crecimiento Digital MX",
      industria,
      problema: "Perdían tiempo valioso en procesos manuales y falta de seguimiento a clientes.",
      solucion: "Implementaron herramientas digitales básicas enfocadas en sus procesos más críticos.",
      resultado: "Redujeron un 40% el tiempo operativo y aumentaron su capacidad de atención en un 30%.",
    },
  }
}

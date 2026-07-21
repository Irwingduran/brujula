import OpenAI from "openai"
import { NextResponse } from "next/server"
import { getKnowledgePack, getIndustryBenchmarks, getPromptGuidance } from "@/lib/diagnostico/knowledge"
import { mapIndustria } from "@/lib/diagnostico/classifier"

export async function POST(request: Request) {
  try {
    const { wizardData } = await request.json()

    if (!wizardData?.step1 || !wizardData?.step2) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const step1 = wizardData.step1
    const step2 = wizardData.step2
    const step3 = wizardData.step3

  const industryCode = mapIndustria(step1.industria)
  const knowledge = getKnowledgePack(industryCode)
  const industryLabel = knowledge?.industryLabel ?? step1.industria

  const queryContexto = `Diagnóstico para ${step1.industria}. Dolores: ${step1.dolores_principales.join(", ")}. Herramientas: ${step1.herramientas_actuales.join(", ")}${step3?.respuestas_ia?.length ? `. Respuestas profundas: ${step3.respuestas_ia.join(", ")}` : ""}`

  const [benchmarks, guidance] = await Promise.all([
    getIndustryBenchmarks(industryCode, { query: queryContexto, segmento: null }),
    getPromptGuidance(industryCode, { query: queryContexto, segmento: null, etapa: "diagnostico" }),
  ])

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(getFallback(step1.industria, industryCode))
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const website = step1.website_analysis
  const websiteContext = website && !website.error
    ? `
ANÁLISIS DE SU SITIO WEB (${website.url}):
- Descripción detectada: ${website.descripcion}
- Contenido: ${website.resumen_contenido}
- Tiene blog: ${website.tiene_blog ? "Sí" : "No"}
- Tiene tienda online: ${website.tiene_ecommerce ? "Sí" : "No"}
- Tiene formulario de contacto: ${website.tiene_formulario_contacto ? "Sí" : "No"}
- Redes sociales detectadas: ${website.redes_sociales?.join(", ") || "Ninguna"}
- Oportunidades detectadas en el sitio: ${website.oportunidades_mejora?.join(", ") || "Ninguna"}`
      : ""

  const benchmarksText = benchmarks.length
    ? `\nBENCHMARKS REALES DE SU INDUSTRIA:\n${benchmarks.map((b) => `- ${b.metrica}: ${b.valor} — ${b.descripcion}`).join("\n")}`
    : ""

  const prompt = `Eres un consultor de negocios real. Tu trabajo es analizar las respuestas de un dueño de negocio y darle UN diagnóstico que realmente le ayude. No le vendas herramientas, no le des tips genéricos. Hazle entender cómo opera hoy, cuál es su riesgo real, y qué cambiar estratégicamente.

DATOS DEL USUARIO:
industria=${step1.industria}
respuestas_branch=${JSON.stringify(step2.respuestas_branch)}
dolores_principales=${step1.dolores_principales.join(", ")}
herramientas=${step1.herramientas_actuales.join(", ")}
${step3?.respuestas_ia?.length ? `respuestas_profundas=${step3.respuestas_ia.join(" | ")}` : ""}
${websiteContext ? "web=" + websiteContext : ""}
benchmarks=${benchmarksText}

${guidance}

Debes generar 4 campos de análisis + 1 caso de éxito. Cada campo tiene un PROPÓSITO distinto:

1. patron_negocio — Describe CÓMO opera hoy el negocio conectando TODAS sus respuestas en un solo párrafo coherente. No menciones herramientas. No digas "debería". Solo describe el patrón actual. Ej: "Según tus respuestas, tu operación funciona así: los clientes llegan solo por referidos sin ningún canal digital activo, cada proyecto lo cotizas desde cero sin plantillas ni precios definidos, no registras el tiempo que dedicas, y una vez que entregas, el cliente no vuelve a saber de ti hasta que necesita algo. Esto significa que cada proyecto empieza y termina como si fuera el primero, sin construir valor con el tiempo."

2. riesgo_principal — Identifica el ÚNICO riesgo de negocio más grande que tiene HOY. No es "falta de herramienta X". Es un riesgo de negocio real. Explica qué pasará en 6-12 meses si no cambia. Ej: "Tu riesgo más grande no es técnico: es que no tienes ni idea de si estás ganando o perdiendo dinero en cada proyecto. Sin registro de horas, tus precios son corazonadas. Sin seguimiento post-servicio, cada cliente termina siendo el último. Hoy creces por inercia, no por decisión."

3. cambio_clave — El ÚNICO cambio estratégico que más impactaría su negocio. No es una herramienta. Es un cambio de paradigma. Ej: "El cambio que más impactaría tu negocio no es comprar un software: es empezar a medir antes de decidir. Necesitas una semana de datos para saber a dónde se va tu tiempo. Con eso, puedes dejar de cotizar por corazonada y empezar a cobrar por convicción."

4. plan_90_dias — Plan narrativo en 3 párrafos cortos, uno por mes. Cada párrafo explica QUÉ cambiar y POR QUÉ, no solo qué instalar. Mes 1: diagnóstico y medición. Mes 2: ajuste estructural basado en datos. Mes 3: sistema que funciona solo.

5. caso_exito — Historia de un negocio similar que resolvió el mismo patrón.

Responde SOLO con este JSON exacto:
{
  "patron_negocio": "string",
  "riesgo_principal": "string",
  "cambio_clave": "string",
  "plan_90_dias": { "mes_1": "string", "mes_2": "string", "mes_3": "string" },
  "caso_exito": { "empresa": "string", "industria": "${industryLabel}", "problema": "string", "solucion": "string", "resultado": "string" }
}

REGLAS: No menciones "transformación digital", "optimización", "mejora continua", "sinergia". No inventes datos que el usuario no dio. No recomiendes herramientas específicas a menos que el plan lo requiera y siempre conectado a un hecho del usuario.`

  const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1000,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres un consultor senior que analiza negocios. Tus diagnósticos conectan todas las respuestas del cliente en un patrón coherente y señalan el riesgo de negocio real, no la falta de una herramienta.",
        },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(text)

    const required = ["patron_negocio", "riesgo_principal", "cambio_clave", "plan_90_dias", "caso_exito"]
    for (const key of required) {
      if (!parsed[key]) throw new Error(`Campo faltante: ${key}`)
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando diagnóstico IA:", error)
    const { wizardData } = await request.json().catch(() => ({ wizardData: null }))
    const industria = wizardData?.step1?.industria ?? "general"
    const industryCode = mapIndustria(industria)
    return NextResponse.json(getFallback(industria, industryCode))
  }
}

function getFallback(industria: string, industryCode: string) {
  const knowledge = getKnowledgePack(industryCode)
  const fb = knowledge?.fallbackDiagnosis
  const story = knowledge?.successStories?.[0]
  const label = knowledge?.industryLabel ?? industria

  if (fb) {
    return {
      patron_negocio: fb.texto,
      riesgo_principal: `Sin datos concretos sobre tu operación, cada decisión es una corazonada. Esto frena el crecimiento porque no sabes qué está funcionando y qué no.`,
      cambio_clave: fb.sugerencia,
      plan_90_dias: {
        mes_1: fb.plan.dia_30,
        mes_2: fb.plan.dia_60,
        mes_3: fb.plan.dia_90,
      },
      caso_exito: story ?? {
        empresa: "Negocio Digital MX",
        industria: label,
        problema: "Perdían horas cada semana en procesos manuales sin tener claridad de su rentabilidad real.",
        solucion: "Implementaron un sistema de medición y automatización adaptado a su operación específica.",
        resultado: "Redujeron un 40% el tiempo operativo y aumentaron su capacidad de atención en un 30%.",
      },
    }
  }

  return {
    patron_negocio: "Según tus respuestas, tu negocio opera con procesos manuales que consumen tiempo sin que tengas visibilidad clara del impacto en tu rentabilidad. Esto es común en negocios en crecimiento: la operación del día a día no deja espacio para medir y ajustar.",
    riesgo_principal: "Tu riesgo más grande es seguir invirtiendo tiempo en tareas que no sabes si son rentables. Sin medir, no puedes mejorar. Sin mejorar, no puedes crecer de forma sostenible.",
    cambio_clave: "El cambio que más impacto tendría no es comprar una herramienta: es empezar a medir una métrica esta semana. Una sola. El dato te va a mostrar dónde está el verdadero cuello de botella.",
    plan_90_dias: {
      mes_1: "Elige el proceso que más tiempo te consume y documéntalo durante una semana. No cambies nada, solo mide. Al final de la semana tendrás datos que hoy no tienes.",
      mes_2: "Con los datos del primer mes, identifica QUÉ parte de ese proceso es desperdicio. Busca una forma de reducirla o eliminarla, así sea con una hoja de cálculo mejor organizada.",
      mes_3: "Repite el ciclo con el siguiente proceso. En tres meses tendrás un mapa claro de tu operación y sabrás exactamente dónde invertir tu tiempo y dinero.",
    },
    caso_exito: {
      empresa: "Crecimiento Digital MX",
      industria: label,
      problema: "Invertían 15+ horas semanales en tareas administrativas sin saber el impacto en rentabilidad.",
      solucion: "Midieron una semana de operación, identificaron el 40% de tiempo desperdiciado, y lo redujeron con cambios de proceso, no de herramientas.",
      resultado: "Recuperaron 8 horas semanales y aumentaron su capacidad de clientes sin contratar más personal.",
    },
  }
}

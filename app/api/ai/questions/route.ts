import OpenAI from "openai"
import { NextResponse } from "next/server"

// Tipado opcional para websiteAnalysis (recomendado para TypeScript estricto)
interface WebsiteAnalysis {
  url: string
  descripcion: string
  resumen_contenido: string
  tiene_blog: boolean
  tiene_ecommerce: boolean
  tiene_formulario_contacto: boolean
  redes_sociales: string[]
  oportunidades_mejora?: string[]
  error?: boolean
}

interface Step1 {
  industria: string
  industria_otra?: string
  tamano_empresa: string
  dolores_principales: string[]
  dolor_otro?: string
  herramientas_actuales: string[]
  herramienta_otra?: string
  websiteAnalysis?: WebsiteAnalysis
}

interface Step2 {
  presupuesto: string
  urgencia: string
  respuestas_branch: Record<string, string>
}

export async function POST(request: Request) {
  let round = 1
  try {
    const body = await request.json()
    round = body.round ?? 1
    const { step1, step2, previousAnswers = [] } = body as {
      step1: Step1
      step2: Step2
      previousAnswers?: Array<{ question: string; answer: string }>
    }

    if (!step1 || !step2) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const maxQuestions = round === 1 ? 3 : 2

    // Si no hay API key, retornar preguntas de fallback
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY no configurada, usando preguntas de fallback")
      return NextResponse.json(getFallbackQuestions(round))
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // === CONTEXTO DE RESPUESTAS ANTERIORES ===
    const previousContext = previousAnswers.length > 0
      ? `\n\nRESPUESTAS ANTERIORES DEL PROSPECTO (Ronda ${round - 1}):\n${previousAnswers.map((a, i) => `${i + 1}. Pregunta: "${a.question}" → Respuesta: "${a.answer}"`).join("\n")}\n\nUSA estas respuestas para hacer preguntas MÁS PROFUNDAS y específicas. NO repitas temas ya cubiertos.`
      : ""

    // === CONTEXTO DE BRANCH (situación específica) ===
    const branchEntries = Object.entries(step2.respuestas_branch || {})
    const branchLabels: Record<string, string> = {
      "proceso_mas_lento": "Proceso más lento",
      "horas_semana": "Horas semanales en tareas repetitivas",
      "metricas_actuales": "Métricas actuales",
      "decisiones_datos": "Toma de decisiones",
      "canal_principal": "Canal principal de ventas",
      "problema_ventas": "Principal freno de ventas",
      "presencia_actual": "Presencia online actual",
      "objetivo_online": "Objetivo de presencia online",
      "frecuencia_atencion": "Frecuencia de atención al cliente",
      "canales_atencion": "Canales de atención al cliente",
      "herramienta_seguimiento": "Herramienta de seguimiento",
      "volumen_mensual": "Volumen mensual",
      "facturacion": "Facturación",
      "inventario": "Inventario",
      "seguimiento_pedidos": "Seguimiento de pedidos",
      "nomina_rrhh": "Nómina/RRHH",
      "reportes": "Reportes/Contabilidad",
      "comunicacion": "Comunicación interna",
      "menos_5": "Menos de 5h",
      "5_15": "5-15h",
      "15_30": "15-30h",
      "mas_30": "Más de 30h",
      "ventas": "Ventas mensuales",
      "satisfaccion": "Satisfacción del cliente",
      "ninguna": "Ninguna métrica",
      "intuicion": "Por intuición",
      "datos_basicos": "Datos básicos (Excel)",
      "tienda_fisica": "Tienda física",
      "online": "Tienda online",
      "redes": "Redes sociales",
      "referidos": "Referidos",
      "pocos_leads": "Pocos leads",
      "mal_seguimiento": "Mal seguimiento",
      "competencia_precios": "Competencia de precios",
      "falta_marketing": "Falta de marketing",
      "nada": "Ninguna presencia",
      "redes_basicas": "Redes sociales básicas",
      "web_basica": "Web básica",
      "web_completa": "Web completa + redes",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "presencial": "Presencial",
      "telefonico": "Telefónico",
      "excel": "Excel",
      "crm_basico": "CRM básico",
      "ninguna_herramienta": "Ninguna herramienta",
    }
    const branchContext = branchEntries.length > 0
      ? branchEntries.map(([key, val]) => {
          const label = branchLabels[key] ?? key.replace(/_/g, " ")
          const valLabel = branchLabels[val] ?? val
          return `  - ${label}: ${valLabel} (${val})`
        }).join("\n")
      : "  (sin respuestas específicas)"

    // === CONTEXTO DE ANÁLISIS DE SITIO WEB ===
    const websiteContext = step1.websiteAnalysis && !step1.websiteAnalysis.error
      ? `\n\n🌐 ANÁLISIS DE SU SITIO WEB (${step1.websiteAnalysis.url}):
- Descripción: ${step1.websiteAnalysis.descripcion}
- Contenido principal: ${step1.websiteAnalysis.resumen_contenido}
- Tiene blog: ${step1.websiteAnalysis.tiene_blog ? "Sí" : "No"}
- Tiene tienda online: ${step1.websiteAnalysis.tiene_ecommerce ? "Sí" : "No"}
- Tiene formulario de contacto: ${step1.websiteAnalysis.tiene_formulario_contacto ? "Sí" : "No"}
- Redes sociales detectadas: ${step1.websiteAnalysis.redes_sociales.join(", ") || "Ninguna"}
- Oportunidades detectadas: ${step1.websiteAnalysis.oportunidades_mejora?.join(", ") || "Ninguna"}

🎯 INSTRUCCIONES PARA USAR ESTE CONTEXTO:
- NO preguntes sobre elementos que YA existen en su sitio (ej: si ya tiene blog, no preguntes "¿te interesa tener blog?")
- SI detectaste carencias (sin formulario, sin e-commerce, sin blog), pregunta sobre el impacto de ESA carencia en su operación
- Si el sitio parece desactualizado o poco funcional, pregunta cómo eso afecta su experiencia con clientes
- Usa el resumen de contenido para personalizar: si venden servicios, pregunta por procesos de venta; si son e-commerce, por logística, etc.
- Sé constructivo: las preguntas deben ayudar a dimensionar soluciones, no señalar errores`
      : ""

    const doloresText = step1.dolores_principales.join(", ")

    const prompt = `Eres un consultor senior de transformación digital para PYMEs en Latinoamérica. Un prospecto está completando un diagnóstico y necesitas hacer preguntas inteligentes para entender su caso a fondo.

DATOS DEL PROSPECTO:
- Industria: ${step1.industria}${step1.industria_otra ? ` (${step1.industria_otra})` : ""}
- Tamaño: ${step1.tamano_empresa} personas
- Principales dolores: ${doloresText}${step1.dolor_otro ? ` (especificó: ${step1.dolor_otro})` : ""}
- Herramientas actuales: ${step1.herramientas_actuales.join(", ")}${step1.herramienta_otra ? ` (especificó: ${step1.herramienta_otra})` : ""}
- Presupuesto: ${step2.presupuesto}
- Urgencia: ${step2.urgencia}
- Situación específica:
${branchContext}${previousContext}${websiteContext}

RONDA ACTUAL: ${round} de 2

${round === 1
  ? `Esta es la PRIMERA ronda. Genera ${maxQuestions} preguntas ÚNICAS y ESPECÍFICAS para ESTE prospecto.

CADA PREGUNTA debe partir de ALGO CONCRETO que ya sabemos de él (sus respuestas anteriores) para profundizar. No empieces desde cero.

INSTRUCCIONES CRÍTICAS:
- NO uses preguntas genéricas — cada pregunta debe hacer referencia implícita a lo que YA CONTESTÓ
- El dolor principal es "${step1.dolores_principales[0]}" — investiga las consecuencias específicas de ESE dolor en la industria "${step1.industria}"
- Ya contestó sobre su situación: las respuestas de "Situación específica" son CLAVE. Úsalas como punto de partida para ir MÁS PROFUNDO.
  Ejemplo: si dijo "facturación" como proceso más lento, pregunta sobre volumen de facturas, errores frecuentes, tiempo por factura
  Ejemplo: si dijo "intuición" para toma de decisiones, pregunta sobre qué decisiones le gustaría basar en datos
- Usa "${step1.herramientas_actuales.join(", ")}" para preguntar por limitaciones específicas de ESAS herramientas en su contexto.
${step1.websiteAnalysis && !step1.websiteAnalysis.error ? `- Revisaste su sitio web: usa esa información para preguntar sobre brechas digitales específicas.
  Ejemplo: si no tiene formulario de contacto → "¿Cómo te contactan los clientes que llegan por tu sitio?"
  Ejemplo: si tiene blog pero parece inactivo → "¿Con qué frecuencia publicas contenido en tu blog?"
  Ejemplo: si tiene e-commerce → "¿Cómo gestionas la logística de los pedidos que llegan por tu web?"` : ''}

CADA PREGUNTA debe:
1. Partir de un dato concreto que YA SABEMOS de él (no preguntar desde cero)
2. Tener un objetivo claro: lo que responderá nos ayudará a definir el ALCANCE de la solución
3. Sonar como un consultor que YA LEYÓ su información y quiere profundizar

Cada pregunta debe abordar un ángulo DIFERENTE y ESPECÍFICO para su caso.`
  : `Esta es la SEGUNDA y ÚLTIMA ronda. Ya tienes respuestas de la ronda 1 — estas preguntas deben ser CONSECUENCIA DIRECTA de lo que respondió.

Genera ${maxQuestions} preguntas que:
1. Tomen UNA respuesta de la ronda anterior y profundicen en ella (ej: si dijo "pierdo clientes por mal seguimiento", preguntar cuántos clientes pierde, qué pasa después de la venta, etc.)
2. Ayuden a dimensionar la solución ideal: alcance, prioridades, expectativas de resultado medibles
3. ${step1.websiteAnalysis && !step1.websiteAnalysis.error ? 'Incorporen observaciones del sitio web para preguntar sobre integración, conversión o mejoras digitales específicas — conectando lo que viste en la web con lo que dijo en ronda 1' : 'Se centren en métricas de éxito y expectativas de implementación'}
4. NO repitan temas ya cubiertos — solo profundicen

IMPORTANTE: Las preguntas de ronda 2 deben ser IMPOSIBLES de generar sin conocer las respuestas de ronda 1. Si se ven genéricas, están mal.`}

REGLAS:
- Cada pregunta debe tener 4-6 opciones de respuesta + una opción "Otro" al final
- Las opciones deben ser ESPECÍFICAS y REALISTAS para un negocio de "${step1.industria}" con ${step1.tamano_empresa} personas
- Las opciones deben cubrir el rango completo de posibles respuestas
- Lenguaje conversacional, en español LATAM, sin jerga técnica
- PROHIBIDO preguntar cosas genéricas como "¿cuántas horas pierdes en tareas repetitivas?" a todos — eso ya lo preguntamos en el paso anterior
- Las preguntas deben sentirse como una conversación con un consultor que YA LEYÓ sus respuestas previas y, si aplica, revisó su sitio web
- Si hay websiteAnalysis, úsalo estratégicamente: pregunta sobre brechas, no sobre lo que ya funciona

Responde ÚNICAMENTE con un JSON válido en este formato exacto, sin texto adicional:
{
  "questions": [
    {
      "question": "La pregunta aquí",
      "options": [
        { "value": "clave_corta", "label": "Texto visible de la opción" },
        { "value": "otro", "label": "Otro" }
      ]
    }
  ],
  "hasMoreQuestions": ${round < 2 ? "true" : "false"}
}`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1200, // Aumentado para acomodar contexto web adicional
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Responde siempre con JSON válido. No incluyas texto fuera del JSON." },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(text)

    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Estructura de respuesta inválida")
    }

    // Ensure every question has options with value/label
    for (const q of parsed.questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Pregunta mal formada")
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando preguntas:", error)
    return NextResponse.json(getFallbackQuestions(round))
  }
}

function getFallbackQuestions(round: number) {
  if (round === 1) {
    return {
      questions: [
        {
          question: "¿Cuántas horas a la semana estimas que se pierden en tareas repetitivas o manuales?",
          options: [
            { value: "menos_5", label: "Menos de 5 horas" },
            { value: "5_10", label: "5-10 horas" },
            { value: "10_20", label: "10-20 horas" },
            { value: "mas_20", label: "Más de 20 horas" },
            { value: "no_se", label: "No estoy seguro" },
            { value: "otro", label: "Otro" },
          ],
        },
        {
          question: "¿Cuál es el mayor impacto que estos problemas tienen en tu negocio hoy?",
          options: [
            { value: "perdida_clientes", label: "Estoy perdiendo clientes" },
            { value: "perdida_dinero", label: "Me cuesta dinero innecesario" },
            { value: "estres", label: "Me genera estrés y sobrecarga" },
            { value: "crecimiento", label: "No puedo crecer como quiero" },
            { value: "todo", label: "Todo lo anterior" },
            { value: "otro", label: "Otro" },
          ],
        },
        {
          question: "¿Has intentado resolver estos problemas antes?",
          options: [
            { value: "si_funciono", label: "Sí, pero no funcionó del todo" },
            { value: "si_caro", label: "Sí, pero era muy costoso" },
            { value: "si_complejo", label: "Sí, pero era muy complejo" },
            { value: "no_tiempo", label: "No, no he tenido tiempo" },
            { value: "no_sabia", label: "No sabía por dónde empezar" },
            { value: "otro", label: "Otro" },
          ],
        },
      ],
      hasMoreQuestions: true,
    }
  } else {
    return {
      questions: [
        {
          question: "¿Qué resultado específico esperas lograr con una solución?",
          options: [
            { value: "ahorrar_tiempo", label: "Ahorrar tiempo en tareas repetitivas" },
            { value: "aumentar_ventas", label: "Aumentar ventas o ingresos" },
            { value: "mejorar_satisfaccion", label: "Mejorar satisfacción de clientes" },
            { value: "reducir_errores", label: "Reducir errores y problemas" },
            { value: "crecer_equipo", label: "Poder crecer el equipo sin complicaciones" },
            { value: "otro", label: "Otro" },
          ],
        },
        {
          question: "¿En qué plazo esperas ver resultados?",
          options: [
            { value: "inmediato", label: "Lo antes posible (1-2 meses)" },
            { value: "corto", label: "En los próximos 3-6 meses" },
            { value: "medio", label: "En 6-12 meses" },
            { value: "largo", label: "No hay prisa, es para el largo plazo" },
            { value: "otro", label: "Otro" },
          ],
        },
      ],
      hasMoreQuestions: false,
    }
  }
}
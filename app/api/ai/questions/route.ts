import OpenAI from "openai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  let round = 1
  try {
    const body = await request.json()
    round = body.round ?? 1
    const { step1, step2, previousAnswers = [] } = body

    if (!step1 || !step2) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const maxQuestions = round === 1 ? 3 : 2

    // Si no hay API key, retornar preguntas de fallback
    console.log("🔍 DEBUG - OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? `Presente (${process.env.OPENAI_API_KEY.substring(0, 20)}...)` : "NO configurada")
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY no configurada, usando preguntas de fallback")
      return NextResponse.json(getFallbackQuestions(round))
    }

    const client = new OpenAI()

    const previousContext = previousAnswers.length > 0
      ? `\n\nRESPUESTAS ANTERIORES DEL PROSPECTO (Ronda ${round - 1}):\n${previousAnswers.map((a: { question: string; answer: string }, i: number) => `${i + 1}. Pregunta: "${a.question}" → Respuesta: "${a.answer}"`).join("\n")}\n\nUSA estas respuestas para hacer preguntas MÁS PROFUNDAS y específicas. NO repitas temas ya cubiertos.`
      : ""

    // Build human-readable branch context
    const branchEntries = Object.entries(step2.respuestas_branch || {})
    const branchContext = branchEntries.length > 0
      ? branchEntries.map(([key, val]) => `  - ${key.replace(/_/g, " ")}: ${val}`).join("\n")
      : "  (sin respuestas específicas)"

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
${branchContext}${previousContext}

RONDA ACTUAL: ${round} de 2

${round === 1
  ? `Esta es la PRIMERA ronda. Genera ${maxQuestions} preguntas ÚNICAS y ESPECÍFICAS para ESTE prospecto.

INSTRUCCIONES CRÍTICAS:
- NO uses preguntas genéricas que le harías a cualquier negocio
- El dolor principal es "${step1.dolores_principales[0]}" — investiga las consecuencias específicas de ESE dolor en la industria "${step1.industria}"
- Ya contestó sobre su situación: ${branchContext.trim()}. NO repitas esas preguntas. Usa esas respuestas como punto de partida para ir MÁS PROFUNDO.
- Usa "${step1.herramientas_actuales.join(", ")}" para preguntar por limitaciones específicas de ESAS herramientas en su contexto.

EJEMPLOS DE PREGUNTAS BUENAS para diferentes casos:
- Restaurante con ventas estancadas: "¿Cuál es tu ticket promedio por cliente?" "¿Qué días de la semana tienes más movimiento?" "¿Cómo manejas las reservas y citas?"
- Clínica con procesos manuales: "¿Cuántas citas pierdes por semana por problemas de agenda?" "¿Cómo manejas los historiales de pacientes?" "¿Cuánto tiempo dedicas a papeleo administrativo?"
- Agencia con falta de visibilidad: "¿Cómo sigues el progreso de cada proyecto?" "¿Qué métricas de satisfacción de clientes mides?" "¿Cómo reportas resultados a tus clientes?"

Cada pregunta debe abordar un ángulo DIFERENTE y ESPECÍFICO para su caso.`
  : `Esta es la SEGUNDA y ÚLTIMA ronda. Ya tienes respuestas previas — úsalas para hacer preguntas MÁS PROFUNDAS.

Genera ${maxQuestions} preguntas que:
1. Profundicen en los puntos más críticos revelados en sus respuestas anteriores
2. Ayuden a dimensionar la solución ideal (alcance, prioridades, expectativas de resultado medibles)`
}

REGLAS:
- Cada pregunta debe tener 4-6 opciones de respuesta + una opción "Otro" al final
- Las opciones deben ser ESPECÍFICAS y REALISTAS para un negocio de "${step1.industria}" con ${step1.tamano_empresa} personas
- Las opciones deben cubrir el rango completo de posibles respuestas
- Lenguaje conversacional, en español LATAM, sin jerga técnica
- PROHIBIDO preguntar cosas genéricas como "¿cuántas horas pierdes en tareas repetitivas?" a todos — eso ya lo preguntamos en el paso anterior
- Las preguntas deben sentirse como una conversación con un consultor que YA LEYÓ sus respuestas previas

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
      max_tokens: 1000,
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

import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { step1, step2 } = await request.json()

    // Si no hay API key, retornar preguntas de fallback
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("ANTHROPIC_API_KEY no configurada, usando preguntas de fallback")
      return NextResponse.json({
        preguntas: [
          "¿Cuántas horas a la semana estima que se pierden en los procesos que mencionó?",
          "¿Ha evaluado alguna solución anteriormente? ¿Qué le impidió implementarla?",
        ],
      })
    }

    const client = new Anthropic()

    const prompt = `Eres un consultor de transformación digital para PYMEs en Latinoamérica.
    
Un prospecto completó un diagnóstico inicial con estos datos:

NEGOCIO:
- Industria: ${step1.industria}
- Tamaño: ${step1.tamano_empresa} personas
- Principales problemas: ${step1.dolores_principales.join(", ")}
- Herramientas actuales: ${step1.herramientas_actuales.join(", ")}

SITUACIÓN:
- Descripción del problema: ${step2.descripcion_problema || "No especificó"}
- Presupuesto: ${step2.presupuesto}
- Urgencia: ${step2.urgencia}
- Respuestas adicionales: ${JSON.stringify(step2.respuestas_branch)}

Genera exactamente 2 preguntas de seguimiento muy específicas para entender mejor su caso y dimensionar la solución correcta. Las preguntas deben:
1. Referirse directamente a su industria y problema específico
2. Ayudarte a estimar el ROI y el alcance del proyecto
3. Ser conversacionales, no técnicas
4. Estar en español LATAM

Responde ÚNICAMENTE con un JSON válido en este formato exacto, sin texto adicional:
{
  "preguntas": [
    "Primera pregunta aquí",
    "Segunda pregunta aquí"
  ]
}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== "text") throw new Error("Respuesta inesperada")

    const parsed = JSON.parse(content.text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando preguntas:", error)
    // Fallback con preguntas genéricas si la IA falla
    return NextResponse.json({
      preguntas: [
        "¿Cuántas horas a la semana estima que se pierden en los procesos que mencionó?",
        "¿Ha evaluado alguna solución anteriormente? ¿Qué le impidió implementarla?",
      ],
    })
  }
}

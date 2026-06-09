import OpenAI from "openai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { wizardData } = await request.json()

    if (!wizardData?.step1 || !wizardData?.step2) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const step1 = wizardData.step1
    const step2 = wizardData.step2
    const step3 = wizardData.step3

    // Si no hay API key, retornar fallback
    if (!process.env.OPENAI_API_KEY) { // OpenRouter/OpenAI API Model
      console.warn("OPENAI_API_KEY no configurada, usando diagnóstico de fallback")
      return NextResponse.json(getFallback(step1.industria))
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // OpenRouter/OpenAI API Model
    })

    // === CONTEXTO DE ANÁLISIS DE SITIO WEB ===
    const websiteContext = wizardData.websiteAnalysis && !wizardData.websiteAnalysis.error
      ? `
ANÁLISIS DE SU SITIO WEB (${wizardData.websiteAnalysis.url}):
- Descripción detectada: ${wizardData.websiteAnalysis.descripcion}
- Contenido: ${wizardData.websiteAnalysis.resumen_contenido}
- Tiene blog: ${wizardData.websiteAnalysis.tiene_blog ? "Sí" : "No"}
- Tiene tienda online: ${wizardData.websiteAnalysis.tiene_ecommerce ? "Sí" : "No"}
- Tiene formulario de contacto: ${wizardData.websiteAnalysis.tiene_formulario_contacto ? "Sí" : "No"}
- Redes sociales detectadas: ${wizardData.websiteAnalysis.redes_sociales.join(", ") || "Ninguna"}
- Oportunidades detectadas en el sitio: ${wizardData.websiteAnalysis.oportunidades_mejora?.join(", ") || "Ninguna"}

USA esta información para hacer el diagnóstico MÁS ESPECÍFICO. 
Menciona lo que viste en su sitio: si el sitio se ve desactualizado, si no tiene e-commerce pero podría necesitarlo, 
si sus redes sociales están desconectadas del sitio, si falta formulario de contacto, etc.
Sé constructivo: señala oportunidades concretas de mejora basadas en lo que detectaste.`
      : ""

    const prompt = `Eres un consultor senior de transformación digital para PYMEs en Latinoamérica. Un prospecto completó un diagnóstico completo. Genera su diagnóstico personalizado COMPLETO.

DATOS DEL PROSPECTO:
- Industria: ${step1.industria}${step1.industria_otra ? ` (${step1.industria_otra})` : ""}
- Tamaño de empresa: ${step1.tamano_empresa}
- Principales dolores: ${step1.dolores_principales.join(", ")}${step1.dolor_otro ? ` (especificó: ${step1.dolor_otro})` : ""}
- Herramientas actuales: ${step1.herramientas_actuales.join(", ")}${step1.herramienta_otra ? ` (especificó: ${step1.herramienta_otra})` : ""}

SITUACIÓN:
- Presupuesto: ${step2.presupuesto}
- Urgencia: ${step2.urgencia}
- Respuestas de situación: ${JSON.stringify(step2.respuestas_branch)}

${step3?.respuestas_ia?.length ? `RESPUESTAS DE ANÁLISIS PROFUNDO:\n${step3.respuestas_ia.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}` : ""}

${websiteContext}

El resultado se divide en DOS AUDIENCIAS. Respeta estrictamente el tono y extensión de cada una:

═══ [CLIENTE] — Lo que ve el dueño del negocio ═══
Tono: cercano, motivador, cero jerga técnica. Máximo 2-3 oraciones por campo.

1. diagnostico_texto: 2-3 oraciones. Análisis breve que identifique el reto principal y por qué tiene potencial de mejora. Habla directamente al dueño ("tu negocio", "tu equipo"). No des la solución aquí — solo el diagnóstico.

2. beneficios: EXACTAMENTE 3 beneficios concretos. Cada uno: frase corta con resultado medible (porcentaje o tiempo). Relacionados con sus dolores específicos.

3. caso_exito: Mini caso FICTICIO pero REALISTA de una empresa similar que inspire confianza:
    - empresa: Nombre ficticio del mismo sector
    - industria: Misma industria del prospecto
    - problema: 1 oración (similar al dolor del prospecto)
    - solucion: 1 oración
    - resultado: 1 oración con cifras concretas

4. siguiente_paso: 1 oración. Invitación a agendar llamada, personalizada según su urgencia (${step2.urgencia}).

5. sugerencia_mejora: 2-3 oraciones. Una recomendación CONCRETA y ACCIONABLE que el dueño pueda entender y aplicar. Nada técnico. Ej: "Empezaría por organizar tus pedidos en una tabla compartida en lugar de usar WhatsApp. Eso solo ya te da visibilidad de lo que entra y sale." Debe sonar a consejo práctico de un consultor, no a propuesta comercial.

6. plan_30_60_90 simplificado: Objeto con 3 fases. Cada fase: 1 oración corta (máximo 15 palabras) en lenguaje simple:
    - dia_30: Primer paso concreto
    - dia_60: Siguiente avance
    - dia_90: Resultado final esperado

═══ [ADMIN] — Lo que ve el profesional/freelancer en el CRM ═══
Tono: analítico, directo, datos duros. Sin límite de extensión.

7. titulo_servicio: Nombre de la solución (máx 5 palabras). Debe reflejar la necesidad principal.

8. descripcion: 2-3 oraciones. QUÉ incluye la solución y CÓMO resuelve sus dolores específicos. Para el profesional, con suficiente detalle técnico.

9. resumen_personalizado: 2-3 oraciones analizando sus oportunidades. Menciona industria y cómo negocios similares se han beneficiado.

10. tiempo_ahorro: Estimación de horas semanales que ahorraría ("X-Y horas/semana"). Basado en tamaño y dolores.

11. pasos_accion: EXACTAMENTE 3 pasos tácticos para que el profesional ejecute con el cliente. Específicos, no genéricos.

12. diagnostico_ejecutivo: 2-3 oraciones. Resumen para que el profesional entienda el caso en 30 segundos. Reto principal, oportunidad clave, dirección recomendada. Escrito en tercera persona.

13. prioridades_inmediatas: EXACTAMENTE 3 prioridades estratégicas (QUÉ atacar), diferentes de pasos_accion (CÓMO empezar).

14. dato_industria: 1 estadística relevante sobre digitalización en ${step1.industria}.

${websiteContext ? `15. hallazgos_web: Análisis del sitio web para el profesional:
    - fortalezas: 2-3 cosas que el sitio hace bien
    - brechas_criticas: 2-3 problemas detectados
    - recomendaciones_tecnicas: 2-3 acciones técnicas concretas` : ''}

REGLAS GENERALES:
- NO uses frases genéricas — cada campo debe basarse en datos REALES del prospecto
- Los campos [CLIENTE] deben ser entendibles para alguien sin conocimiento técnico
- Los campos [ADMIN] pueden usar terminología profesional
- Sé específico con la industria: si vende comida, habla de pedidos/menús; si es salud, habla de pacientes/citas
- Beneficios y caso de éxito: creíbles, no exagerados

Responde ÚNICAMENTE con JSON válido en este formato:
{
  "diagnostico_texto": "...",
  "beneficios": ["...", "...", "..."],
  "caso_exito": { "empresa": "...", "industria": "...", "problema": "...", "solucion": "...", "resultado": "..." },
  "siguiente_paso": "...",
  "sugerencia_mejora": "...",
  "plan_30_60_90": { "dia_30": "...", "dia_60": "...", "dia_90": "..." },
  "titulo_servicio": "...",
  "descripcion": "...",
  "resumen_personalizado": "...",
  "tiempo_ahorro": "...",
  "pasos_accion": ["...", "...", "..."],
  "diagnostico_ejecutivo": "...",
  "prioridades_inmediatas": ["...", "...", "..."],
  "dato_industria": "..."${websiteContext ? `,
  "hallazgos_web": { "fortalezas": ["..."], "brechas_criticas": ["..."], "recomendaciones_tecnicas": ["..."] }` : ''}
}`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2200, // Extended for DiagnosisSummary + hallazgos_web fields
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Eres un consultor de transformación digital. Responde siempre con JSON válido." },
        { role: "user", content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(text)

    // Validate required fields
    const required = ["titulo_servicio", "descripcion", "diagnostico_texto", "beneficios", "siguiente_paso", "sugerencia_mejora", "resumen_personalizado", "tiempo_ahorro", "pasos_accion", "dato_industria", "caso_exito", "diagnostico_ejecutivo", "prioridades_inmediatas", "plan_30_60_90"]
    for (const key of required) {
      if (!parsed[key]) throw new Error(`Campo faltante: ${key}`)
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error generando diagnóstico IA:", error)
    return NextResponse.json(getFallback("general"))
  }
}

function getFallback(industria: string) {
  return {
    titulo_servicio: "Optimización Digital Integral",
    descripcion: `Solución diseñada para negocios en el sector ${industria} que buscan digitalizar sus operaciones principales, reducir tareas manuales y obtener mayor visibilidad de sus métricas clave.`,
    diagnostico_texto: `Hemos revisado tu situación y vemos que hay procesos que pueden mejorar con herramientas digitales. Tu equipo tiene potencial para trabajar de forma más eficiente y enfocarse en lo que realmente importa: hacer crecer el negocio.`,
    beneficios: [
      "Menos tiempo en tareas repetitivas",
      "Más visibilidad de tus números clave",
      "Mejor seguimiento a tus clientes",
    ],
    siguiente_paso: "Agenda tu llamada gratuita de 30 minutos y revisamos los pasos siguientes.",
    sugerencia_mejora: `Te recomiendo empezar por algo simple: elige el proceso que más tiempo te consuma y busca una herramienta digital que lo simplifique. Muchos negocios como el tuyo empiezan con un Excel bien organizado y desde ahí dan el salto a algo más automatizado.`,
    resumen_personalizado: `Tu negocio en el sector ${industria} tiene oportunidades claras de mejora digital. Con las herramientas adecuadas, podrías automatizar procesos clave y liberar tiempo para lo importante.`,
    tiempo_ahorro: "8-15 horas por semana",
    pasos_accion: [
      "Identificar los 3 procesos que más tiempo consumen",
      "Implementar herramientas digitales para los procesos prioritarios",
      "Medir resultados y optimizar en las primeras 4 semanas",
    ],
    dato_industria: "Las PYMEs que adoptan herramientas digitales incrementan su productividad en promedio un 30%.",
    caso_exito: {
      empresa: "Negocio Digital MX",
      industria: industria,
      problema: "Perdían horas cada semana en procesos manuales y seguimiento a clientes.",
      solucion: "Implementaron un sistema de automatización y CRM digital adaptado a su operación.",
      resultado: "Redujeron un 40% el tiempo operativo y aumentaron sus ventas un 25% en 3 meses.",
    },
    diagnostico_ejecutivo: `Negocio en el sector ${industria} con oportunidades claras de digitalización. El reto principal son los procesos manuales que limitan el crecimiento. Se recomienda una intervención enfocada en automatización y visibilidad de métricas.`,
    prioridades_inmediatas: [
      "Digitalizar el proceso operativo que más tiempo consume",
      "Establecer métricas de seguimiento para medir impacto",
      "Estandarizar la comunicación con clientes en un solo canal",
    ],
    plan_30_60_90: {
      dia_30: "Diagnóstico detallado y piloto de automatización en el proceso más crítico",
      dia_60: "Implementación completa con ajustes basados en datos del primer mes",
      dia_90: "Escalado a procesos secundarios y medición de ROI consolidado",
    },
  }
}
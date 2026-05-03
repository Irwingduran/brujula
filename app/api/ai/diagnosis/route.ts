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
    if (!process.env.OPEN_ROUTER_KEY) {
      console.warn("OPEN_ROUTER_KEY no configurada, usando diagnóstico de fallback")
      return NextResponse.json(getFallback(step1.industria))
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_KEY,
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

Genera un diagnóstico COMPLETO y PERSONALIZADO con estos 10 campos. Cada campo debe ser 100% específico para este prospecto — NO uses frases genéricas. Basa todo en los datos reales que proporcionó, incluyendo lo que observaste en su sitio web si está disponible:

1. titulo_servicio: Nombre del servicio/solución recomendada (máximo 5 palabras). Debe reflejar la necesidad principal del prospecto, no un título genérico.

2. descripcion: Un párrafo de 2-3 oraciones describiendo QUÉ incluye la solución recomendada y CÓMO resuelve específicamente sus dolores. Mención directa a su industria, herramientas actuales y, si aplica, oportunidades detectadas en su sitio web.

3. diagnostico_texto: Un párrafo de 3-4 oraciones con el análisis principal. Menciona su industria, tamaño de equipo, los dolores que identificó, y por qué la solución recomendada es la indicada. Si hay análisis de sitio web, menciona observaciones específicas (ej: "tu sitio no tiene formulario de contacto", "podrías aprovechar un blog para atraer tráfico"). Debe sonar como un consultor experto hablándole directamente.

4. beneficios: Exactamente 4 beneficios concretos y medibles que obtendría. Cada uno debe ser una frase corta que incluya un resultado específico (porcentajes, tiempos, mejoras cuantificables). Deben estar directamente relacionados con los dolores que mencionó y, si aplica, con las oportunidades de su sitio web.

5. siguiente_paso: Una oración que invite a agendar una llamada, personalizada según su nivel de urgencia (${step2.urgencia}).

6. resumen_personalizado: Un párrafo de 2-3 oraciones con un análisis personalizado de sus oportunidades. Menciona su industria y cómo otros negocios similares se han beneficiado. Si hay datos del sitio web, úsalos para reforzar el mensaje.

7. tiempo_ahorro: Estimación realista de horas semanales que ahorraría (formato: "X-Y horas por semana"). Basado en su tamaño de empresa, dolores específicos y procesos que podrían optimizarse en su sitio web.

8. pasos_accion: Exactamente 3 pasos concretos y accionables para empezar. Específicos para su caso — no genéricos. Si hay análisis de sitio, incluye al menos un paso relacionado con mejoras web (ej: "agregar formulario de contacto", "conectar redes sociales al sitio").

9. dato_industria: Un dato o estadística sobre digitalización en su industria específica (${step1.industria}). Debe ser creíble y relevante.

10. caso_exito: Un mini caso de éxito FICTICIO pero REALISTA de una empresa similar. Debe sonar como un caso real que inspire confianza. Objeto con estos campos:
   - empresa: Nombre ficticio creíble (ej: "Clínica Dental Sonríe", "Restaurante El Sabor"). Debe ser del mismo sector/industria del prospecto.
   - industria: La industria del caso (misma que la del prospecto)
   - problema: 1 oración describiendo el problema que tenían (similar al del prospecto, puede incluir aspectos web si aplica)
   - solucion: 1 oración describiendo qué implementaron
   - resultado: 1 oración con resultados concretos y medibles (cifras, porcentajes, tiempos)

REGLAS:
- Español LATAM, tono profesional pero cercano
- No uses jerga técnica — el prospecto es dueño de negocio, no técnico
- Sé específico: si vende comida, habla de pedidos; si es salud, habla de pacientes
- Si hay websiteAnalysis, ÚSALO: menciona si el sitio está desactualizado, si falta e-commerce, si las redes no están conectadas, etc.
- Los beneficios deben ser creíbles, no exagerados
- El caso de éxito debe ser creíble y del mismo sector

Responde ÚNICAMENTE con JSON válido en este formato:
{
  "titulo_servicio": "...",
  "descripcion": "...",
  "diagnostico_texto": "...",
  "beneficios": ["...", "...", "...", "..."],
  "siguiente_paso": "...",
  "resumen_personalizado": "...",
  "tiempo_ahorro": "...",
  "pasos_accion": ["...", "...", "..."],
  "dato_industria": "...",
  "caso_exito": { "empresa": "...", "industria": "...", "problema": "...", "solucion": "...", "resultado": "..." }
}`

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o",
      max_tokens: 1400, // Aumentado ligeramente para acomodar contexto adicional
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
    const required = ["titulo_servicio", "descripcion", "diagnostico_texto", "beneficios", "siguiente_paso", "resumen_personalizado", "tiempo_ahorro", "pasos_accion", "dato_industria", "caso_exito"]
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
    diagnostico_texto: `Basado en el análisis de tu negocio, hemos identificado áreas críticas donde la digitalización puede generar resultados inmediatos. Tu equipo actualmente dedica tiempo valioso a procesos que pueden automatizarse, y tus herramientas actuales no están aprovechando todo su potencial. Con la solución adecuada, podrías transformar estas ineficiencias en ventajas competitivas.`,
    beneficios: [
      "Reducción del 60% en tiempo dedicado a tareas repetitivas",
      "Visibilidad en tiempo real de las métricas clave de tu negocio",
      "Automatización de seguimiento con clientes y prospectos",
      "Mayor capacidad para escalar sin aumentar costos operativos",
    ],
    siguiente_paso: "Agenda tu llamada gratuita de 30 minutos para revisar este diagnóstico juntos y definir los próximos pasos concretos.",
    resumen_personalizado: `Tu negocio tiene un gran potencial de mejora digital. Con las herramientas correctas, podrías automatizar procesos clave y dedicar más tiempo a crecer.`,
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
  }
}
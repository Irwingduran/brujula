import OpenAI from "openai"
import type { EvidenceItem } from "@/lib/ai/contracts"
import type { FormularioCampos, ClasificacionResult, SintomaResult, DiagnosticFinding, FindingDraft, AccionResult, RedaccionResult, DiagnosticoResult } from "./schemas"
import { SintomasOutputSchema, FindingsDraftOutputSchema, DiagnosticFindingSchema, AccionesOutputSchema, RedaccionSchema } from "./schemas"
import { clasificarNegocio } from "./classifier"
import { validarCoherencia, validarGenericity } from "./guardrails"
import { SYMPTOMS_CATALOG } from "./symptoms-catalog"
import { ACTIONS_CATALOG } from "./actions-catalog"
import { getKnowledgePack, getPromptGuidance } from "./knowledge"
import { buildDiagnosticEvidence, formatEvidenceValue, getPublicEvidenceLabel } from "./evidence"
import { deriveDiagnosticRoute } from "./capabilities-catalog"

const MODEL = process.env.DIAGNOSTICO_MODEL || "gpt-4o"
const MAX_RETRIES = Number(process.env.DIAGNOSTICO_MAX_RETRIES) || 2
const TIMEOUT_MS = Number(process.env.DIAGNOSTICO_TIMEOUT_MS) || 15000
const TEMPERATURES = {
  sintomas: 0.2,
  hallazgos: 0.2,
  acciones: 0.2,
  redaccion: 0.5,
} as const

function getClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

async function llamarLLM(
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
): Promise<string> {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1000,
    temperature,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  }, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("LLM response is empty")
  }
  return content
}

function parseJson(text: string): unknown {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
  return JSON.parse(cleaned)
}

function formatSymptomsList(sintomas: { id: string; nombre: string; descripcion: string }[]): string {
  return sintomas.map((s) => `- ${s.id}: ${s.nombre} — ${s.descripcion}`).join("\n")
}

function buildPublicEvidence(evidence: EvidenceItem[]) {
  return evidence.map((item) => ({
    id: item.id,
    label: getPublicEvidenceLabel(item),
    source: item.source,
    reliability: item.reliability,
  }))
}

function validateSymptomEvidence(sintomas: SintomaResult[], evidence: EvidenceItem[]) {
  const validIds = new Set(evidence.map((item) => item.id))
  const invalidIds = sintomas.flatMap((sintoma) =>
    sintoma.evidenceIds.filter((id) => !validIds.has(id)),
  )

  if (invalidIds.length > 0) {
    throw new Error(`Referencias de evidencia inválidas: ${[...new Set(invalidIds)].join(", ")}`)
  }
}

function getFallbackEvidenceIds(evidence: EvidenceItem[], field: string): string[] {
  const matchingIds = evidence.filter((item) => item.field === field).map((item) => item.id)
  return (matchingIds.length ? matchingIds : evidence.map((item) => item.id)).slice(0, 1)
}

async function llamarLLMSintomas(
  campos: FormularioCampos,
  clasificacion: ClasificacionResult,
  evidence: EvidenceItem[],
  intento: number = 0,
): Promise<SintomaResult[]> {
  const knowledge = getKnowledgePack(clasificacion.industryCode)
  const industrySymptoms = knowledge?.symptoms ?? []
  const guidance = await getPromptGuidance(clasificacion.industryCode, {
    query: `Síntomas: ${campos.dolores_principales.join(", ")}. Industria: ${clasificacion.industryCode}. Herramientas: ${campos.herramientas_actuales.join(", ")}`,
    segmento: clasificacion.segmento,
    etapa: "pipeline_sintomas",
  })

  const combinedSymptoms = [
    ...SYMPTOMS_CATALOG.filter((s) => s.segmentosAplica.includes(clasificacion.segmento)),
    ...industrySymptoms,
  ]
  const respuestasBranch = Object.entries(campos.respuestas_branch ?? {})
    .map(([campo, respuesta]) => `- ${campo}: ${respuesta}`)
    .join("\n") || "- Sin respuestas específicas adicionales"
  const respuestasProfundas = campos.respuestas_ia?.map((respuesta) => `- ${respuesta}`).join("\n")
    || "- Sin respuestas profundas adicionales"
  const analisisWeb = campos.website_analysis && !campos.website_analysis.error
    ? `SITIO WEB OBSERVADO (${campos.url_sitio ?? campos.website_analysis.url ?? "URL no disponible"}):\n- Descripción: ${campos.website_analysis.descripcion ?? "No disponible"}\n- Contenido: ${campos.website_analysis.resumen_contenido ?? "No disponible"}\n- Blog: ${campos.website_analysis.tiene_blog ? "Sí" : "No confirmado"}\n- E-commerce: ${campos.website_analysis.tiene_ecommerce ? "Sí" : "No confirmado"}\n- Formulario de contacto: ${campos.website_analysis.tiene_formulario_contacto ? "Sí" : "No confirmado"}\n- Oportunidades observadas: ${campos.website_analysis.oportunidades_mejora?.join(", ") || "No disponible"}`
    : "SITIO WEB: sin observaciones verificables"

  const evidenceContext = evidence
    .map((item) => `- ${item.id} | ${item.source}/${item.reliability} | ${item.field}: ${formatEvidenceValue(item.normalizedValue)}`)
    .join("\n")

  const systemPrompt = `Eres un analista de transformación digital para PYMEs mexicanas.
Recibirás las respuestas de un cuestionario de diagnóstico y una lista de síntomas posibles.
Tu tarea: identificar entre 2 y 5 síntomas de la lista que mejor describen la situación del negocio.
Para cada síntoma asigna un score del 1 al 5 según la severidad evidenciada en las respuestas.
Para cada síntoma incluye entre 1 y 3 evidenceIds tomados EXCLUSIVAMENTE de la lista EVIDENCIA DISPONIBLE y una confianza: alta, media o baja.
La confianza debe ser baja si la evidencia es escasa o indirecta.
Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código markdown.
No inventes síntomas que no estén en la lista. No agregues texto fuera del JSON.`

  const userPrompt = `INDUSTRIA: ${clasificacion.industryLabel ?? clasificacion.industryCode}${clasificacion.subsector ? ` (${clasificacion.subsector})` : ""}
TAMAÑO: ${campos.tamano_empresa}
HERRAMIENTAS ACTUALES: ${campos.herramientas_actuales.join(", ")}
DOLORES DECLARADOS: ${campos.dolores_principales.join(", ")}
PRESUPUESTO: ${campos.presupuesto}
URGENCIA: ${campos.urgencia}
RESPUESTAS ESPECÍFICAS DEL NEGOCIO:
${respuestasBranch}
RESPUESTAS PROFUNDAS DEL CUESTIONARIO:
${respuestasProfundas}
${analisisWeb}
EVIDENCIA DISPONIBLE (usa únicamente estos IDs):
${evidenceContext}
SEGMENTO DETECTADO: ${clasificacion.segmento}
MADUREZ DIGITAL: ${clasificacion.madurezDigital}/5

${guidance ? `GUÍA ESPECÍFICA PARA ESTA INDUSTRIA:\n${guidance}\n` : ""}

SÍNTOMAS DISPONIBLES (elige solo de esta lista):
${formatSymptomsList(combinedSymptoms)}

Responde SOLO con un array JSON. Cada elemento: { "sintomaId": string, "score": number (1-5), "evidencia": string, "evidenceIds": [string], "confidence": "alta"|"media"|"baja" }`

  try {
    const text = await llamarLLM(systemPrompt, userPrompt, TEMPERATURES.sintomas)
    const parsed = SintomasOutputSchema.parse(parseJson(text))
    validateSymptomEvidence(parsed, evidence)
    return parsed
  } catch (e) {
    if (intento < MAX_RETRIES) {
      return llamarLLMSintomas(campos, clasificacion, evidence, intento + 1)
    }
    throw new Error(`Error en análisis de síntomas tras ${MAX_RETRIES} reintentos: ${e}`)
  }
}

const CONFIDENCE_RANK = { baja: 1, media: 2, alta: 3 } as const

function deriveFindings(drafts: FindingDraft[], sintomas: SintomaResult[]): DiagnosticFinding[] {
  const symptomsById = new Map(sintomas.map((sintoma) => [sintoma.sintomaId, sintoma]))

  return drafts.map((draft, index) => {
    const uniqueSymptomIds = [...new Set(draft.symptomIds)]
    const selectedSymptoms = uniqueSymptomIds.map((id) => symptomsById.get(id))
    if (selectedSymptoms.some((symptom) => !symptom)) {
      const invalidIds = uniqueSymptomIds.filter((id) => !symptomsById.has(id))
      throw new Error(`Referencias de síntomas inválidas en hallazgos: ${invalidIds.join(", ")}`)
    }

    const supportingSymptoms = selectedSymptoms as SintomaResult[]
    const supportConfidence = supportingSymptoms.reduce(
      (lowest, symptom) => CONFIDENCE_RANK[symptom.confidence] < CONFIDENCE_RANK[lowest] ? symptom.confidence : lowest,
      supportingSymptoms[0].confidence,
    )
    const confidence = CONFIDENCE_RANK[draft.confidence] > CONFIDENCE_RANK[supportConfidence]
      ? supportConfidence
      : draft.confidence
    const missingInformation = confidence === "baja" && !draft.missingInformation.length && !draft.contradictions.length
      ? ["Falta información adicional para confirmar este hallazgo con mayor certeza."]
      : draft.missingInformation

    return DiagnosticFindingSchema.parse({
      ...draft,
      id: `finding_${index + 1}`,
      symptomIds: uniqueSymptomIds,
      evidenceIds: [...new Set(supportingSymptoms.flatMap((symptom) => symptom.evidenceIds))],
      severity: Math.max(...supportingSymptoms.map((symptom) => symptom.score)),
      confidence,
      missingInformation,
    })
  })
}

async function llamarLLMHallazgos(
  sintomas: SintomaResult[],
  intento: number = 0,
): Promise<DiagnosticFinding[]> {
  const systemPrompt = `Eres un consultor de negocios que convierte síntomas ya validados en hallazgos claros para el dueño de una PYME mexicana.
Solo puedes basarte en los síntomas entregados. No inventes hechos, métricas, causas, resultados comerciales ni evidencia nueva.
El impacto debe describirse como posible o probable, nunca garantizado. Si la evidencia es insuficiente, indirecta o contradictoria, decláralo en missingInformation o contradictions y usa confianza baja.
Combina solo síntomas relacionados; produce entre 2 y 3 hallazgos distintos y comprensibles.
Responde ÚNICAMENTE con JSON válido, sin texto adicional ni bloques markdown.`

  const userPrompt = `SÍNTOMAS VALIDADOS (usa exclusivamente estos sintomaId):
${sintomas.map((symptom) => `- ${symptom.sintomaId} | severidad ${symptom.score}/5 | confianza ${symptom.confidence} | evidencia: ${symptom.evidencia} | evidencia disponible: ${symptom.evidenceIds.join(", ")}`).join("\n")}

Responde SOLO con un array JSON de 2 a 3 objetos con esta forma:
{
  "symptomIds": ["uno o más sintomaId existentes"],
  "title": "título concreto y comprensible",
  "summary": "qué observamos, sin añadir hechos nuevos",
  "businessImpact": "impacto probable, sin prometer resultados",
  "confidence": "alta|media|baja",
  "missingInformation": ["dato que convendría conocer para confirmarlo"],
  "contradictions": ["posible contradicción entre los síntomas, si existe"]
}`

  try {
    const text = await llamarLLM(systemPrompt, userPrompt, TEMPERATURES.hallazgos)
    const drafts = FindingsDraftOutputSchema.parse(parseJson(text))
    return deriveFindings(drafts, sintomas)
  } catch (error) {
    if (intento < MAX_RETRIES) {
      return llamarLLMHallazgos(sintomas, intento + 1)
    }
    throw new Error(`Error al generar hallazgos tras ${MAX_RETRIES} reintentos: ${error}`)
  }
}

function generarHallazgosFallback(sintomas: SintomaResult[]): DiagnosticFinding[] {
  return sintomas.slice(0, 3).map((sintoma, index) => DiagnosticFindingSchema.parse({
    id: `finding_${index + 1}`,
    symptomIds: [sintoma.sintomaId],
    evidenceIds: sintoma.evidenceIds,
    severity: sintoma.score,
    title: `Atender ${sintoma.sintomaId.replaceAll("_", " ")}`,
    summary: sintoma.evidencia,
    businessImpact: "Puede consumir capacidad operativa o dificultar el seguimiento; falta medir el impacto exacto en el negocio.",
    confidence: sintoma.confidence,
    missingInformation: sintoma.confidence === "baja"
      ? ["Falta información adicional para confirmar este hallazgo con mayor certeza."]
      : [],
    contradictions: [],
  }))
}

async function llamarLLMAcciones(
  campos: FormularioCampos,
  clasificacion: ClasificacionResult,
  sintomas: SintomaResult[],
  intento: number = 0,
  erroresPrevios: string[] = [],
): Promise<AccionResult[]> {
  const knowledge = getKnowledgePack(clasificacion.industryCode)
  const industryActions = knowledge?.actions ?? []
  const guidance = await getPromptGuidance(clasificacion.industryCode, {
    query: `Acciones para: ${clasificacion.industryCode}. Síntomas: ${sintomas.map((s) => s.sintomaId).join(", ")}. Presupuesto: ${campos.presupuesto}. Madurez: ${clasificacion.madurezDigital}/5`,
    segmento: clasificacion.segmento,
    etapa: "pipeline_acciones",
  })

  const accionesBase = ACTIONS_CATALOG.filter(
    (a) =>
      a.segmentosAplica.includes(clasificacion.segmento) &&
      clasificacion.madurezDigital >= a.madurezMinima &&
      clasificacion.madurezDigital <= a.madurezMaxima,
  )

  const accionesDisponibles = [...accionesBase, ...industryActions]

  const systemPrompt = `Eres un consultor de digitalización para PYMEs mexicanas con presupuesto limitado.
Recibirás el perfil del negocio, sus síntomas detectados y un catálogo de acciones disponibles.
Tu tarea: seleccionar exactamente 3 acciones del catálogo, ordenadas por prioridad (1 = más urgente).
Considera el presupuesto disponible, la madurez digital actual y el impacto esperado.
Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código markdown.
No inventes acciones fuera del catálogo.`

  const userPrompt = `PERFIL:
- Industria: ${clasificacion.industryLabel ?? clasificacion.industryCode}${clasificacion.subsector ? ` (${clasificacion.subsector})` : ""}
- Segmento: ${clasificacion.segmento}
- Madurez digital: ${clasificacion.madurezDigital}/5
- Perfil de riesgo: ${clasificacion.perfilRiesgo}
- Presupuesto: ${campos.presupuesto}
- Urgencia: ${campos.urgencia}

${guidance ? `GUÍA ESPECÍFICA PARA ESTA INDUSTRIA:\n${guidance}\n` : ""}

SÍNTOMAS DETECTADOS:
${sintomas.map((s) => `- ${s.sintomaId} (score: ${s.score}): ${s.evidencia}`).join("\n")}

ACCIONES DISPONIBLES:
${accionesDisponibles.map((a) => `- ${a.id}: ${a.titulo} | presupuesto: ${a.presupuestoRequerido} | impacto: ${a.impacto}`).join("\n")}

${erroresPrevios.length ? `LA SELECCIÓN ANTERIOR FUE RECHAZADA. Corrige todos estos errores:\n${erroresPrevios.map((error) => `- ${error}`).join("\n")}\n\n` : ""}Responde SOLO con un array JSON de exactamente 3 objetos. Cada objeto: { "accionId": string, "prioridad": 1|2|3, "justificacion": string }`

  let acciones: AccionResult[]
  try {
    const text = await llamarLLM(systemPrompt, userPrompt, TEMPERATURES.acciones)
    acciones = AccionesOutputSchema.parse(parseJson(text))
  } catch (e) {
    if (intento < MAX_RETRIES) {
      return llamarLLMAcciones(campos, clasificacion, sintomas, intento + 1, erroresPrevios)
    }
    throw new Error(`Error en selección de acciones tras ${MAX_RETRIES} reintentos: ${e}`)
  }

  const coherencia = validarCoherencia(clasificacion, sintomas, acciones)
  if (coherencia.valido) {
    return acciones
  }
  if (intento < MAX_RETRIES) {
    return llamarLLMAcciones(campos, clasificacion, sintomas, intento + 1, coherencia.errores)
  }
  throw new Error(`Acciones incoherentes tras ${MAX_RETRIES} reintentos: ${coherencia.errores.join("; ")}`)
}

async function llamarLLMRedaccion(
  clasificacion: ClasificacionResult,
  sintomas: SintomaResult[],
  acciones: AccionResult[],
  intento: number = 0,
  erroresPrevios: string[] = [],
): Promise<RedaccionResult> {

  const systemPrompt = `Eres un consultor de negocios que habla de manera directa, clara y sin tecnicismos.
Recibirás un diagnóstico estructurado de una PYME mexicana en formato JSON.
Tu tarea: convertir ese JSON en un diagnóstico en español sencillo, como si se lo explicaras
al dueño del negocio en persona. Usa lenguaje cotidiano, no jerga de marketing ni tecnicismos.
Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código markdown.
No tomes decisiones nuevas — solo comunica lo que ya está en el JSON de entrada.`

  const userPrompt = `Convierte este diagnóstico estructurado en un diagnóstico narrativo en español sencillo:

INDUSTRIA: ${clasificacion.industryLabel ?? clasificacion.industryCode}${clasificacion.subsector ? ` (${clasificacion.subsector})` : ""}

CLASIFICACIÓN:
- Madurez digital: ${clasificacion.madurezDigital}/5
- Perfil de riesgo: ${clasificacion.perfilRiesgo}

SÍNTOMAS:
${sintomas.map((s) => `- ${s.sintomaId} (severidad: ${s.score}/5): ${s.evidencia}`).join("\n")}

PLAN DE ACCIÓN:
${acciones.map((a) => `- Prioridad ${a.prioridad}: ${a.accionId} — ${a.justificacion}`).join("\n")}

${erroresPrevios.length ? `LA REDACCIÓN ANTERIOR FUE RECHAZADA. Corrige todos estos errores sin cambiar los síntomas ni las acciones aprobadas:\n${erroresPrevios.map((error) => `- ${error}`).join("\n")}\n\n` : ""}Responde SOLO con JSON con este formato:
{
  "resumen": "máx 80 palabras",
  "sintomasPrincipales": ["frase 1", "frase 2", "frase 3"],
  "planDeAccion": [
    { "paso": "título", "descripcion": "descripción", "urgencia": "inmediata/corto/largo" }
  ],
  "scoreTexto": "Tu negocio está en nivel X de 5"
}`

  let redaccion: RedaccionResult
  try {
    const text = await llamarLLM(systemPrompt, userPrompt, TEMPERATURES.redaccion)
    redaccion = RedaccionSchema.parse(parseJson(text))
  } catch (e) {
    if (intento < MAX_RETRIES) {
      return llamarLLMRedaccion(clasificacion, sintomas, acciones, intento + 1, erroresPrevios)
    }
    throw new Error(`Error en redacción tras ${MAX_RETRIES} reintentos: ${e}`)
  }

  const genericity = validarGenericity(clasificacion, redaccion.resumen, redaccion.sintomasPrincipales)
  if (genericity.valido) {
    return redaccion
  }
  if (intento < MAX_RETRIES) {
    return llamarLLMRedaccion(clasificacion, sintomas, acciones, intento + 1, genericity.errores)
  }
  throw new Error(`Redacción genérica o incompatible tras ${MAX_RETRIES} reintentos: ${genericity.errores.join("; ")}`)
}

function generarFallback(campos: FormularioCampos, evidence: EvidenceItem[]): DiagnosticoResult {
  const clasificacion = clasificarNegocio(campos)
  const knowledge = getKnowledgePack(clasificacion.industryCode)
  const fb = knowledge?.fallbackDiagnosis
  const fallbackEvidence = evidence.length ? evidence : buildDiagnosticEvidence(campos)
  const fallbackSintomas: SintomaResult[] = [
    {
      sintomaId: "procesos_manuales",
      score: 3,
      evidencia: "Tus herramientas actuales indican que varios procesos todavía requieren trabajo manual.",
      evidenceIds: getFallbackEvidenceIds(fallbackEvidence, "herramientas_actuales"),
      confidence: "media",
    },
    {
      sintomaId: "sin_metricas",
      score: 2,
      evidencia: "Aún falta medir de forma consistente los resultados de la operación.",
      evidenceIds: getFallbackEvidenceIds(fallbackEvidence, "dolores_principales"),
      confidence: "baja",
    },
  ]
  const fallbackFindings = generarHallazgosFallback(fallbackSintomas)
  const fallbackRoute = deriveDiagnosticRoute(fallbackFindings, clasificacion)

  const fallback: DiagnosticoResult = {
    clasificacion,
    evidence: buildPublicEvidence(fallbackEvidence),
    sintomas: fallbackSintomas,
    findings: fallbackFindings,
    ...fallbackRoute,
    acciones: [
      { accionId: "implementar_whatsapp_business", prioridad: 1, justificacion: "Paso inicial de bajo costo para organizar la comunicación" },
      { accionId: "capacitacion_equipo_digital", prioridad: 2, justificacion: "Preparar al equipo para la transformación digital" },
      { accionId: "auditoria_procesos", prioridad: 3, justificacion: "Identificar áreas específicas de mejora" },
    ],
    redaccion: {
      resumen: fb?.texto ?? "No pudimos analizar todos los detalles, pero basándonos en tu perfil, estos son los primeros pasos recomendados.",
      sintomasPrincipales: [
        "Tus procesos son mayormente manuales",
        "No hay medición de resultados clave",
        "La comunicación con clientes necesita organizarse",
      ],
      planDeAccion: fb
        ? [
            { paso: "Primer mes", descripcion: fb.plan.dia_30, urgencia: "inmediata" },
            { paso: "Segundo mes", descripcion: fb.plan.dia_60, urgencia: "corto" },
            { paso: "Tercer mes", descripcion: fb.plan.dia_90, urgencia: "largo" },
          ]
        : [
            { paso: "Organiza tu comunicación", descripcion: "Implementa WhatsApp Business para separar clientes de lo personal", urgencia: "inmediata" },
            { paso: "Capacita a tu equipo", descripcion: "Prepara a tu equipo para usar herramientas digitales básicas", urgencia: "corto" },
            { paso: "Audita tus procesos", descripcion: "Identifica qué procesos manuales puedes digitalizar primero", urgencia: "largo" },
          ],
      scoreTexto: `Tu negocio está en nivel ${clasificacion.madurezDigital} de 5 de madurez digital`,
    },
  }

  validateSymptomEvidence(fallback.sintomas, fallbackEvidence)
  const coherencia = validarCoherencia(fallback.clasificacion, fallback.sintomas, fallback.acciones)
  const genericity = validarGenericity(
    fallback.clasificacion,
    fallback.redaccion.resumen,
    fallback.redaccion.sintomasPrincipales,
  )
  if (!coherencia.valido || !genericity.valido) {
    throw new Error(`No existe fallback seguro: ${[...coherencia.errores, ...genericity.errores].join("; ")}`)
  }

  return fallback
}

export async function ejecutarPipelineDiagnostico(
  campos: FormularioCampos,
  onProgress?: (paso: number, total: number, descripcion: string) => void,
  evidence: EvidenceItem[] = buildDiagnosticEvidence(campos),
): Promise<DiagnosticoResult> {
  const startTime = Date.now()

  try {
    onProgress?.(1, 7, "Clasificando tu negocio")
    const clasificacion = clasificarNegocio(campos)

    onProgress?.(2, 7, "Analizando síntomas digitales")
    const sintomas = await llamarLLMSintomas(campos, clasificacion, evidence)

    onProgress?.(3, 7, "Identificando hallazgos prioritarios")
    const findings = await llamarLLMHallazgos(sintomas)

    onProgress?.(4, 7, "Definiendo tu ruta de mejora")
    const route = deriveDiagnosticRoute(findings, clasificacion)

    onProgress?.(5, 7, "Seleccionando acciones recomendadas")
    const acciones = await llamarLLMAcciones(campos, clasificacion, sintomas)

    onProgress?.(6, 7, "Validando coherencia del diagnóstico")
    const coherencia = validarCoherencia(clasificacion, sintomas, acciones)
    if (!coherencia.valido) {
      throw new Error(`Acciones incoherentes después de validación: ${coherencia.errores.join("; ")}`)
    }

    onProgress?.(7, 7, "Redactando tu diagnóstico personalizado")
    const redaccion = await llamarLLMRedaccion(clasificacion, sintomas, acciones)

    const duration = Date.now() - startTime
    console.log(`Pipeline completado en ${duration}ms`)

    return { clasificacion, evidence: buildPublicEvidence(evidence), sintomas, findings, ...route, acciones, redaccion }
  } catch (error) {
    console.error("Error en pipeline, usando fallback:", error)
    return generarFallback(campos, evidence)
  }
}

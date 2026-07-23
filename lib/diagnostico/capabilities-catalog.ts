import type {
  ClasificacionResult,
  DiagnosticFinding,
  PublicRecommendation,
  RequiredCapability,
  SuccessMetric,
} from "./schemas"

interface CapabilityDefinition {
  id: string
  name: string
  description: string
  symptomIds: string[]
  keywords: string[]
  objective: string
  actions: string[]
  prerequisites: string[]
  alternatives: string[]
  notRecommendedYet: string[]
  metricName: string
}

export const CAPABILITIES_CATALOG: CapabilityDefinition[] = [
  {
    id: "centralizar_clientes",
    name: "Centralizar clientes y prospectos",
    description: "Mantener contactos, historial y responsables en un solo lugar.",
    symptomIds: ["sin_crm", "comunicacion_fragmentada"],
    keywords: ["crm", "clientes", "prospectos", "excel", "correo", "whatsapp"],
    objective: "Contar con una fuente única para atender y dar seguimiento a cada contacto.",
    actions: ["Definir una ficha única de cliente y prospecto.", "Registrar los contactos activos y su siguiente paso.", "Asignar un responsable por seguimiento."],
    prerequisites: ["Lista actual de contactos disponible."],
    alternatives: ["Hoja compartida con campos definidos.", "CRM ligero cuando el proceso esté estable."],
    notRecommendedYet: ["Un CRM complejo antes de definir datos y etapas mínimas."],
    metricName: "Contactos activos con historial y siguiente paso registrado",
  },
  {
    id: "seguimiento_postservicio",
    name: "Dar seguimiento comercial y postservicio",
    description: "Asegurar que prospectos y clientes reciban contacto oportuno antes y después del servicio.",
    symptomIds: ["sin_seguimiento_postventa", "sin_embudo_ventas", "sin_programa_fidelidad"],
    keywords: ["seguimiento", "postservicio", "postventa", "recurren", "fuga", "clientes"],
    objective: "Evitar que el seguimiento dependa de la memoria o de mensajes aislados.",
    actions: ["Definir cuándo contactar a cada prospecto o cliente.", "Crear recordatorios manuales para el siguiente contacto.", "Revisar semanalmente los contactos sin respuesta."],
    prerequisites: ["Contactos centralizados y responsable definido."],
    alternatives: ["Calendario compartido y plantillas de mensajes.", "Automatización ligera después de validar el proceso manual."],
    notRecommendedYet: ["Automatizaciones masivas sin un proceso de seguimiento probado."],
    metricName: "Contactos con seguimiento realizado en la fecha definida",
  },
  {
    id: "medir_tiempo_costos",
    name: "Medir tiempo, costos y rentabilidad operativa",
    description: "Conocer el esfuerzo real de cada proyecto antes de escalar o ajustar precios.",
    symptomIds: ["procesos_manuales", "decision_por_intuicion"],
    keywords: ["horas", "tiempo", "costos", "rentabilidad", "factura", "estimados"],
    objective: "Comparar el esfuerzo estimado con el esfuerzo real por servicio o proyecto.",
    actions: ["Registrar horas y costos relevantes por proyecto durante dos semanas.", "Comparar estimado y real al cerrar cada proyecto.", "Revisar los casos con mayor desviación antes de cotizar de nuevo."],
    prerequisites: ["Lista de proyectos o servicios activos."],
    alternatives: ["Registro simple en hoja compartida.", "Herramienta de registro de tiempo cuando exista hábito de captura."],
    notRecommendedYet: ["Integraciones financieras complejas sin datos operativos básicos."],
    metricName: "Proyectos con tiempo registrado y comparado contra el estimado",
  },
  {
    id: "estandarizar_operacion",
    name: "Estandarizar cotización y operación",
    description: "Convertir tareas repetidas en pasos claros, responsables y entregables verificables.",
    symptomIds: ["procesos_manuales", "comunicacion_fragmentada"],
    keywords: ["cotiza", "propuesta", "manual", "proceso", "desde_cero", "agenda"],
    objective: "Reducir variación y retrabajo en las tareas que se repiten.",
    actions: ["Documentar los pasos del servicio más frecuente.", "Crear una plantilla de cotización o propuesta.", "Usar una lista de verificación antes de cerrar cada entrega."],
    prerequisites: ["Elegir un proceso frecuente para empezar."],
    alternatives: ["Plantillas y checklist compartidos.", "Automatización sólo después de validar el flujo manual."],
    notRecommendedYet: ["Automatizar un proceso que todavía cambia en cada caso."],
    metricName: "Entregas realizadas con el proceso y checklist definidos",
  },
  {
    id: "captacion_visibilidad",
    name: "Generar captación y visibilidad digital",
    description: "Hacer visible la oferta del negocio en canales que puedan medirse y atenderse.",
    symptomIds: ["sin_presencia_digital", "presencia_desactualizada", "sin_google_business", "dependencia_boca_a_boca"],
    keywords: ["referidos", "visibilidad", "presencia", "google", "captación", "canales"],
    objective: "Reducir la dependencia de un solo canal y facilitar que nuevos clientes encuentren el negocio.",
    actions: ["Definir el canal digital prioritario para el tipo de cliente.", "Actualizar la información esencial de servicios y contacto.", "Registrar de dónde llega cada nuevo prospecto."],
    prerequisites: ["Oferta y datos de contacto claros."],
    alternatives: ["Perfil local o página informativa básica.", "Contenido o campañas cuando ya exista seguimiento de prospectos."],
    notRecommendedYet: ["Invertir en publicidad sin registrar contactos ni conversiones."],
    metricName: "Prospectos nuevos registrados por canal",
  },
  {
    id: "medir_conversion_desempeno",
    name: "Medir conversión y desempeño comercial",
    description: "Usar registros básicos para decidir qué canales y etapas requieren atención.",
    symptomIds: ["sin_metricas", "decision_por_intuicion", "publicidad_sin_medicion", "sin_embudo_ventas"],
    keywords: ["métricas", "medición", "conversión", "resultados", "intuición", "ads"],
    objective: "Contar con una lectura simple de entradas, avances y cierres antes de optimizar.",
    actions: ["Registrar origen, etapa y resultado de cada prospecto.", "Revisar semanalmente los avances y cierres.", "Definir una sola métrica inicial para cada canal activo."],
    prerequisites: ["Etapas comerciales mínimas y contactos centralizados."],
    alternatives: ["Tablero simple en hoja compartida.", "Analítica integrada cuando los registros sean consistentes."],
    notRecommendedYet: ["Metas numéricas o dashboards complejos sin línea base."],
    metricName: "Prospectos con origen, etapa y resultado registrados",
  },
]

function levelForMaturity(maturity: number): RequiredCapability["level"] {
  if (maturity <= 2) return "inicial"
  if (maturity <= 3) return "consolidacion"
  return "escalable"
}

export function deriveDiagnosticRoute(
  findings: DiagnosticFinding[],
  clasificacion: ClasificacionResult,
): Pick<{ capabilities: RequiredCapability[]; recommendations: PublicRecommendation[]; metrics: SuccessMetric[] }, "capabilities" | "recommendations" | "metrics"> {
  const ranked = CAPABILITIES_CATALOG.map((definition) => {
    const matchingFindings = findings.filter((finding) => {
      const text = `${finding.title} ${finding.summary} ${finding.businessImpact} ${finding.symptomIds.join(" ")}`.toLowerCase()
      return finding.symptomIds.some((id) => definition.symptomIds.includes(id))
        || definition.keywords.some((keyword) => text.includes(keyword))
    })
    return { definition, findings: matchingFindings, score: matchingFindings.reduce((sum, finding) => sum + finding.severity, 0) }
  }).filter((candidate) => candidate.score > 0)

  const selected = (ranked.length ? ranked : CAPABILITIES_CATALOG.slice(0, 1).map((definition) => ({ definition, findings: [findings[0]], score: findings[0].severity })))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const capabilities = selected.map(({ definition, findings: relatedFindings }, index) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    findingIds: relatedFindings.map((finding) => finding.id),
    priority: (index + 1) as 1 | 2 | 3,
    level: levelForMaturity(clasificacion.madurezDigital),
  }))

  const metrics = selected.map(({ definition, findings: relatedFindings }, index) => ({
    id: `metric_${definition.id}`,
    name: definition.metricName,
    baselineStatus: "por_medir" as const,
    reviewHorizon: index === 0 ? "30_dias" as const : index === 1 ? "60_dias" as const : "90_dias" as const,
    sourceEvidenceIds: [...new Set(relatedFindings.flatMap((finding) => finding.evidenceIds))],
  }))

  const recommendations = selected.map(({ definition, findings: relatedFindings }, index) => ({
    id: `recommendation_${definition.id}`,
    capabilityIds: [definition.id],
    findingIds: relatedFindings.map((finding) => finding.id),
    title: definition.name,
    objective: definition.objective,
    actions: definition.actions,
    rationale: `Responde a ${relatedFindings.map((finding) => finding.title).join(" y ")}.`,
    horizon: index === 0 ? "ahora" as const : index === 1 ? "despues" as const : "cuando_haya_evidencia" as const,
    complexity: clasificacion.madurezDigital <= 2 ? "baja" as const : "media" as const,
    prerequisites: definition.prerequisites,
    alternatives: definition.alternatives,
    notRecommendedYet: definition.notRecommendedYet,
    metricIds: [`metric_${definition.id}`],
  }))

  return { capabilities, recommendations, metrics }
}

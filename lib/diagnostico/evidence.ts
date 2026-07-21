import type { EvidenceItem } from "@/lib/ai/contracts"
import type { FormularioCampos } from "./schemas"

function declaredEvidence(
  id: string,
  field: string,
  value: unknown,
  collectedAt: string,
): EvidenceItem {
  return {
    id,
    source: "questionnaire",
    field,
    rawValue: value,
    normalizedValue: value,
    reliability: "declared",
    collectedAt,
  }
}

export function buildDiagnosticEvidence(
  campos: FormularioCampos,
  collectedAt = new Date().toISOString(),
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [
    declaredEvidence("business.industry", "industria", campos.industria, collectedAt),
    declaredEvidence("business.size", "tamano_empresa", campos.tamano_empresa, collectedAt),
    declaredEvidence("business.pain_points", "dolores_principales", campos.dolores_principales, collectedAt),
    declaredEvidence("business.tools", "herramientas_actuales", campos.herramientas_actuales, collectedAt),
    declaredEvidence("business.budget", "presupuesto", campos.presupuesto, collectedAt),
    declaredEvidence("business.urgency", "urgencia", campos.urgencia, collectedAt),
  ]

  if (campos.industria_otra) evidence.push(declaredEvidence("business.industry_other", "industria_otra", campos.industria_otra, collectedAt))
  if (campos.dolor_otro) evidence.push(declaredEvidence("business.pain_other", "dolor_otro", campos.dolor_otro, collectedAt))
  if (campos.herramienta_otra) evidence.push(declaredEvidence("business.tool_other", "herramienta_otra", campos.herramienta_otra, collectedAt))

  for (const [field, value] of Object.entries(campos.respuestas_branch ?? {})) {
    if (value.trim()) evidence.push(declaredEvidence(`branch.${field}`, field, value, collectedAt))
  }

  for (const answer of campos.respuestas_normalizadas ?? []) {
    evidence.push({
      id: `adaptive.${answer.questionId}`,
      source: "adaptive_answer",
      field: answer.questionId,
      rawValue: answer.values,
      normalizedValue: answer.values,
      reliability: "declared",
      collectedAt: answer.collectedAt,
      metadata: { answerMode: answer.answerMode },
    })
  }

  const website = campos.website_analysis
  if (website && !website.error) {
    const websiteUrl = campos.url_sitio ?? website.url
    if (websiteUrl) evidence.push({
      id: "website.url",
      source: "website",
      field: "url_sitio",
      rawValue: websiteUrl,
      normalizedValue: websiteUrl,
      reliability: "observed",
      collectedAt,
    })
    if (website.descripcion) evidence.push({
      id: "website.description",
      source: "website",
      field: "descripcion",
      rawValue: website.descripcion,
      normalizedValue: website.descripcion,
      reliability: "observed",
      collectedAt,
    })
  }

  return evidence
}

export function formatEvidenceValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "boolean") return value ? "Sí" : "No"
  if (typeof value === "string" || typeof value === "number") return String(value)
  return "Dato registrado"
}

export function getPublicEvidenceLabel(evidence: EvidenceItem): string {
  const labels: Record<string, string> = {
    industria: "Industria declarada",
    tamano_empresa: "Tamaño del equipo",
    dolores_principales: "Desafíos declarados",
    herramientas_actuales: "Herramientas actuales",
    presupuesto: "Presupuesto indicado",
    urgencia: "Urgencia indicada",
    industria_otra: "Industria especificada",
    dolor_otro: "Desafío especificado",
    herramienta_otra: "Herramienta especificada",
    url_sitio: "Sitio web analizado",
    descripcion: "Descripción observada en el sitio",
  }
  return `${labels[evidence.field] ?? evidence.field.replace(/_/g, " ")}: ${formatEvidenceValue(evidence.normalizedValue)}`
}

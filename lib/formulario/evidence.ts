import type { EvidenceItem } from "@/lib/ai/contracts"
import type { WizardData } from "@/lib/types"

function declaredEvidence(
  id: string,
  field: string,
  value: unknown,
  collectedAt: string,
  metadata?: Record<string, unknown>,
): EvidenceItem {
  return {
    id,
    source: "questionnaire",
    field,
    rawValue: value,
    normalizedValue: value,
    reliability: "declared",
    collectedAt,
    metadata,
  }
}

export function buildWizardEvidence(data: WizardData, collectedAt = new Date().toISOString()): EvidenceItem[] {
  if (!data.step1 || !data.step2) return []

  const { step1, step2, step3 } = data
  const evidence: EvidenceItem[] = [
    declaredEvidence("business.industry", "industria", step1.industria, collectedAt),
    declaredEvidence("business.size", "tamano_empresa", step1.tamano_empresa, collectedAt),
    declaredEvidence("business.pain_points", "dolores_principales", step1.dolores_principales, collectedAt),
    declaredEvidence("business.tools", "herramientas_actuales", step1.herramientas_actuales, collectedAt),
    declaredEvidence("business.budget", "presupuesto", step2.presupuesto, collectedAt),
    declaredEvidence("business.urgency", "urgencia", step2.urgencia, collectedAt),
  ]

  if (step1.industria_otra) evidence.push(declaredEvidence("business.industry_other", "industria_otra", step1.industria_otra, collectedAt))
  if (step1.dolor_otro) evidence.push(declaredEvidence("business.pain_other", "dolor_otro", step1.dolor_otro, collectedAt))
  if (step1.herramienta_otra) evidence.push(declaredEvidence("business.tool_other", "herramienta_otra", step1.herramienta_otra, collectedAt))

  for (const [field, value] of Object.entries(step2.respuestas_branch)) {
    if (value.trim()) evidence.push(declaredEvidence(`branch.${field}`, field, value, collectedAt))
  }

  for (const answer of step3?.respuestas_normalizadas ?? []) {
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

  const website = step1.website_analysis
  if (website && !website.error) {
    const websiteUrl = step1.url_sitio ?? website.url
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

export function buildExternalContextSnapshot(data: WizardData) {
  const website = data.step1?.website_analysis
  return website && !website.error ? { website } : {}
}

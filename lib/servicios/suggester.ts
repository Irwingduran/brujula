import { prisma } from "@/lib/prisma"
import { SERVICES_CATALOG, type ServiceDefinition } from "./catalog"
import type { FormularioCampos } from "../diagnostico/schemas"

export interface ServiceSuggestion {
  service: ServiceDefinition
  score: number
  reason: string
}

export function suggestServicesForLead(
  campos: FormularioCampos,
  maxResults: number = 4,
): { suggestions: ServiceSuggestion[]; industry: string; pain_points: string[] } {
  const industry = campos.industria
  const painPoints = campos.dolores_principales

  const candidates = SERVICES_CATALOG.filter(
    (s) => s.industries.includes(industry),
  )

  const scored: ServiceSuggestion[] = candidates.map((svc) => {
    let score = 0
    const reasons: string[] = []

    // +2 points per matching pain point
    const matchingPains = svc.pain_points.filter((p) => painPoints.includes(p))
    score += matchingPains.length * 2
    if (matchingPains.length > 0) {
      reasons.push(`Resuelve ${matchingPains.length} de tus dolores principales`)
    }

    // +1 for featured
    if (svc.featured) {
      score += 1
      reasons.push("Servicio destacado")
    }

    // +1 if it matches urgency (inmediata -> "rapido" type services)
    if (campos.urgencia === "inmediata" && svc.timeline && svc.timeline.includes("1-2")) {
      score += 1
    }

    // Budget match
    if (campos.presupuesto !== "no_definido" && campos.presupuesto !== "menos_500") {
      score += 1
    }

    return {
      service: svc,
      score,
      reason: reasons[0] || "Recomendado para tu industria",
    }
  })

  scored.sort((a, b) => b.score - a.score)

  return {
    suggestions: scored.slice(0, maxResults),
    industry,
    pain_points: painPoints,
  }
}

export async function assignSuggestedServices(
  leadId: string,
  industry: string,
  painPoints: string[],
  urgency: string,
  budget: string,
): Promise<number> {
  const candidates = SERVICES_CATALOG.filter(
    (s) => s.industries.includes(industry),
  )

  const scored = candidates.map((svc) => {
    let score = 0
    const matchingPains = svc.pain_points.filter((p) => painPoints.includes(p))
    score += matchingPains.length * 3
    if (svc.featured) score += 2
    if (urgency === "inmediata" && svc.timeline?.includes("1-2")) score += 1
    if (budget !== "no_definido" && budget !== "menos_500") score += 1
    return { svc, score }
  })

  scored.sort((a, b) => b.score - a.score)

  const topServices = scored.slice(0, 3)

  let assigned = 0
  for (const item of topServices) {
    if (item.score === 0) continue
    const svc = item.svc

    const dbService = await prisma.service.findUnique({ where: { slug: svc.slug } })
    if (!dbService) continue

    await prisma.leadService.upsert({
      where: {
        lead_id_service_id: { lead_id: leadId, service_id: dbService.id },
      },
      update: { assigned_by: "pipeline", status: "suggested" },
      create: {
        lead_id: leadId,
        service_id: dbService.id,
        assigned_by: "pipeline",
        status: "suggested",
      },
    })
    assigned++
  }

  return assigned
}

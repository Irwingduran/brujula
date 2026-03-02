import type { WizardData, ScoreBreakdown, LeadSegment, BudgetRange, Urgency, CompanySize } from "./types"

// Budget scoring — max 30 pts
function scoreBudget(budget: BudgetRange): number {
  const map: Record<BudgetRange, number> = {
    "3000_plus": 30,
    "1500_3000": 25,
    "500_1500": 18,
    "menos_500": 10,
    "no_definido": 5,
  }
  return map[budget] ?? 5
}

// Urgency scoring — max 25 pts
function scoreUrgency(urgency: Urgency): number {
  const map: Record<Urgency, number> = {
    inmediata: 25,
    "1_3_meses": 18,
    "3_6_meses": 10,
    solo_explorando: 3,
  }
  return map[urgency] ?? 3
}

// Company size scoring — max 20 pts
function scoreCompanySize(size: CompanySize): number {
  const map: Record<CompanySize, number> = {
    "50_plus": 20,
    "16_50": 18,
    "6_15": 15,
    "2_5": 10,
    solo: 5,
  }
  return map[size] ?? 5
}

// Problem clarity scoring — max 15 pts
// Based on how much detail the user provided in free text fields
function scoreProblemClarity(data: WizardData): number {
  let totalChars = 0

  // Count characters from branching answers
  if (data.step2) {
    for (const value of Object.values(data.step2.respuestas_branch)) {
      totalChars += (value || "").length
    }
  }

  // Count characters from AI follow-up answers
  if (data.step3) {
    for (const answer of data.step3.respuestas_ia) {
      totalChars += (answer || "").length
    }
  }

  if (totalChars > 200) return 15
  if (totalChars > 100) return 12
  if (totalChars > 50) return 8
  if (totalChars > 20) return 4
  return 2
}

// Industry fit scoring — max 10 pts
// Higher score for industries with more digitalization potential
function scoreIndustryFit(industry: string): number {
  const highFit = ["servicios_profesionales", "retail", "inmobiliaria", "salud"]
  const medFit = ["restaurante", "educacion", "tecnologia"]
  const lowFit = ["manufactura", "logistica"]

  if (highFit.includes(industry)) return 10
  if (medFit.includes(industry)) return 7
  if (lowFit.includes(industry)) return 5
  return 6 // "otra"
}

// Segment classification
function classifySegment(score: number): LeadSegment {
  if (score >= 70) return "HOT"
  if (score >= 40) return "WARM"
  return "COLD"
}

// Main scoring function
export function calculateScore(data: WizardData): ScoreBreakdown {
  if (!data.step1 || !data.step2) {
    return {
      presupuesto: 0,
      urgencia: 0,
      tamano_empresa: 0,
      claridad_problema: 0,
      industria_fit: 0,
      total: 0,
      segmento: "COLD",
    }
  }

  const presupuesto = scoreBudget(data.step2.presupuesto)
  const urgencia = scoreUrgency(data.step2.urgencia)
  const tamano_empresa = scoreCompanySize(data.step1.tamano_empresa)
  const claridad_problema = scoreProblemClarity(data)
  const industria_fit = scoreIndustryFit(data.step1.industria)

  const total = presupuesto + urgencia + tamano_empresa + claridad_problema + industria_fit
  const segmento = classifySegment(total)

  return {
    presupuesto,
    urgencia,
    tamano_empresa,
    claridad_problema,
    industria_fit,
    total,
    segmento,
  }
}

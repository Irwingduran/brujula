export interface KnowledgeSymptom {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  industryOnly?: boolean
}

export interface KnowledgeAction {
  id: string
  titulo: string
  descripcion: string
  presupuestoRequerido: "bajo" | "medio" | "alto"
  impacto: "rapido" | "mediano_plazo" | "largo_plazo"
  industryOnly?: boolean
}

export interface MaturityDimension {
  nombre: string
  descripcion: string
  niveles: string[]
}

export interface IndustryBenchmark {
  metrica: string
  valor: string
  descripcion: string
}

export interface KnowledgePack {
  industryCode: string
  industryLabel: string
  subsectors: Record<string, string>

  diagnosticFocus: string[]
  promptGuidance: string

  maturityDimensions: MaturityDimension[]
  benchmarks: IndustryBenchmark[]

  symptoms: KnowledgeSymptom[]
  actions: KnowledgeAction[]

  fallbackDiagnosis: {
    texto: string
    beneficios: string[]
    sugerencia: string
    plan: { dia_30: string; dia_60: string; dia_90: string }
  }
}

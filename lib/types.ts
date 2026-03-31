// ============================
// Lead Generation System Types
// ============================

export type PipelineStage =
  | "wizard_completado"
  | "email_enviado"
  | "llamada_agendada"
  | "cerrado"
  | "archivado"

export type LeadSegment = "HOT" | "WARM" | "COLD"

export type Urgency = "inmediata" | "1_3_meses" | "3_6_meses" | "solo_explorando"

export type BudgetRange =
  | "menos_500"
  | "500_1500"
  | "1500_3000"
  | "3000_plus"
  | "no_definido"

export type CompanySize =
  | "solo"
  | "2_5"
  | "6_15"
  | "16_50"
  | "50_plus"

export type PainPoint =
  | "procesos_manuales"
  | "falta_visibilidad"
  | "ventas_estancadas"
  | "presencia_online"
  | "sin_trazabilidad"
  | "atencion_cliente"
  | "otro"

export type CurrentTool =
  | "whatsapp"
  | "excel"
  | "crm_basico"
  | "redes_sociales"
  | "email_manual"
  | "nada"
  | "otro"

// ============================
// Wizard Data (form state)
// ============================

export interface WizardStep1Data {
  industria: string
  industria_otra?: string
  tamano_empresa: CompanySize
  dolores_principales: PainPoint[]
  dolor_otro?: string
  herramientas_actuales: CurrentTool[]
  herramienta_otra?: string
}

export interface WizardStep2Data {
  respuestas_branch: Record<string, string>
  presupuesto: BudgetRange
  urgencia: Urgency
  nombre: string
  email: string
  telefono: string
}

export interface WizardStep3Data {
  respuestas_ia: string[]
}

export interface WizardData {
  step1: WizardStep1Data | null
  step2: WizardStep2Data | null
  step3: WizardStep3Data | null
}

// ============================
// Scoring
// ============================

export interface ScoreBreakdown {
  presupuesto: number       // max 30
  urgencia: number          // max 25
  tamano_empresa: number    // max 20
  claridad_problema: number // max 15
  industria_fit: number     // max 10
  total: number             // max 100
  segmento: LeadSegment
}

// ============================
// Diagnosis
// ============================

export interface DiagnosisResult {
  titulo_servicio: string
  descripcion: string
  diagnostico_texto: string
  roi_estimado: string
  precio_rango: string
  beneficios: string[]
  siguiente_paso: string
}

// ============================
// Lead (full model)
// ============================

export interface Lead {
  id: string
  created_at: string
  // Contact
  nombre: string
  email: string
  telefono: string
  // Business
  industria: string
  tamano_empresa: CompanySize
  dolores_principales: PainPoint[]
  herramientas_actuales: CurrentTool[]
  descripcion_problema: string
  // Qualification
  presupuesto: BudgetRange
  urgencia: Urgency
  respuestas_branch: Record<string, string>
  respuestas_ia: string[]
  // Generated
  diagnostico: DiagnosisResult | null
  score: ScoreBreakdown | null
  // Pipeline
  segmento: LeadSegment
  estado_pipeline: PipelineStage
  llamada_agendada_at: string | null
  ultima_actividad_at: string
  notas_freelancer: string
}

// ============================
// Branching (Step 2 dynamic fields)
// ============================

export interface BranchField {
  id: string
  label: string
  type: "text" | "textarea" | "select"
  placeholder?: string
  options?: { value: string; label: string }[]
}

export interface BranchConfig {
  pain: PainPoint
  title: string
  fields: BranchField[]
}

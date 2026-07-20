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
  url_sitio?: string 
  website_analysis?: WebsiteAnalysis 
}

export interface WizardStep2Data {
  respuestas_branch: Record<string, string>
  presupuesto: BudgetRange
  urgencia: Urgency
  nombre: string
  email: string
  telefono: string
}

export interface WebsiteAnalysis {
  url: string
  titulo?: string
  descripcion?: string
  resumen_contenido: string   // lo que encontró la IA al analizar el sitio
  tiene_blog: boolean
  tiene_ecommerce: boolean
  tiene_formulario_contacto: boolean
  redes_sociales: string[]
  keywords_detectadas: string[]
  error?: string              // si el scraping falló
}

export interface WizardStep3Data {
  respuestas_ia: string[]
}

export interface AIQuestionOption {
  value: string
  label: string
}

export interface AIQuestion {
  question: string
  options: AIQuestionOption[]
}

export interface AIQuestionsResponse {
  questions: AIQuestion[]
  hasMoreQuestions: boolean
}

export interface WizardData {
  step1: WizardStep1Data | null
  step2: WizardStep2Data | null
  step3: WizardStep3Data | null
  websiteAnalysis?: WebsiteAnalysis  
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
  patron_negocio: string
  riesgo_principal: string
  cambio_clave: string
  plan_90_dias: {
    mes_1: string
    mes_2: string
    mes_3: string
  }
  // Legacy fields for backward compat with stored data
  titulo_servicio?: string
  descripcion?: string
  diagnostico_texto?: string
  roi_estimado?: string
  precio_rango?: string
  beneficios?: string[]
  siguiente_paso?: string
  plan_30_60_90?: {
    dia_30: string
    dia_60: string
    dia_90: string
  }
}

export interface AIDiagnosisResult {
  patron_negocio: string
  riesgo_principal: string
  cambio_clave: string
  plan_90_dias: {
    mes_1: string
    mes_2: string
    mes_3: string
  }
  caso_exito: {
    empresa: string
    industria: string
    problema: string
    solucion: string
    resultado: string
  }

  // ─── [ADMIN] — Campos legacy del CRM (opcional) ───
  titulo_servicio?: string
  descripcion?: string
  resumen_personalizado?: string
  tiempo_ahorro?: string
  pasos_accion?: string[]
  diagnostico_ejecutivo?: string
  prioridades_inmediatas?: string[]
  dato_industria?: string
  diagnostico_texto?: string
  beneficios?: string[]
  sugerencia_mejora?: string
  plan_30_60_90?: {
    dia_30: string
    dia_60: string
    dia_90: string
  }

  hallazgos_web?: {
    fortalezas: string[]
    brechas_criticas: string[]
    recomendaciones_tecnicas: string[]
  }
}

// ============================
// Professional Briefing (for pre-meet preparation)
// ============================

export interface ProfessionalBriefing {
  // Quick summary (2 min read)
  resumen_rapido: string

  // Prospect profile
  perfil: {
    tipo_decision_maker: string
    madurez_digital: "baja" | "media" | "alta"
    señales_compra: string[]
    riesgos: string[]
  }

  // Website analysis for professional (only if URL provided)
  analisis_web_para_profesional?: {
    estado_actual: string
    oportunidades_quick_win: string[]
    brechas_vs_competencia: string
    recomendacion_tecnica: string
  }

  // Talking points for the meeting
  puntos_conversacion: {
    abrir_con: string
    profundizar: string[]
    no_mencionar: string[]
    cerrar_con: string
  }

  // Suggested proposal
  propuesta_sugerida: {
    servicio_primario: string
    servicios_adicionales: string[]
    rango_precio_sugerido: string
    timeline_implementacion: string
    roi_argumento: string
  }

  // Metadata
  generado_at: string
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diagnostico_ia: AIDiagnosisResult | any | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  briefing_profesional: ProfessionalBriefing | any | null
  score: ScoreBreakdown | null
  url_sitio?: string
  website_analisis?: WebsiteAnalysis | null
  // Pipeline
  segmento: LeadSegment
  estado_pipeline: PipelineStage
  llamada_agendada_at: string | null
  enlace_reunion?: string | null
  reunion_notificado_at?: string | null
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
  pain?: PainPoint
  title: string
  fields: BranchField[]
  industries?: string[]
}

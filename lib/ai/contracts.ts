import { z } from "zod"

export const LeadIdRequestSchema = z.object({
  leadId: z.string().min(1),
})

export const BranchAnswersSchema = z.record(z.string())

export const ScoreBreakdownSchema = z.object({
  presupuesto: z.number(),
  urgencia: z.number(),
  tamano_empresa: z.number(),
  claridad_problema: z.number(),
  industria_fit: z.number(),
  total: z.number(),
  segmento: z.string(),
})

export const AIDiagnosisContextSchema = z.object({
  titulo_servicio: z.string().optional(),
  diagnostico_texto: z.string().optional(),
  tiempo_ahorro: z.string().optional(),
  prioridades_inmediatas: z.array(z.string()).optional(),
  patron_negocio: z.string().optional(),
  riesgo_principal: z.string().optional(),
  cambio_clave: z.string().optional(),
  hallazgos_web: z.object({
    fortalezas: z.array(z.string()),
    brechas_criticas: z.array(z.string()),
  }).optional(),
}).passthrough()

export const WebsiteAnalysisSchema = z.object({
  url: z.string().url().optional(),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  resumen_contenido: z.string().optional(),
  tiene_blog: z.boolean().optional(),
  tiene_ecommerce: z.boolean().optional(),
  tiene_formulario_contacto: z.boolean().optional(),
  redes_sociales: z.array(z.string()).optional(),
  keywords_detectadas: z.array(z.string()).optional(),
  oportunidades_mejora: z.array(z.string()).optional(),
  error: z.string().optional(),
}).strict()

export type WebsiteAnalysis = z.infer<typeof WebsiteAnalysisSchema>

export const BriefingSchema = z.object({
  resumen_rapido: z.string().min(1),
  perfil: z.object({
    tipo_decision_maker: z.string().min(1),
    madurez_digital: z.enum(["baja", "media", "alta"]),
    señales_compra: z.array(z.string()),
    riesgos: z.array(z.string()),
  }),
  analisis_web_para_profesional: z.object({
    estado_actual: z.string(),
    oportunidades_quick_win: z.array(z.string()),
    brechas_vs_competencia: z.string(),
    recomendacion_tecnica: z.string(),
  }).optional(),
  puntos_conversacion: z.object({
    abrir_con: z.string().min(1),
    profundizar: z.array(z.string()),
    no_mencionar: z.array(z.string()),
    cerrar_con: z.string().min(1),
  }),
  propuesta_sugerida: z.object({
    servicio_primario: z.string().min(1),
    servicios_adicionales: z.array(z.string()),
    rango_precio_sugerido: z.string().min(1),
    timeline_implementacion: z.string().min(1),
    roi_argumento: z.string().min(1),
  }),
  generado_at: z.string().datetime().optional(),
})

export type Briefing = z.infer<typeof BriefingSchema>

export const DevelopmentPlanSchema = z.object({
  diagnostico_tecnico: z.string().min(1),
  soluciones_recomendadas: z.array(z.object({
    problema: z.string().min(1),
    solucion: z.string().min(1),
    herramientas_sugeridas: z.array(z.string()),
    complejidad: z.enum(["baja", "media", "alta"]),
    prioridad: z.enum(["alta", "media", "baja"]),
    tiempo_estimado: z.string().min(1),
  })).max(4),
  roadmap_implementacion: z.object({
    fase_1: z.string().min(1),
    fase_2: z.string().min(1),
    fase_3: z.string().min(1),
  }),
  observaciones_sitio_web: z.string().min(1),
  plan_seguimiento: z.string().min(1),
})

export type DevelopmentPlan = z.infer<typeof DevelopmentPlanSchema>

export const AnswerModeSchema = z.enum(["single", "multiple", "number", "text", "boolean"])
export const AnswerSourceSchema = z.enum(["questionnaire", "adaptive_question"])
export const EvidenceSourceSchema = z.enum([
  "questionnaire",
  "adaptive_answer",
  "website",
  "google_business",
  "admin",
])

export const NormalizedAnswerSchema = z.object({
  questionId: z.string().min(1),
  values: z.union([z.string(), z.array(z.string()).min(1), z.number(), z.boolean()]),
  source: AnswerSourceSchema,
  answerMode: AnswerModeSchema,
  collectedAt: z.string().datetime(),
})

export type NormalizedAnswer = z.infer<typeof NormalizedAnswerSchema>

export const EvidenceItemSchema = z.object({
  id: z.string().min(1),
  source: EvidenceSourceSchema,
  field: z.string().min(1),
  rawValue: z.unknown(),
  normalizedValue: z.unknown(),
  reliability: z.enum(["declared", "observed", "inferred"]),
  collectedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
})

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>

export const WizardStep1Schema = z.object({
  industria: z.string().min(1),
  industria_otra: z.string().trim().min(1).optional(),
  tamano_empresa: z.enum(["solo", "2_5", "6_15", "16_50", "50_plus"]),
  dolores_principales: z.array(z.string().min(1)).min(1),
  dolor_otro: z.string().trim().min(1).optional(),
  herramientas_actuales: z.array(z.string().min(1)).min(1),
  herramienta_otra: z.string().trim().min(1).optional(),
  url_sitio: z.string().url().optional(),
  website_analysis: WebsiteAnalysisSchema.optional(),
}).superRefine((data, context) => {
  if (data.industria === "otra" && !data.industria_otra) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["industria_otra"], message: "Especifica la industria" })
  }
  if (data.dolores_principales.includes("otro") && !data.dolor_otro) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["dolor_otro"], message: "Describe el desafío" })
  }
  if (data.herramientas_actuales.includes("otro") && !data.herramienta_otra) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["herramienta_otra"], message: "Especifica la herramienta" })
  }
})

export const WizardStep2Schema = z.object({
  respuestas_branch: z.record(z.string()).default({}),
  presupuesto: z.enum(["menos_500", "500_1500", "1500_3000", "3000_plus", "no_definido"]),
  urgencia: z.enum(["inmediata", "1_3_meses", "3_6_meses", "solo_explorando"]),
  nombre: z.string().trim().min(1),
  email: z.string().trim().email(),
  telefono: z.string().trim().min(1),
})

export const WizardStep3Schema = z.object({
  respuestas_ia: z.array(z.string()),
  respuestas_normalizadas: z.array(NormalizedAnswerSchema).default([]),
})

export const WizardSubmissionSchema = z.object({
  step1: WizardStep1Schema,
  step2: WizardStep2Schema,
  step3: WizardStep3Schema.nullable().optional(),
})

export const AdaptiveQuestionOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
})

export const AdaptiveQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(AdaptiveQuestionOptionSchema).min(2),
})

export const AdaptiveQuestionsResponseSchema = z.object({
  questions: z.array(AdaptiveQuestionSchema).min(1),
  hasMoreQuestions: z.boolean(),
})

export const WizardQuestionRequestSchema = z.object({
  step1: WizardStep1Schema,
  step2: WizardStep2Schema,
  round: z.union([z.literal(1), z.literal(2)]).default(1),
  previousAnswers: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).default([]),
})

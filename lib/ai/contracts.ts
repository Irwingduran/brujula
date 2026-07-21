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
  error: z.string().optional(),
  descripcion: z.string().optional(),
  resumen_contenido: z.string().optional(),
  tiene_blog: z.boolean().optional(),
  tiene_ecommerce: z.boolean().optional(),
  tiene_formulario_contacto: z.boolean().optional(),
  redes_sociales: z.array(z.string()).optional(),
  oportunidades_mejora: z.array(z.string()).optional(),
}).passthrough()

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

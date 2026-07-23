import { z } from "zod"
import { WebsiteAnalysisSchema } from "@/lib/ai/contracts"

export const ClasificacionSchema = z.object({
  segmento: z.string(),
  madurezDigital: z.number().int().min(1).max(5),
  perfilRiesgo: z.enum(["alto", "medio", "bajo"]),
  industryCode: z.string(),
  industryLabel: z.string().optional(),
  subsector: z.string().nullable().optional(),
})

export type ClasificacionResult = z.infer<typeof ClasificacionSchema>

export const ConfidenceSchema = z.enum(["alta", "media", "baja"])

export const PublicEvidenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  source: z.enum(["questionnaire", "adaptive_answer", "website", "google_business", "admin"]),
  reliability: z.enum(["declared", "observed", "inferred"]),
})

export const SintomaSchema = z.object({
  sintomaId: z.string().min(1),
  score: z.number().int().min(1).max(5),
  evidencia: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1).max(3),
  confidence: ConfidenceSchema,
})

export const SintomasOutputSchema = z
  .array(SintomaSchema)
  .min(2)
  .max(5)

export type SintomaResult = z.infer<typeof SintomaSchema>

const FindingBaseSchema = z.object({
  symptomIds: z.array(z.string().min(1)).min(1).max(3),
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(350),
  businessImpact: z.string().min(1).max(350),
  confidence: ConfidenceSchema,
  missingInformation: z.array(z.string().min(1)).max(3),
  contradictions: z.array(z.string().min(1)).max(3),
})

function requireContextForLowConfidence(
  finding: z.infer<typeof FindingBaseSchema>,
  context: z.RefinementCtx,
) {
  if (finding.confidence === "baja" && !finding.missingInformation.length && !finding.contradictions.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confidence"],
      message: "La confianza baja debe explicar información faltante o una contradicción",
    })
  }
}

export const FindingDraftSchema = FindingBaseSchema.superRefine(requireContextForLowConfidence)
export type FindingDraft = z.infer<typeof FindingDraftSchema>

export const FindingsDraftOutputSchema = z.array(FindingDraftSchema).min(2).max(3)

export const DiagnosticFindingSchema = FindingBaseSchema.extend({
  id: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1),
  severity: z.number().int().min(1).max(5),
}).superRefine(requireContextForLowConfidence)

export type DiagnosticFinding = z.infer<typeof DiagnosticFindingSchema>

export const CapabilityLevelSchema = z.enum(["inicial", "consolidacion", "escalable"])

export const RequiredCapabilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  findingIds: z.array(z.string().min(1)).min(1),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  level: CapabilityLevelSchema,
})

export type RequiredCapability = z.infer<typeof RequiredCapabilitySchema>

export const BaselineStatusSchema = z.enum(["known", "declared", "por_medir"])

export const SuccessMetricSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baselineStatus: BaselineStatusSchema,
  baselineValue: z.string().min(1).optional(),
  target: z.string().min(1).optional(),
  reviewHorizon: z.enum(["30_dias", "60_dias", "90_dias"]),
  sourceEvidenceIds: z.array(z.string().min(1)),
})

export type SuccessMetric = z.infer<typeof SuccessMetricSchema>

export const PublicRecommendationSchema = z.object({
  id: z.string().min(1),
  capabilityIds: z.array(z.string().min(1)).min(1),
  findingIds: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
  objective: z.string().min(1),
  actions: z.array(z.string().min(1)).min(1).max(3),
  rationale: z.string().min(1),
  horizon: z.enum(["ahora", "despues", "cuando_haya_evidencia"]),
  complexity: z.enum(["baja", "media", "alta"]),
  prerequisites: z.array(z.string().min(1)).max(3),
  alternatives: z.array(z.string().min(1)).min(1).max(3),
  notRecommendedYet: z.array(z.string().min(1)).max(2),
  metricIds: z.array(z.string().min(1)).min(1),
})

export type PublicRecommendation = z.infer<typeof PublicRecommendationSchema>

export const AccionSchema = z.object({
  accionId: z.string().min(1),
  prioridad: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  justificacion: z.string().min(1),
})

export const AccionesOutputSchema = z
  .array(AccionSchema)
  .length(3)

export type AccionResult = z.infer<typeof AccionSchema>

export const RedaccionSchema = z.object({
  resumen: z.string().max(400),
  sintomasPrincipales: z.array(z.string()).length(3),
  planDeAccion: z
    .array(
      z.object({
        paso: z.string().min(1),
        descripcion: z.string().min(1),
        urgencia: z.string().min(1),
      })
    )
    .length(3),
  scoreTexto: z.string().min(1),
})

export type RedaccionResult = z.infer<typeof RedaccionSchema>

export const DiagnosticoFinalSchema = z.object({
  clasificacion: ClasificacionSchema,
  evidence: z.array(PublicEvidenceSchema),
  sintomas: SintomasOutputSchema,
  findings: z.array(DiagnosticFindingSchema).min(1).max(3),
  capabilities: z.array(RequiredCapabilitySchema).min(1).max(3),
  recommendations: z.array(PublicRecommendationSchema).min(1).max(3),
  metrics: z.array(SuccessMetricSchema).min(1).max(3),
  acciones: AccionesOutputSchema,
  redaccion: RedaccionSchema,
})

export type DiagnosticoResult = z.infer<typeof DiagnosticoFinalSchema>

export const FormularioCamposSchema = z.object({
  industria: z.string().min(1),
  industria_otra: z.string().optional(),
  tamano_empresa: z.string().min(1),
  dolores_principales: z.array(z.string().min(1)).min(1),
  dolor_otro: z.string().optional(),
  herramientas_actuales: z.array(z.string()),
  herramienta_otra: z.string().optional(),
  presupuesto: z.string().min(1),
  urgencia: z.string().min(1),
  respuestas_branch: z.record(z.string()).optional(),
  respuestas_ia: z.array(z.string()).optional(),
  respuestas_normalizadas: z.array(z.object({
    questionId: z.string().min(1),
    values: z.union([z.string(), z.array(z.string()).min(1), z.number(), z.boolean()]),
    source: z.enum(["questionnaire", "adaptive_question"]),
    answerMode: z.enum(["single", "multiple", "number", "text", "boolean"]),
    collectedAt: z.string().datetime(),
  })).optional(),
  url_sitio: z.string().url().optional(),
  website_analysis: WebsiteAnalysisSchema.optional(),
})

export type FormularioCampos = z.infer<typeof FormularioCamposSchema>

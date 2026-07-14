import { z } from "zod"

export const ClasificacionSchema = z.object({
  segmento: z.string(),
  madurezDigital: z.number().int().min(1).max(5),
  perfilRiesgo: z.enum(["alto", "medio", "bajo"]),
  industryCode: z.string(),
  industryLabel: z.string().optional(),
  subsector: z.string().nullable().optional(),
})

export type ClasificacionResult = z.infer<typeof ClasificacionSchema>

export const SintomaSchema = z.object({
  sintomaId: z.string().min(1),
  score: z.number().int().min(1).max(5),
  evidencia: z.string().min(1),
})

export const SintomasOutputSchema = z
  .array(SintomaSchema)
  .min(2)
  .max(5)

export type SintomaResult = z.infer<typeof SintomaSchema>

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
  sintomas: SintomasOutputSchema,
  acciones: AccionesOutputSchema,
  redaccion: RedaccionSchema,
})

export type DiagnosticoResult = z.infer<typeof DiagnosticoFinalSchema>

export const FormularioCamposSchema = z.object({
  industria: z.string().min(1),
  industria_otra: z.string().optional(),
  tamano_empresa: z.string().min(1),
  dolores_principales: z.array(z.string()),
  herramientas_actuales: z.array(z.string()),
  presupuesto: z.string().min(1),
  urgencia: z.string().min(1),
  respuestas_branch: z.record(z.string()).optional(),
  respuestas_ia: z.array(z.string()).optional(),
})

export type FormularioCampos = z.infer<typeof FormularioCamposSchema>

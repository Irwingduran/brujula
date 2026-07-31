import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ejecutarPipelineDiagnostico } from "@/lib/diagnostico/pipeline"
import { FormularioCamposSchema } from "@/lib/diagnostico/schemas"
import { EvidenceItemSchema } from "@/lib/ai/contracts"
import { buildDiagnosticEvidence } from "@/lib/diagnostico/evidence"
import { sendDiagnosticoEmailOnce } from "@/lib/diagnostico/send-email"
import { assignSuggestedServices } from "@/lib/servicios/suggester"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, leadId } = body

    if (!formData) {
      return NextResponse.json({ error: "formData es requerido" }, { status: 400 })
    }

    const parsed = FormularioCamposSchema.safeParse(formData)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", detalles: parsed.error.flatten() }, { status: 400 })
    }

    const fallbackEvidence = buildDiagnosticEvidence(parsed.data)
    let evidence = fallbackEvidence
    if (leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { evidencia_json: true },
      })
      const storedEvidence = EvidenceItemSchema.array().safeParse(lead?.evidencia_json)
      if (storedEvidence.success && storedEvidence.data.length > 0) {
        evidence = storedEvidence.data
      }
    }

    const resultado = await ejecutarPipelineDiagnostico(parsed.data, undefined, evidence)
    const durationMs = Date.now() - (body._startTime || Date.now())

    if (leadId) {
      let persisted = false
      try {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            diagnostico_v2: resultado as object,
            segmento_diagnostico: resultado.clasificacion.segmento,
            madurez_digital: resultado.clasificacion.madurezDigital,
            perfil_riesgo: resultado.clasificacion.perfilRiesgo,
            sintomas_json: resultado.sintomas as object[],
            acciones_json: resultado.acciones as object[],
            pipeline_version: "v2",
            pipeline_duration_ms: durationMs,
          },
        })
        persisted = true

        // Sugerir servicios automáticamente según industria y dolores
        await assignSuggestedServices(
          leadId,
          parsed.data.industria,
          parsed.data.dolores_principales,
          parsed.data.urgencia,
          parsed.data.presupuesto,
        )
      } catch (e) {
        console.error("Error guardando diagnóstico en DB:", e)
      }

      if (persisted) {
        try {
          const emailStatus = await sendDiagnosticoEmailOnce(leadId, resultado)
          if (emailStatus !== "sent" && emailStatus !== "already_sent") {
            console.warn(`Diagnóstico persistido, pero correo no enviado: ${emailStatus}`)
          }
        } catch (emailError) {
          console.error("Error enviando el diagnóstico por correo:", emailError)
        }
      }
    }

    return NextResponse.json({
      ...resultado,
      pipeline_version: "v2",
      pipeline_duration_ms: durationMs,
    })
  } catch (error) {
    console.error("Error en /api/diagnostico:", error)
    return NextResponse.json(
      { error: "No pudimos completar el análisis. Intenta de nuevo." },
      { status: 500 },
    )
  }
}

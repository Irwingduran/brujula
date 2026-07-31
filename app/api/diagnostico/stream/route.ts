import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ejecutarPipelineDiagnostico } from "@/lib/diagnostico/pipeline"
import { FormularioCamposSchema } from "@/lib/diagnostico/schemas"
import { EvidenceItemSchema } from "@/lib/ai/contracts"
import { buildDiagnosticEvidence } from "@/lib/diagnostico/evidence"
import { extraerChunksDeDiagnostico } from "@/lib/rag/auto-improve"
import { sendDiagnosticoEmailOnce } from "@/lib/diagnostico/send-email"

function eventStream(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, leadId } = body

    if (!formData) {
      return NextResponse.json({ error: "formData es requerido" }, { status: 400 })
    }

    const parsed = FormularioCamposSchema.safeParse(formData)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
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

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (paso: number, total: number, descripcion: string) => {
          controller.enqueue(encoder.encode(eventStream({ tipo: "progreso", paso, total, descripcion })))
        }

        try {
          const startTime = Date.now()

          sendEvent(1, 7, "Preparando tu diagnóstico")
          const resultado = await ejecutarPipelineDiagnostico(parsed.data, sendEvent, evidence)

          const durationMs = Date.now() - startTime

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

              extraerChunksDeDiagnostico(resultado, null, leadId)
                .then((stats) =>
                  console.log(
                    `Auto-mejora: ${stats.insertados} chunks insertados de ${stats.candidatos} candidatos`,
                  ),
                )
                .catch((e) => console.warn("Auto-mejora falló (no bloqueante):", e))
            }
          }

          controller.enqueue(
            encoder.encode(
              eventStream({
                tipo: "completado",
                ...resultado,
                pipeline_version: "v2",
                pipeline_duration_ms: durationMs,
              }),
            ),
          )
        } catch (error) {
          console.error("Error en stream de diagnóstico:", error)
          controller.enqueue(
            encoder.encode(
              eventStream({
                tipo: "error",
                mensaje: "No pudimos completar el análisis. Intenta de nuevo.",
                ...(process.env.NODE_ENV === "development" && error instanceof Error
                  ? { detalle: error.message }
                  : {}),
              }),
            ),
          )
        }

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch {
    return NextResponse.json({ error: "Error iniciando el análisis" }, { status: 500 })
  }
}

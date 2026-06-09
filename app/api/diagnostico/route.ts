import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ejecutarPipelineDiagnostico } from "@/lib/diagnostico/pipeline"
import { FormularioCamposSchema } from "@/lib/diagnostico/schemas"

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

    const resultado = await ejecutarPipelineDiagnostico(parsed.data)
    const durationMs = Date.now() - (body._startTime || Date.now())

    if (leadId) {
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
      } catch (e) {
        console.error("Error guardando diagnóstico en DB:", e)
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

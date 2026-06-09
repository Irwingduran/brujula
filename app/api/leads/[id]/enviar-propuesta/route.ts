import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPropuestaEmail } from "@/lib/email"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const isV2 = lead.pipeline_version === "v2"

    let diagnostico_texto = ""
    let sintomas: { sintomaId: string; score: number; evidencia: string }[] | undefined
    let plan_accion: { paso: string; descripcion: string; urgencia: string }[] | undefined
    let score_texto: string | undefined
    let beneficios: string[] | undefined
    let servicio_titulo: string | undefined

    if (isV2 && lead.diagnostico_v2) {
      const v2 = lead.diagnostico_v2 as {
        redaccion: {
          resumen: string
          sintomasPrincipales: string[]
          planDeAccion: { paso: string; descripcion: string; urgencia: string }[]
          scoreTexto: string
        }
        sintomas: { sintomaId: string; score: number; evidencia: string }[]
        clasificacion: { madurezDigital: number }
      }

      diagnostico_texto = v2.redaccion.resumen
      sintomas = v2.sintomas
      plan_accion = v2.redaccion.planDeAccion
      score_texto = v2.redaccion.scoreTexto
    } else {
      const legacy = lead.diagnostico as {
        diagnostico_texto?: string
        descripcion?: string
        beneficios?: string[]
        titulo_servicio?: string
      } | null
      const legacyIA = lead.diagnostico_ia as {
        diagnostico_texto?: string
        beneficios?: string[]
        plan_30_60_90?: { dia_30: string; dia_60: string; dia_90: string }
      } | null

      const texto = legacyIA?.diagnostico_texto ?? legacy?.diagnostico_texto ?? legacy?.descripcion ?? ""
      diagnostico_texto = texto

      beneficios = legacyIA?.beneficios ?? legacy?.beneficios
      servicio_titulo = legacy?.titulo_servicio

      if (legacyIA?.plan_30_60_90) {
        const p = legacyIA.plan_30_60_90
        plan_accion = [
          { paso: "Primeros 30 días", descripcion: p.dia_30, urgencia: "inmediata" },
          { paso: "Siguientes 60 días", descripcion: p.dia_60, urgencia: "corto" },
          { paso: "Meta a 90 días", descripcion: p.dia_90, urgencia: "largo" },
        ]
      }
    }

    const briefing = lead.briefing_profesional as {
      propuesta_sugerida?: {
        servicio_primario?: string
        rango_precio_sugerido?: string
        roi_argumento?: string
      }
    } | null

    const nombre = lead.nombre || ""

    await sendPropuestaEmail({
      nombre,
      email: lead.email,
      id: lead.id,
      industria: lead.industria,
      tamano_empresa: lead.tamano_empresa,
      diagnostico_texto,
      sintomas,
      plan_accion,
      score_texto,
      beneficios,
      servicio_titulo,
      servicio_recomendado: briefing?.propuesta_sugerida?.servicio_primario,
      rango_precio: briefing?.propuesta_sugerida?.rango_precio_sugerido,
      roi_estimado: briefing?.propuesta_sugerida?.roi_argumento,
    })

    const ahora = new Date()
    await prisma.lead.update({
      where: { id },
      data: { propuesta_enviada_at: ahora },
    })

    return NextResponse.json({
      success: true,
      propuesta_enviada_at: ahora.toISOString(),
      email: lead.email,
    })
  } catch (error) {
    console.error("Error en enviar-propuesta:", error)
    return NextResponse.json(
      { error: "No pudimos enviar la propuesta. Intenta de nuevo." },
      { status: 500 },
    )
  }
}

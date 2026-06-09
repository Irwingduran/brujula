import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSolicitudLlamadaNotification } from "@/lib/email"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { preferencia_horaria } = body

    if (!preferencia_horaria || typeof preferencia_horaria !== "string") {
      return NextResponse.json(
        { error: "preferencia_horaria es requerida" },
        { status: 400 },
      )
    }

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    const ahora = new Date()

    await prisma.lead.update({
      where: { id },
      data: {
        llamada_agendada_at: ahora,
        notas_llamada: preferencia_horaria,
        estado_pipeline: "llamada_agendada",
      },
    })

    sendSolicitudLlamadaNotification({
      nombre: lead.nombre,
      email: lead.email,
      telefono: lead.telefono,
      industria: lead.industria,
      preferencia_horaria,
      id: lead.id,
      score_total: (lead.score as { total?: number } | null)?.total,
    }).catch((e) => console.error("Error enviando notificación de llamada:", e))

    return NextResponse.json({
      success: true,
      llamada_agendada_at: ahora.toISOString(),
    })
  } catch (error) {
    console.error("Error en solicitar-llamada:", error)
    return NextResponse.json(
      { error: "No pudimos procesar tu solicitud. Intenta de nuevo." },
      { status: 500 },
    )
  }
}

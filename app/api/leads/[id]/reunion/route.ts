import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { enlace_reunion } = body

    if (!enlace_reunion || typeof enlace_reunion !== "string") {
      return NextResponse.json(
        { error: "enlace_reunion es requerido" },
        { status: 400 },
      )
    }

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }

    await prisma.lead.update({
      where: { id },
      data: {
        enlace_reunion,
        reunion_notificado_at: null,
        estado_pipeline: lead.estado_pipeline === "wizard_completado"
          ? "llamada_agendada"
          : lead.estado_pipeline,
      },
    })

    return NextResponse.json({
      success: true,
      enlace_reunion,
    })
  } catch (error) {
    console.error("Error en /api/leads/[id]/reunion:", error)
    return NextResponse.json(
      { error: "Error al guardar el enlace de reunión" },
      { status: 500 },
    )
  }
}

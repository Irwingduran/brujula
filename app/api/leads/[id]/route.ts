import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/leads/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({ where: { id } })
    
    if (!lead) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
    }
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error al obtener lead:", error)
    return NextResponse.json({ error: "Error al obtener lead" }, { status: 500 })
  }
}

// PATCH /api/leads/[id] — Actualizar pipeline, notas o diagnostico_ia
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Whitelist of fields that can be updated via PATCH
    const allowedFields = [
      "estado_pipeline",
      "notas_freelancer",
      "llamada_agendada_at",
      "diagnostico_ia",
      "briefing_profesional",
    ] as const

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...updateData,
        ultima_actividad_at: new Date(),
      },
    })
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error al actualizar lead:", error)
    return NextResponse.json({ error: "Error al actualizar lead" }, { status: 500 })
  }
}

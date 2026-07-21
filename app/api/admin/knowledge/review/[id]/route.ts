import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { aprobado } = body

    if (typeof aprobado !== "boolean") {
      return NextResponse.json(
        { error: "Se requiere campo 'aprobado' boolean" },
        { status: 400 }
      )
    }

    // Aprobar = activar + marcar como revisado
    // Rechazar = desactivar + marcar como revisado (queda para auditoría)
    await prisma.$executeRawUnsafe(
      `UPDATE "KnowledgeChunk" SET "activo" = $1, "revisadoEn" = now() WHERE "id" = $2`,
      aprobado,
      id
    )

    return NextResponse.json({ success: true, aprobado })
  } catch (error) {
    console.error("Error reviewing chunk:", error)
    return NextResponse.json({ error: "Error al revisar chunk" }, { status: 500 })
  }
}

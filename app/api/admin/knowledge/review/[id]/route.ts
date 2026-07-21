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

    if (aprobado) {
      // Verificar feedback del lead que generó este chunk
      const chunk = await prisma.$queryRawUnsafe<{ leadId: string | null }[]>(
        `SELECT "leadId" FROM "KnowledgeChunk" WHERE "id" = $1`,
        id
      )
      const leadFeedback = chunk[0]?.leadId
        ? await prisma.$queryRawUnsafe<{ feedback_diagnostico: string | null }[]>(
            `SELECT "feedback_diagnostico" FROM "Lead" WHERE "id" = $1`,
            chunk[0].leadId
          )
        : null

      if (leadFeedback?.[0]?.feedback_diagnostico === "negativo") {
        // Rechazar automáticamente — el prospecto marcó el diagnóstico como no útil
        await prisma.$executeRawUnsafe(
          `UPDATE "KnowledgeChunk" SET "activo" = false, "revisadoEn" = now() WHERE "id" = $2`,
          false,
          id
        )
        return NextResponse.json({ success: true, aprobado: false, razon: "lead_feedback_negativo" })
      }
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

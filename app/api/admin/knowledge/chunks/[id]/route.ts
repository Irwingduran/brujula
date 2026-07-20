import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { embed, toPgVectorLiteral } from "@/lib/rag/embeddings"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { contenido, activo } = body

    // If contenido changed, re-embed
    if (contenido !== undefined) {
      const vector = await embed(contenido)
      const literal = toPgVectorLiteral(vector)
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeChunk" SET "contenido" = $1, "embedding" = $2::vector WHERE "id" = $3`,
        contenido,
        literal,
        id
      )
    }

    if (activo !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeChunk" SET "activo" = $1 WHERE "id" = $2`,
        activo,
        id
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating chunk:", error)
    return NextResponse.json({ error: "Error al actualizar chunk" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.$executeRawUnsafe(`DELETE FROM "KnowledgeChunk" WHERE "id" = $1`, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chunk:", error)
    return NextResponse.json({ error: "Error al eliminar chunk" }, { status: 500 })
  }
}

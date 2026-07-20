import { NextResponse } from "next/server"
import { retrieveKnowledgeChunks, formatAsPromptGuidance } from "@/lib/rag"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, industria, topK = 6 } = body

    if (!query || !industria) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: query, industria" },
        { status: 400 }
      )
    }

    const startTime = Date.now()
    const chunks = await retrieveKnowledgeChunks({
      query,
      industria,
      tipos: ["sintoma", "accion", "benchmark", "historia", "pregunta_guia"],
      topK,
    })
    const elapsed = Date.now() - startTime

    const promptGuidance = formatAsPromptGuidance(chunks)

    return NextResponse.json({
      chunks: chunks.map((c) => ({
        id: c.id,
        contenido: c.contenido,
        tipo: c.tipo,
        fuente: c.fuente,
        distancia: c.distancia,
        similitud: Math.round((1 - c.distancia) * 100) / 100,
      })),
      promptGuidance,
      elapsed,
      total: chunks.length,
    })
  } catch (error) {
    console.error("Error testing retrieval:", error)
    return NextResponse.json({ error: "Error al probar retrieval" }, { status: 500 })
  }
}

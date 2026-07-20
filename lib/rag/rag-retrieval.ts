import { prisma } from "@/lib/prisma"
import { embed, toPgVectorLiteral } from "./embeddings"

interface RetrievalParams {
  query: string
  industria: string
  segmento?: string | null
  tipos?: string[]
  topK?: number
}

interface ChunkResultado {
  id: string
  contenido: string
  tipo: string
  fuente: string
  distancia: number
}

export async function retrieveKnowledgeChunks({
  query,
  industria,
  segmento = null,
  tipos,
  topK = 5,
}: RetrievalParams): Promise<ChunkResultado[]> {
  const vector = await embed(query)
  const literal = toPgVectorLiteral(vector)

  const params: any[] = [industria]
  let paramIdx = 2

  let filtroSegmento = ""
  if (segmento) {
    filtroSegmento = `AND ("segmento" = $${paramIdx} OR "segmento" IS NULL)`
    params.push(segmento)
    paramIdx++
  }

  let filtroTipo = ""
  if (tipos && tipos.length > 0) {
    filtroTipo = `AND "tipo" = ANY($${paramIdx})`
    params.push(tipos)
    paramIdx++
  }

  const idxEmbedding = paramIdx
  params.push(literal)
  paramIdx++

  const idxTopK = paramIdx
  params.push(topK)

  const sql = `
    SELECT "id", "contenido", "tipo", "fuente",
           "embedding" <=> $${idxEmbedding}::vector AS distancia
    FROM "KnowledgeChunk"
    WHERE "industria" = $1
      AND "activo" = true
      ${filtroSegmento}
      ${filtroTipo}
    ORDER BY distancia ASC
    LIMIT $${idxTopK}
  `

  const rows = await prisma.$queryRawUnsafe<ChunkResultado[]>(sql, ...params)
  return rows
}

export function formatAsPromptGuidance(
  chunks: ChunkResultado[],
  opciones?: { incluirPromptGuidance?: boolean; promptGuidance?: string }
): string {
  const parts: string[] = []

  if (opciones?.incluirPromptGuidance && opciones.promptGuidance) {
    parts.push(opciones.promptGuidance)
  }

  if (chunks.length === 0) {
    return parts.join("\n\n")
  }

  const porTipo = new Map<string, ChunkResultado[]>()
  for (const chunk of chunks) {
    const existing = porTipo.get(chunk.tipo) ?? []
    existing.push(chunk)
    porTipo.set(chunk.tipo, existing)
  }

  const tipoLabels: Record<string, string> = {
    sintoma: "SÍNTOMAS DETECTADOS",
    accion: "ACCIONES RECOMENDADAS",
    benchmark: "BENCHMARKS DE LA INDUSTRIA",
    historia: "CASOS DE ÉXITO",
    pregunta_guia: "PREGUNTAS DE CONTEXTO",
  }

  for (const [tipo, items] of porTipo) {
    const label = tipoLabels[tipo] ?? tipo.toUpperCase()
    parts.push(`--- ${label} ---`)
    for (const item of items) {
      parts.push(`- ${item.contenido}`)
    }
  }

  return parts.join("\n")
}

export async function getPromptGuidance(params: RetrievalParams): Promise<string> {
  const chunks = await retrieveKnowledgeChunks(params)
  return formatAsPromptGuidance(chunks, params as any)
}

export const RETRIEVAL_CONFIG = {
  diagnostico: { topK: 8, tipos: ["sintoma", "accion", "benchmark", "historia"] },
  preguntas: { topK: 4, tipos: ["sintoma", "pregunta_guia"] },
  briefing: { topK: 6, tipos: ["sintoma", "accion", "benchmark", "historia"] },
  pipeline_sintomas: { topK: 5, tipos: ["sintoma"] },
  pipeline_acciones: { topK: 5, tipos: ["accion"] },
  pipeline_redaccion: { topK: 6, tipos: ["sintoma", "accion", "benchmark", "historia"] },
  plan_desarrollo: { topK: 5, tipos: ["accion", "benchmark"] },
} as const

export type RetrievalConfigKey = keyof typeof RETRIEVAL_CONFIG

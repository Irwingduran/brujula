import type { KnowledgePack } from "./types"
import { SERVICIOS_PROFESIONALES_PACK } from "./servicios-profesionales"
import { RETAIL_PACK } from "./retail"
import { RESTAURANTE_PACK } from "./restaurante"
import { SALUD_PACK } from "./salud"
import { INMOBILIARIA_PACK } from "./inmobiliaria"
import { LOGISTICA_PACK } from "./logistica"

const KNOWLEDGE_PACKS: Record<string, KnowledgePack> = {
  servicios_profesionales: SERVICIOS_PROFESIONALES_PACK,
  retail: RETAIL_PACK,
  restaurante: RESTAURANTE_PACK,
  salud: SALUD_PACK,
  inmobiliaria: INMOBILIARIA_PACK,
  logistica: LOGISTICA_PACK,
}

const MIN_CHUNKS_THRESHOLD = parseInt(process.env.RAG_MIN_CHUNKS || "5")

export function getKnowledgePack(industryCode: string): KnowledgePack | null {
  return KNOWLEDGE_PACKS[industryCode] ?? null
}

export function getAllKnowledgePacks(): Record<string, KnowledgePack> {
  return KNOWLEDGE_PACKS
}

export function getPromptGuidanceStatic(industryCode: string): string {
  return KNOWLEDGE_PACKS[industryCode]?.promptGuidance ?? ""
}

export function getSymptomsByIndustry(industryCode: string): KnowledgePack["symptoms"] {
  return KNOWLEDGE_PACKS[industryCode]?.symptoms ?? []
}

export function getActionsByIndustry(industryCode: string): KnowledgePack["actions"] {
  return KNOWLEDGE_PACKS[industryCode]?.actions ?? []
}

export function getIndustryBenchmarksStatic(industryCode: string): KnowledgePack["benchmarks"] {
  return KNOWLEDGE_PACKS[industryCode]?.benchmarks ?? []
}

export function getFallbackByIndustry(industryCode: string) {
  return KNOWLEDGE_PACKS[industryCode]?.fallbackDiagnosis ?? null
}

export function detectSubsector(
  industryCode: string,
  campos: { industria_otra?: string; dolores_principales: string[]; respuestas_branch?: Record<string, string> },
): string | null {
  const pack = KNOWLEDGE_PACKS[industryCode]
  if (!pack) return null

  const subsectors = pack.subsectors
  const textToCheck = [
    campos.industria_otra ?? "",
    ...campos.dolores_principales,
    ...Object.values(campos.respuestas_branch ?? {}),
  ]
    .join(" ")
    .toLowerCase()

  const subsectorKeys = Object.keys(subsectors)
  for (const key of subsectorKeys) {
    if (textToCheck.includes(key)) return key
  }

  return null
}

export async function getPromptGuidance(
  industryCode: string,
  contexto?: { query?: string; segmento?: string | null; topK?: number }
): Promise<string> {
  try {
    const { retrieveKnowledgeChunks, formatAsPromptGuidance, RETRIEVAL_CONFIG } = await import("@/lib/rag")
    const query = contexto?.query ?? `Diagnóstico para negocio de industria ${industryCode}`
    const config = contexto?.topK
      ? { topK: contexto.topK, tipos: ["sintoma", "accion", "benchmark", "historia", "pregunta_guia"] as string[] }
      : { ...RETRIEVAL_CONFIG.diagnostico, tipos: [...RETRIEVAL_CONFIG.diagnostico.tipos] }

    const chunks = await retrieveKnowledgeChunks({
      query,
      industria: industryCode,
      segmento: contexto?.segmento ?? null,
      tipos: config.tipos,
      topK: config.topK,
    })

    if (chunks.length < MIN_CHUNKS_THRESHOLD) {
      console.info(`[RAG] Cobertura insuficiente para industria=${industryCode} (${chunks.length}/${MIN_CHUNKS_THRESHOLD} chunks) — usando fallback estático`)
      return getPromptGuidanceStatic(industryCode)
    }

    console.info(`[RAG] ${chunks.length} chunks recuperados para industria=${industryCode}`)
    return formatAsPromptGuidance(chunks)
  } catch (error) {
    console.warn(`[RAG] Error en retrieval para industria=${industryCode}, usando fallback estático:`, error)
    return getPromptGuidanceStatic(industryCode)
  }
}

export async function getIndustryBenchmarks(
  industryCode: string,
  contexto?: { query?: string; segmento?: string | null }
): Promise<KnowledgePack["benchmarks"]> {
  try {
    const { retrieveKnowledgeChunks } = await import("@/lib/rag")
    const query = contexto?.query ?? `Benchmarks de la industria ${industryCode}`
    const chunks = await retrieveKnowledgeChunks({
      query,
      industria: industryCode,
      segmento: contexto?.segmento ?? null,
      tipos: ["benchmark"],
      topK: 5,
    })

    if (chunks.length < MIN_CHUNKS_THRESHOLD) {
      console.info(`[RAG] Benchmarks: cobertura insuficiente para industria=${industryCode} (${chunks.length}/${MIN_CHUNKS_THRESHOLD}) — usando fallback estático`)
      return getIndustryBenchmarksStatic(industryCode)
    }

    return chunks.map((c) => {
      const match = c.contenido.match(/^(.+?):\s*(.+?)\.\s*(.+)$/)
      if (match) {
        return { metrica: match[1], valor: match[2], descripcion: match[3] }
      }
      return { metrica: "Benchmark", valor: "", descripcion: c.contenido }
    })
  } catch (error) {
    console.warn(`[RAG] Error en benchmarks para industria=${industryCode}, usando fallback estático:`, error)
    return getIndustryBenchmarksStatic(industryCode)
  }
}

export type { KnowledgePack, KnowledgeSymptom, KnowledgeAction, MaturityDimension, IndustryBenchmark, SuccessStory } from "./types"

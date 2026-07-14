import type { KnowledgePack } from "./types"
import { SERVICIOS_PROFESIONALES_PACK } from "./servicios-profesionales"
import { RETAIL_PACK } from "./retail"

const KNOWLEDGE_PACKS: Record<string, KnowledgePack> = {
  servicios: SERVICIOS_PROFESIONALES_PACK,
  retail: RETAIL_PACK,
}

export function getKnowledgePack(industryCode: string): KnowledgePack | null {
  return KNOWLEDGE_PACKS[industryCode] ?? null
}

export function getAllKnowledgePacks(): Record<string, KnowledgePack> {
  return KNOWLEDGE_PACKS
}

export function getPromptGuidance(industryCode: string): string {
  return KNOWLEDGE_PACKS[industryCode]?.promptGuidance ?? ""
}

export function getSymptomsByIndustry(industryCode: string): KnowledgePack["symptoms"] {
  return KNOWLEDGE_PACKS[industryCode]?.symptoms ?? []
}

export function getActionsByIndustry(industryCode: string): KnowledgePack["actions"] {
  return KNOWLEDGE_PACKS[industryCode]?.actions ?? []
}

export function getIndustryBenchmarks(industryCode: string): KnowledgePack["benchmarks"] {
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

export type { KnowledgePack, KnowledgeSymptom, KnowledgeAction, MaturityDimension, IndustryBenchmark, SuccessStory } from "./types"

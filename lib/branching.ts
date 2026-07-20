import type { PainPoint, BranchConfig } from "./types"
import { BRANCH_CONFIGS } from "./constants"

const BRANCH_FIELD_LABELS: Record<string, string> = {}
for (const bc of BRANCH_CONFIGS) {
  for (const f of bc.fields) {
    BRANCH_FIELD_LABELS[f.id] = f.label
  }
}

export function getBranchFieldLabel(fieldId: string): string {
  return BRANCH_FIELD_LABELS[fieldId] ?? fieldId
}

export function getBranchOptionLabel(fieldId: string, value: string): string {
  for (const bc of BRANCH_CONFIGS) {
    for (const f of bc.fields) {
      if (f.id === fieldId && f.options) {
        const opt = f.options.find((o) => o.value === value)
        return opt?.label ?? value
      }
    }
  }
  return value
}

/**
 * Given the user's selected pain points and industry from Step 1,
 * return the relevant branching question configurations for Step 2.
 * Includes industry-specific branches first, then pain-based branches.
 * Limits to max 4 branches to keep the form manageable.
 */
export function getBranchesForPains(pains: PainPoint[], industry?: string): BranchConfig[] {
  const branches: BranchConfig[] = []

  // 1. Industry-specific branches (no pain filter, matches industry)
  if (industry) {
    for (const config of BRANCH_CONFIGS) {
      if (!config.pain && config.industries?.includes(industry)) {
        branches.push(config)
        if (branches.length >= 4) return branches
      }
    }
  }

  // 2. Pain-based branches (skip industry-specific ones)
  for (const pain of pains) {
    const config = BRANCH_CONFIGS.find(
      (b) => b.pain === pain && !b.industries
    )
    if (config) {
      branches.push(config)
      if (branches.length >= 4) break
    }
  }

  return branches
}

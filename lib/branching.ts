import type { PainPoint, BranchConfig } from "./types"
import { BRANCH_CONFIGS } from "./constants"

/**
 * Given the user's selected pain points from Step 1,
 * return the relevant branching question configurations for Step 2.
 * Limits to max 3 branches to keep the form manageable.
 */
export function getBranchesForPains(pains: PainPoint[]): BranchConfig[] {
  const branches: BranchConfig[] = []

  for (const pain of pains) {
    const config = BRANCH_CONFIGS.find((b) => b.pain === pain)
    if (config) {
      branches.push(config)
    }
    if (branches.length >= 3) break
  }

  return branches
}

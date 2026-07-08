/**
 * Twelve life stages (十二長生): where a stem stands in its growth cycle at a
 * given branch. Yang stems walk the branches forward from their 長生 anchor,
 * yin stems walk backward (data/life-stage-tables.ts).
 *
 * A chart shows two stages per pillar: the day master's stage at that pillar's
 * branch (how *you* stand there) and the pillar stem's own stage at its own
 * branch (自坐, how the pillar sits).
 */

import { GROWTH_ANCHOR, LIFE_STAGES } from "../data/life-stage-tables.js";
import { polarityOfStem } from "./attributes.js";
import { branchIndex } from "./sexagenary.js";
import type { Branch, LifeStage, Pillar, Stem } from "./types.js";

/** The life stage of `stem` at `branch`. */
export function lifeStage(stem: Stem, branch: Branch): LifeStage {
  const anchor = branchIndex(GROWTH_ANCHOR[stem]);
  const target = branchIndex(branch);
  const forward = polarityOfStem(stem) === "yang";
  const steps = forward ? target - anchor : anchor - target;
  const stage = LIFE_STAGES[((steps % 12) + 12) % 12]!;
  return { chinese: stage.chinese, english: stage.english };
}

/** Both stages a pillar displays: the day master's stage there, and the pillar's own (自坐). */
export function pillarLifeStages(dayMaster: Stem, pillar: Pillar): { dayMaster: LifeStage; self: LifeStage } {
  return {
    dayMaster: lifeStage(dayMaster, pillar.branch),
    self: lifeStage(pillar.stem, pillar.branch),
  };
}

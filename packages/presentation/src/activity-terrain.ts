/**
 * Today's terrain across all 10 almanac activities: each assessment plotted
 * as elevation (favours sit higher, friction sits lower), the same
 * favours/even/friction tone heights the 7-day elevation profile uses in
 * `elevation.ts` — just read across activities instead of days.
 */

import type { ActivityAssessment, ActivityLeaning } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";

/** Elevation (percent from the top) for each leaning — favours is higher. */
const TONE_Y: Record<ActivityLeaning, number> = {
  favors: 22,
  neutral: 50,
  friction: 78
};

export interface ActivityTerrainCell {
  key: string;
  label: string;
  classical: string;
  leaning: ActivityLeaning;
  x: number;
  y: number;
  /**
   * Which row the cell's name sits on when it is named at all: only favours
   * and friction cells are named (steady dots stay quiet — the route says the
   * rest), favours above the dot and friction below it. Two same-leaning
   * neighbours would sit on the same side ~29px apart at phone width, closer
   * than a six-letter word, so an immediate same-leaning neighbour alternates
   * onto tier 1 (a row further from the dot). Neutral cells are always 0.
   */
  labelTier: 0 | 1;
}

/** All 10 activities plotted for the terrain skyline, in canonical table order. */
export function activityTerrain(assessments: readonly ActivityAssessment[]): ActivityTerrainCell[] {
  const count = assessments.length;
  const tiers = labelTiers(assessments.map((assessment) => assessment.leaning));
  return assessments.map((assessment, index) => ({
    key: assessment.activity,
    label: ACTIVITY_LABELS[assessment.activity].label,
    classical: assessment.classical,
    leaning: assessment.leaning,
    x: ((index + 0.5) / count) * 100,
    y: TONE_Y[assessment.leaning],
    labelTier: tiers[index] ?? 0
  }));
}

/** Tier per cell: alternate whenever the previous cell shares a non-neutral leaning. */
function labelTiers(leanings: readonly ActivityLeaning[]): Array<0 | 1> {
  const tiers: Array<0 | 1> = [];
  leanings.forEach((leaning, index) => {
    const previous = leanings[index - 1];
    const previousTier = tiers[index - 1] ?? 0;
    const continuesRun = leaning !== "neutral" && previous === leaning;
    tiers.push(continuesRun ? (previousTier === 0 ? 1 : 0) : 0);
  });
  return tiers;
}

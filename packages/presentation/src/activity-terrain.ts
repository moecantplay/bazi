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
}

/** All 10 activities plotted for the terrain skyline, in canonical table order. */
export function activityTerrain(assessments: readonly ActivityAssessment[]): ActivityTerrainCell[] {
  const count = assessments.length;
  return assessments.map((assessment, index) => ({
    key: assessment.activity,
    label: ACTIVITY_LABELS[assessment.activity].label,
    classical: assessment.classical,
    leaning: assessment.leaning,
    x: ((index + 0.5) / count) * 100,
    y: TONE_Y[assessment.leaning]
  }));
}

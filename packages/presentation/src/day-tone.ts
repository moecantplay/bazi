/**
 * The at-a-glance tone for one day: the sum of every modelled activity's
 * score for the profile on that date, collapsed to a direction. Pure engine
 * math (no content layer). Kept to the ink/paper vocabulary — never a traffic
 * light.
 */

import { dayQuality } from "@daymaster/bazi-engine";
import { chartFor } from "./chart.js";
import type { StoredProfile } from "./types.js";

/** Which way a day leans overall: favoured, friction, or even. */
export type DayTone = "favoured" | "friction" | "even";

/** The summed leaning of every activity for `profile` on `dateISO`. */
export function dayTone(profile: StoredProfile, dateISO: string): DayTone {
  const zone = profile.birth.city.tz;
  const quality = dayQuality(chartFor(profile), dateISO, zone);
  const total = quality.assessments.reduce((sum, assessment) => sum + assessment.score, 0);
  if (total > 0) {
    return "favoured";
  }
  if (total < 0) {
    return "friction";
  }
  return "even";
}

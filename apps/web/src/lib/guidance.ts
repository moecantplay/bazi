/**
 * The bridge from a stored profile to the day's layered guidance (VOICE.md
 * rule 12): the almanac chip layer ("Favors" / "Watch") and the prose layer
 * that explains the day's grain. Deterministic in the daily seedKey, the same
 * one the daily reading uses, so the chips and lines never drift from it.
 */

import { dayQuality, type DayQuality } from "@daymaster/bazi-engine";
import { dayGuidance } from "@daymaster/content";
import { chartFor } from "./chart";
import type { StoredProfile } from "./profile";
import { dailySeedKey } from "./reading";

/** The content layer's guidance result shape, sourced from its own contract. */
export type DayGuidance = ReturnType<typeof dayGuidance>;
/** One almanac chip: an activity leaning "favors" or "friction" for the day. */
export type GuidanceChip = DayGuidance["chips"][number];

/** Everything the Today guidance block needs for one date, computed once. */
export interface GuidanceBundle {
  quality: DayQuality;
  chips: DayGuidance["chips"];
  lines: DayGuidance["lines"];
}

export function dayGuidanceFor(profile: StoredProfile, dateISO: string): GuidanceBundle {
  const zone = profile.birth.city.tz;
  const quality = dayQuality(chartFor(profile), dateISO, zone);
  const guidance = dayGuidance(quality, dailySeedKey(profile, dateISO));
  return { quality, chips: guidance.chips, lines: guidance.lines };
}

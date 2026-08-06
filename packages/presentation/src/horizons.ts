/**
 * The bridge from a stored profile to its year and month outlook. The
 * reading is deterministic in a seedKey built from the natal seed and the
 * two transit pillars, so the words are stable across a whole year or month
 * and only turn over when the pillar itself does.
 *
 * Ported from apps/web/src/lib/horizons.ts (M19 Phase 8 — the Cycles screen
 * needed this and no presentation phase had extracted it yet; a small
 * additive export, same shape as reading.ts's dailyBundleFor, following the
 * route-waypoints.ts precedent).
 */

import { horizonFacts, type Pillar } from "@daymaster/bazi-engine";
import { horizonReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";

/** Everything the Cycles horizon sections need for one date, computed once. */
export interface HorizonBundle {
  annualPillar: Pillar;
  monthlyPillar: Pillar;
  annual: ReadingLine[];
  monthly: ReadingLine[];
}

export function horizonBundleFor(profile: StoredProfile, dateISO: string): HorizonBundle {
  const zone = profile.birth.city.tz;
  const facts = horizonFacts(chartFor(profile), dateISO, zone);
  const annual = `${facts.annualPillar.stem}${facts.annualPillar.branch}`;
  const monthly = `${facts.monthlyPillar.stem}${facts.monthlyPillar.branch}`;
  const seedKey = `${natalSeedKey(profile)}|horizon|${annual}|${monthly}`;
  const reading = horizonReading(facts, seedKey);
  return {
    annualPillar: facts.annualPillar,
    monthlyPillar: facts.monthlyPillar,
    annual: reading.annual,
    monthly: reading.monthly
  };
}

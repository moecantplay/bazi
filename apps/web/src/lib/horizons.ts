/**
 * The bridge from a stored profile to its year (流年) and month (流月) outlook.
 * The reading is deterministic in a seedKey built from the natal seed and the
 * two transit pillars, so the words are stable across a whole year or month and
 * only turn over when the pillar itself does.
 */

import { horizonFacts, type Pillar } from "@daymaster/bazi-engine";
import { horizonReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart";
import type { StoredProfile } from "./profile";
import { natalSeedKey } from "./reading";

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

/**
 * The bridge from a stored profile to voice-compliant reading content.
 *
 * SEEDKEY CONVENTION (frozen — do not change without invalidating every reading
 * anyone has seen):
 *   natal seedKey = natalSeedKey(profile) (see seed-key.ts, the single copy)
 *   daily seedKey = natal seedKey + `|${dateISO}`   (dateISO = displayed day)
 * The content layer is deterministic in the seedKey, so the same person and the
 * same date always render the identical reading.
 */

import {
  dailyFacts,
  dailyPillar,
  natalFacts,
  type Pillar,
  type ReadingFact
} from "@daymaster/bazi-engine";
import {
  dailyReading,
  natalReading,
  type DailyReading,
  type NatalReading
} from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";

export function dailySeedKey(profile: StoredProfile, dateISO: string): string {
  return `${natalSeedKey(profile)}|${dateISO}`;
}

/** The natal reading for a profile. */
export function natalReadingFor(profile: StoredProfile): NatalReading {
  return natalReading(natalFacts(chartFor(profile)), natalSeedKey(profile));
}

/** Everything the Today screen needs for one displayed date, computed once. */
export interface DailyBundle {
  dayPillar: Pillar;
  facts: ReadingFact[];
  reading: DailyReading;
}

export function dailyBundleFor(profile: StoredProfile, dateISO: string): DailyBundle {
  const zone = profile.birth.city.tz;
  const chart = chartFor(profile);
  const facts = dailyFacts(chart, dateISO, zone);
  return {
    dayPillar: dailyPillar(dateISO, zone),
    facts,
    reading: dailyReading(facts, dailySeedKey(profile, dateISO))
  };
}

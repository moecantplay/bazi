/**
 * The bridge from a stored profile to voice-compliant reading content.
 *
 * SEEDKEY CONVENTION (frozen — do not change without invalidating every reading
 * anyone has seen):
 *   natal seedKey = natalSeedKey(profile) (see seed-key.ts, the single copy)
 *   daily seedKey = natal seedKey + `|${dateISO}`   (dateISO = displayed day)
 * Today's reading takes the two apart ({ chart: natal seedKey, date, visits })
 * so each rotating slot steps through its pool once per visit of its
 * situation (M20-21, M24-11, slot-visits.ts). The content layer is
 * deterministic in its seed, so the same person and the same date always
 * render the identical reading.
 */

import {
  dailyFacts,
  dailyPillar,
  natalFacts,
  type Pillar,
  type DayFact
} from "@daymaster/bazi-engine";
import {
  dailyReading,
  natalReading,
  type DailyReading,
  type NatalReading
} from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import { readingZoneOf } from "./reading-zone.js";
import { slotVisits, type Visits } from "./slot-visits.js";
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
  facts: DayFact[];
  reading: DailyReading;
  /** Each rotating slot's visit count for this date, shared with Today's colour. */
  visits: Visits;
}

export function dailyBundleFor(profile: StoredProfile, dateISO: string): DailyBundle {
  const zone = readingZoneOf(profile);
  const chart = chartFor(profile);
  const facts = dailyFacts(chart, dateISO, zone);
  const visits = slotVisits(profile, dateISO);
  return {
    dayPillar: dailyPillar(dateISO, zone),
    facts,
    reading: dailyReading(facts, { chart: natalSeedKey(profile), date: dateISO, visits }),
    visits
  };
}

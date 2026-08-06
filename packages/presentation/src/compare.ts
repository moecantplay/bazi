/**
 * The bridge from (stored profile, stored companion) to the comparison
 * reading. The companion's chart uses the SAME engine config as the primary
 * profile, so both charts are computed under one set of assumptions.
 *
 * SEEDKEY CONVENTION (frozen, see seed-key.ts): the natal seedKey of the
 * primary, then `||`, then the companion's birth rendered the same way.
 */

import {
  compareFacts,
  computeChart,
  DEFAULT_CONFIG,
  type Chart,
  type ChartInput,
  type CompareFact
} from "@daymaster/bazi-engine";
import { compareReading, type CompareReading } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredBirth, StoredProfile } from "./types.js";
import { zonedTimeToUtc } from "./zoned-time.js";

function companionChartInput(birth: StoredBirth, profile: StoredProfile): ChartInput {
  const zone = birth.city.tz;
  const time = birth.time ?? "12:00";
  const instant = zonedTimeToUtc(birth.date, time, zone);

  const engineConfig = birth.time ? profile.config : DEFAULT_CONFIG;
  return {
    instant,
    zone,
    sex: birth.sex,
    hourKnown: birth.time !== null,
    longitude: engineConfig.trueSolarTime ? birth.city.lng : undefined,
    config: engineConfig
  };
}

function birthSeed(birth: StoredBirth): string {
  return `${birth.date}|${birth.time ?? "unknown"}|${birth.city.tz}|${birth.sex}`;
}

/** Everything the Compare screen needs for one companion, computed once. */
export interface CompareBundle {
  companionChart: Chart;
  facts: CompareFact[];
  reading: CompareReading;
}

export function compareBundleFor(profile: StoredProfile, companion: StoredBirth): CompareBundle {
  const companionChart = computeChart(companionChartInput(companion, profile));
  const facts = compareFacts(chartFor(profile), companionChart);
  const seedKey = `${natalSeedKey(profile)}||${birthSeed(companion)}`;
  return { companionChart, facts, reading: compareReading(facts, seedKey) };
}

/**
 * TRIAL (2026-10-05 reshape trial build): view-models for Ahead, You and
 * People — the period, natal and pair facts handed to content's plain
 * readings, plus the labels each screen needs.
 */

import {
  annualPillarFacts,
  luckPillarFacts,
  monthlyPillarFactsForCalendarMonth,
  natalFacts,
  type LuckPillar
} from "@daymaster/bazi-engine";
import { pairReading, periodReading, youReading, type PlainReading, type YouReading } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { compareBundleFor } from "./compare.js";
import { readingZoneOf } from "./reading-zone.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredBirth, StoredProfile } from "./types.js";

export interface AheadPeriod {
  /** Kicker: "October", "2026", "Ages 29–38 · 2024–2033". */
  label: string;
  reading: PlainReading;
}

export interface DecadeMark {
  ages: string;
  current: boolean;
}

export interface AheadPeriods {
  month: AheadPeriod;
  year: AheadPeriod;
  /** Null before the first ten-year stretch begins. */
  decade: AheadPeriod | null;
  decades: DecadeMark[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function agesLabel(luck: LuckPillar): string {
  return `${luck.startAge}–${luck.startAge + 9}`;
}

/** This month, this year and this decade, each as one plain reading. */
export function aheadPeriodsFor(profile: StoredProfile, todayISO: string): AheadPeriods {
  const chart = chartFor(profile);
  const [year, month] = todayISO.split("-").map(Number) as [number, number];
  const monthFacts = monthlyPillarFactsForCalendarMonth(chart, year, month, readingZoneOf(profile)).facts;
  const yearFacts = annualPillarFacts(chart, year).facts;
  const current = [...chart.luckPillars].reverse().find((luck) => luck.startYear <= year) ?? null;

  return {
    month: { label: MONTH_NAMES[month - 1] ?? "", reading: periodReading(monthFacts, "month") },
    year: { label: `${year}`, reading: periodReading(yearFacts, "year") },
    decade: current
      ? {
          label: `Ages ${agesLabel(current)} · ${current.startYear}–${current.startYear + 9}`,
          reading: periodReading(luckPillarFacts(chart, current), "decade")
        }
      : null,
    decades: chart.luckPillars.map((luck) => ({ ages: agesLabel(luck), current: luck === current }))
  };
}

/** The You screen: portrait and plain cards from the natal facts. */
export function youScreenFor(profile: StoredProfile): YouReading | null {
  return youReading(natalFacts(chartFor(profile)), natalSeedKey(profile));
}

/** People: the pair reading for one saved person. */
export function pairScreenFor(profile: StoredProfile, birth: StoredBirth): PlainReading | null {
  return pairReading(compareBundleFor(profile, birth).facts);
}

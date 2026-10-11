/**
 * Ahead's seasons (M24-07): one period's plain reading, and the months of a
 * year and years of a ten-year stretch as browsable headlines. Every headline
 * comes from content's plain period reading. Single days belong to Today.
 */

import { annualPillarFacts, luckPillarFacts, monthlyPillarFactsForCalendarMonth, type LuckPillar } from "@daymaster/bazi-engine";
import { periodReading, type PlainReading } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { readingZoneOf } from "./reading-zone.js";
import type { StoredProfile } from "./types.js";

/** How a period leans: from its lead fact. */
export type Lean = "rough" | "good" | "even";

export interface PeriodView {
  /** Kicker: "October 2026", "2026", "Ages 29–38 · 2024–2033". */
  label: string;
  reading: PlainReading;
  lean: Lean;
}

export interface PeriodSummary {
  key: number;
  /** Short label: "Oct", "2027". */
  short: string;
  headline: string;
  lean: Lean;
}

export const MONTH_NAMES = [
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

const ROUGH = ["six-clash", "punishment", "harm"];
const GOOD = ["six-combine", "trine"];

/** The lean of a lead topic key such as "interaction:six-clash:month". */
function leanOf(topic: string): Lean {
  const [kind, interaction] = topic.split(":");
  if (kind !== "interaction" || interaction === undefined) {
    return "even";
  }
  if (ROUGH.includes(interaction)) {
    return "rough";
  }
  return GOOD.includes(interaction) ? "good" : "even";
}

function view(label: string, reading: PlainReading): PeriodView {
  return { label, reading, lean: leanOf(reading.lead.topic) };
}

/**
 * One month's reading, or null for a month the engine's solar-term table
 * doesn't cover (January 1900, before 立春, and December 2100, after the last
 * term): those months are never offered.
 */
export function monthView(profile: StoredProfile, year: number, month: number): PeriodView | null {
  try {
    const facts = monthlyPillarFactsForCalendarMonth(chartFor(profile), year, month, readingZoneOf(profile)).facts;
    return view(`${MONTH_NAMES[month - 1] ?? ""} ${year}`, periodReading(facts, "month"));
  } catch (error) {
    if (error instanceof RangeError) {
      return null;
    }
    throw error;
  }
}

export function yearView(profile: StoredProfile, year: number): PeriodView {
  return view(`${year}`, periodReading(annualPillarFacts(chartFor(profile), year).facts, "year"));
}

export function decadeAges(luck: LuckPillar): string {
  return `${luck.startAge}–${luck.startAge + 9}`;
}

export function decadeView(profile: StoredProfile, luck: LuckPillar): PeriodView {
  const label = `Ages ${decadeAges(luck)} · ${luck.startYear}–${luck.startYear + 9}`;
  return view(label, periodReading(luckPillarFacts(chartFor(profile), luck), "decade"));
}

/** Every ten-year stretch, and which one holds `year` (null before the first). */
export function decadesOf(profile: StoredProfile, year: number): { decades: LuckPillar[]; currentIndex: number | null } {
  const decades = chartFor(profile).luckPillars;
  let currentIndex: number | null = null;
  decades.forEach((luck, index) => {
    if (luck.startYear <= year) {
      currentIndex = index;
    }
  });
  return { decades, currentIndex };
}

/** The months of `year` the engine can read (all twelve except at its 1900 and 2100 edges), each as its headline and lean. */
export function monthsOfYear(profile: StoredProfile, year: number): PeriodSummary[] {
  return MONTH_NAMES.flatMap((name, index) => {
    const period = monthView(profile, year, index + 1);
    return period ? [{ key: index + 1, short: name.slice(0, 3), headline: period.reading.lead.headline, lean: period.lean }] : [];
  });
}

/** The last year the engine covers; a stretch running past it lists the years up to it. */
const LAST_YEAR = 2100;

/** The ten years of a stretch (fewer if it runs past 2100), each as its headline and lean. */
export function yearsOfDecade(profile: StoredProfile, luck: LuckPillar): PeriodSummary[] {
  const length = Math.max(0, Math.min(10, LAST_YEAR - luck.startYear + 1));
  return Array.from({ length }, (_, index) => {
    const year = luck.startYear + index;
    const { reading, lean } = yearView(profile, year);
    return { key: year, short: `${year}`, headline: reading.lead.headline, lean };
  });
}

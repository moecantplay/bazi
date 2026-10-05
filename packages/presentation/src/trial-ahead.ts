/**
 * TRIAL (2026-10-05 reshape trial build, R9): Ahead's view-models — one
 * period's plain reading, the months of a year and years of a ten-year
 * stretch as browsable headlines, the standout days of the next 30, and a
 * month's best and bumpiest days. Every headline comes from an existing
 * plain reading (content's period reading or Today's composed reading).
 */

import {
  annualPillarFacts,
  dayQuality,
  luckPillarFacts,
  monthlyPillarFactsForCalendarMonth,
  type LuckPillar
} from "@daymaster/bazi-engine";
import { periodReading, type PlainReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { addDays, daysBetween } from "./dates.js";
import { readingZoneOf } from "./reading-zone.js";
import { dailyBundleFor } from "./reading.js";
import { TODAY_RANGE_DAYS } from "./today-screen.js";
import type { StoredProfile } from "./types.js";

/** How a period or day leans: from its lead fact. */
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

export interface DayHeadline {
  iso: string;
  headline: ReadingLine;
  lean: Lean;
  /** Today can open this date (it reads 30 days either side of today). */
  openable: boolean;
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

export function monthView(profile: StoredProfile, year: number, month: number): PeriodView {
  const facts = monthlyPillarFactsForCalendarMonth(chartFor(profile), year, month, readingZoneOf(profile)).facts;
  return view(`${MONTH_NAMES[month - 1] ?? ""} ${year}`, periodReading(facts, "month"));
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

/** The twelve months of `year`, each as its headline and lean. */
export function monthsOfYear(profile: StoredProfile, year: number): PeriodSummary[] {
  return MONTH_NAMES.map((name, index) => {
    const { reading, lean } = monthView(profile, year, index + 1);
    return { key: index + 1, short: name.slice(0, 3), headline: reading.lead.headline, lean };
  });
}

/** The ten years of a stretch, each as its headline and lean. */
export function yearsOfDecade(profile: StoredProfile, luck: LuckPillar): PeriodSummary[] {
  return Array.from({ length: 10 }, (_, index) => {
    const year = luck.startYear + index;
    const { reading, lean } = yearView(profile, year);
    return { key: year, short: `${year}`, headline: reading.lead.headline, lean };
  });
}

function dayHeadline(profile: StoredProfile, todayISO: string, iso: string): DayHeadline {
  const { reading } = dailyBundleFor(profile, iso);
  return {
    iso,
    headline: reading.headline,
    lean: leanOf(reading.leadTopic),
    openable: Math.abs(daysBetween(todayISO, iso)) <= TODAY_RANGE_DAYS
  };
}

/** The standout days of the next `days`: up to `perLean` rough and `perLean` good, in date order. */
export function comingUp(profile: StoredProfile, todayISO: string, days = 30, perLean = 4): DayHeadline[] {
  const all = Array.from({ length: days }, (_, index) => dayHeadline(profile, todayISO, addDays(todayISO, index + 1)));
  const rough = all.filter((day) => day.lean === "rough").slice(0, perLean);
  const good = all.filter((day) => day.lean === "good").slice(0, perLean);
  return [...rough, ...good].sort((a, b) => a.iso.localeCompare(b.iso));
}

export interface BestAndBumpiest {
  best: DayHeadline[];
  bumpiest: DayHeadline[];
}

/** Lead severity, sharpest first (mirrors content's lead ranking). */
const SEVERITY: Record<string, number> = { "six-clash": 0, punishment: 1, harm: 2, "six-combine": 3, trine: 4 };

function severityOf(topic: string): number {
  return SEVERITY[topic.split(":")[1] ?? ""] ?? 5;
}

/**
 * A month's best and bumpiest days. A day's lean is what Today says about it
 * (its lead fact), so a "best day" never opens with a grinding headline: best
 * are the helpful-lead days, ranked by summed activity leaning (Find a day's
 * score); bumpiest are the grinding-lead days, sharpest lead first.
 */
export function bestAndBumpiest(profile: StoredProfile, todayISO: string, year: number, month: number, count = 3): BestAndBumpiest {
  const chart = chartFor(profile);
  const zone = readingZoneOf(profile);
  const first = `${year}-${`${month}`.padStart(2, "0")}-01`;
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days = Array.from({ length }, (_, index) => {
    const iso = addDays(first, index);
    const { reading } = dailyBundleFor(profile, iso);
    const score = dayQuality(chart, iso, zone).assessments.reduce((sum, assessment) => sum + assessment.score, 0);
    return { iso, topic: reading.leadTopic, lean: leanOf(reading.leadTopic), score };
  });
  const best = days
    .filter((day) => day.lean === "good")
    .sort((a, b) => b.score - a.score || a.iso.localeCompare(b.iso))
    .slice(0, count);
  const bumpiest = days
    .filter((day) => day.lean === "rough")
    .sort((a, b) => severityOf(a.topic) - severityOf(b.topic) || a.score - b.score || a.iso.localeCompare(b.iso))
    .slice(0, count);
  const byDate = (picked: { iso: string }[]) =>
    picked.map((day) => dayHeadline(profile, todayISO, day.iso)).sort((a, b) => a.iso.localeCompare(b.iso));
  return { best: byDate(best), bumpiest: byDate(bumpiest) };
}

/** The lean of each of the next `days` days (today first), as Today reads them. */
export function dayLeans(profile: StoredProfile, todayISO: string, days = 10): Record<string, Lean> {
  const leans: Record<string, Lean> = {};
  for (let index = 0; index < days; index += 1) {
    const iso = addDays(todayISO, index);
    leans[iso] = leanOf(dailyBundleFor(profile, iso).reading.leadTopic);
  }
  return leans;
}

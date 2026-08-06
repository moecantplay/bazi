/**
 * The Today screen's view-model: every piece of data the screen derives from
 * (profile, dateISO, todayISO) collapsed into one call, so the component only
 * destructures — no inline derivation, no repeated useMemo bookkeeping.
 *
 * Readings reach TODAY_RANGE_DAYS out from today in either direction; the date
 * strip's stepper and jump-to-date picker both clamp through
 * `clampOffsetToRange` so the same rule governs every way of moving the date.
 */

import type { Branch, Chart, Palace, Pillar } from "@daymaster/bazi-engine";
import { plainGloss, type DailyReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { addDays, daysBetween } from "./dates.js";
import { dayTone, type DayTone } from "./day-tone.js";
import { describeBranch, describeStem } from "./display.js";
import { dayGuidanceFor, type GuidanceBundle } from "./guidance.js";
import { dailyBundleFor } from "./reading.js";
import { routeWaypointsFor, type RouteWaypoint } from "./route-waypoints.js";
import type { StoredProfile } from "./types.js";

/** How many days out from today a reading may be viewed, in either direction. */
export const TODAY_RANGE_DAYS = 30;

/** Clamps a day offset from today to [-TODAY_RANGE_DAYS, TODAY_RANGE_DAYS]. */
export function clampOffsetToRange(offset: number, rangeDays: number = TODAY_RANGE_DAYS): number {
  return Math.min(rangeDays, Math.max(-rangeDays, offset));
}

export interface HeadlineRun {
  text: string;
  emphasized: boolean;
}

/**
 * Splits a headline into a plain-weight frame and one emphasis run: the
 * middle of the sentence carries the emphasis, the opening words and the
 * final word stay plain. Headlines too short to split render unemphasized.
 */
export function headlineRuns(text: string): HeadlineRun[] {
  const words = text.split(" ");
  if (words.length < 5) {
    return [{ text, emphasized: false }];
  }
  const start = Math.max(1, Math.floor(words.length * 0.4));
  const end = words.length - 1;
  return [
    { text: `${words.slice(0, start).join(" ")} `, emphasized: false },
    { text: words.slice(start, end).join(" "), emphasized: true },
    { text: ` ${words.slice(end).join(" ")}`, emphasized: false }
  ];
}

export interface TodayDateRange {
  min: string;
  max: string;
  atStart: boolean;
  atEnd: boolean;
  atBoundary: boolean;
}

export interface TodayScreenModel {
  chart: Chart;
  pillars: [Pillar, Pillar, Pillar, Pillar | null];
  dayPillar: Pillar;
  stem: ReturnType<typeof describeStem>;
  branch: ReturnType<typeof describeBranch>;
  reading: DailyReading;
  guidance: GuidanceBundle;
  tone: DayTone;
  waypoints: RouteWaypoint[];
  headline: HeadlineRun[];
  grainLine: ReadingLine | undefined;
  branchByArea: Partial<Record<Palace | "overall", Branch>>;
  dateRange: TodayDateRange;
}

/** Everything the Today screen renders for one displayed date, computed once. */
export function todayScreenModel(
  profile: StoredProfile,
  dateISO: string,
  todayISO: string
): TodayScreenModel {
  const chart = chartFor(profile);
  const bundle = dailyBundleFor(profile, dateISO);
  const guidance = dayGuidanceFor(profile, dateISO);
  const tone = dayTone(profile, dateISO);
  const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts);

  const stem = describeStem(bundle.dayPillar.stem);
  const branch = describeBranch(bundle.dayPillar.branch);
  const pillars: [Pillar, Pillar, Pillar, Pillar | null] = [
    chart.year,
    chart.month,
    chart.day,
    chart.hour
  ];
  const grainLine = bundle.reading.lines.find((line) => line.area === "overall") ?? bundle.reading.lines[0];

  const branchByArea: Partial<Record<Palace | "overall", Branch>> = {
    year: chart.year.branch,
    month: chart.month.branch,
    day: chart.day.branch,
    ...(chart.hour ? { hour: chart.hour.branch } : {}),
    overall: bundle.dayPillar.branch
  };

  const offset = daysBetween(todayISO, dateISO);
  const dateRange: TodayDateRange = {
    min: addDays(todayISO, -TODAY_RANGE_DAYS),
    max: addDays(todayISO, TODAY_RANGE_DAYS),
    atStart: offset <= -TODAY_RANGE_DAYS,
    atEnd: offset >= TODAY_RANGE_DAYS,
    atBoundary: Math.abs(offset) >= TODAY_RANGE_DAYS
  };

  return {
    chart,
    pillars,
    dayPillar: bundle.dayPillar,
    stem,
    branch,
    reading: bundle.reading,
    guidance,
    tone,
    waypoints,
    headline: headlineRuns(plainGloss(bundle.reading.headline.runs)),
    grainLine,
    branchByArea,
    dateRange
  };
}

/**
 * Date finder: score every day in a range for one activity against one or two
 * charts — the app's take on classical date selection (擇日). The combined
 * score is the minimum across charts: a shared date must work for everyone,
 * which is how a master reads a wedding date for a couple.
 */

import { DateTime } from "luxon";
import type { ActivityKey, DayOfficerDefinition } from "../data/day-officer-tables.js";
import { dayQuality, type ActivityAssessment } from "./day-quality.js";
import type { Chart, Pillar } from "./types.js";

/** Longest allowed search window: one year, inclusive. */
const MAX_RANGE_DAYS = 366;

/** One day of the range, scored for each chart. */
export interface DateCandidate {
  /** Calendar date, `YYYY-MM-DD`. */
  date: string;
  /** The day's transit pillar. */
  pillar: Pillar;
  officer: DayOfficerDefinition;
  /** The requested activity's assessment, one entry per chart, input order. */
  perChart: ActivityAssessment[];
  /** Minimum of the per-chart scores. */
  combined: number;
}

/**
 * Score each day in [start, end] (inclusive) for `activity`, best days first
 * (ties break to the earlier date). Deterministic for the same inputs.
 */
export function findDates(
  charts: Chart[],
  activity: ActivityKey,
  start: string,
  end: string,
  zone: string,
): DateCandidate[] {
  if (charts.length === 0) {
    throw new Error("findDates needs at least one chart");
  }
  const startDay = DateTime.fromISO(start, { zone });
  const endDay = DateTime.fromISO(end, { zone });
  if (!startDay.isValid || !endDay.isValid) {
    throw new Error(`Invalid date range "${start}"–"${end}" in zone "${zone}"`);
  }
  if (endDay < startDay) {
    throw new Error(`Date range ends before it starts: ${start}–${end}`);
  }
  const rangeDays = Math.round(endDay.diff(startDay, "days").days) + 1;
  if (rangeDays > MAX_RANGE_DAYS) {
    throw new Error(
      `Date range spans ${rangeDays} days; the maximum is ${MAX_RANGE_DAYS}`,
    );
  }

  const candidates: DateCandidate[] = [];
  for (let offset = 0; offset < rangeDays; offset += 1) {
    const date = startDay.plus({ days: offset }).toISODate();
    if (date === null) {
      throw new Error(`Date arithmetic failed at offset ${offset} from ${start}`);
    }
    const qualities = charts.map((chart) => dayQuality(chart, date, zone));
    const perChart = qualities.map((quality) => {
      const assessment = quality.assessments.find((entry) => entry.activity === activity);
      if (assessment === undefined) {
        throw new Error(`Unknown activity "${activity}"`);
      }
      return assessment;
    });
    const shared = qualities[0] as ReturnType<typeof dayQuality>;
    candidates.push({
      date,
      pillar: shared.pillar,
      officer: shared.officer,
      perChart,
      combined: Math.min(...perChart.map((assessment) => assessment.score)),
    });
  }

  return candidates.sort((a, b) =>
    b.combined !== a.combined ? b.combined - a.combined : a.date.localeCompare(b.date),
  );
}

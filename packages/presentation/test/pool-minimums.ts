/**
 * How big each rotating pool has to be (M24-11 R4, R5). Each slot's
 * occurrences are listed with the step it picks by, and a pool of size n
 * repeats a line within a window exactly when two occurrences inside the
 * window have steps that differ by a multiple of n, so the smallest safe n can
 * be read straight off the steps.
 *
 * - Today, over a year of dates (the visit-stepped slots repeat every 60
 *   days, and a year holds every solar month for the day-type slots): a
 *   running visit count (slot-visits.ts, whose test proves it goes up by one
 *   per occurrence), or the day number for the two slots that follow the day
 *   type; window 14 days.
 * - Ahead: the month number over ten years, window 12 months; the year over a
 *   century, window 10 years (a decade's years).
 *
 * The five reading fixtures alone miss short pools that ordinary charts hit,
 * so `POOL_CHARTS` adds sixty more: births 373 days apart from 1950, which
 * covers all sixty day pillars, a spread of years and every two-hour block.
 */

import { annualPillarFacts, dailyFacts, dailyPillar, dayQuality, monthlyPillarFactsForCalendarMonth } from "@daymaster/bazi-engine";
import { DAY_COLOUR_LINES, dailySlots, dayColourSlot, periodSlots, todaySuitsSlots, type RotationSlot } from "@daymaster/content";
import { monthNumber } from "../src/ahead-screen.js";
import { chartFor } from "../src/chart.js";
import { addDays, daysBetween } from "../src/dates.js";
import { readingZoneOf } from "../src/reading-zone.js";
import { natalSeedKey } from "../src/seed-key.js";
import { colourModeFor } from "../src/today-colour.js";
import type { StoredProfile } from "../src/types.js";
import { JAKARTA } from "./fixtures.js";

const LARGEST_POOL_TRIED = 60;

export const POOL_CHARTS: readonly StoredProfile[] = Array.from({ length: 60 }, (_, index) => ({
  birth: {
    date: addDays("1950-01-01", index * 373),
    time: `${String((index * 5) % 24).padStart(2, "0")}:30`,
    city: JAKARTA,
    sex: index % 2 === 0 ? "male" : "female"
  },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
}));

export interface PoolNeed {
  slot: string;
  poolSize: number;
  /** The smallest pool with no repeat inside the window. */
  needed: number;
  /** Whether the pool as it stands repeats a line inside the window for some fixture or pool chart. */
  repeats: boolean;
}

/** One time a slot came up: when (in the window's unit) and the step it picked by. */
interface Occurrence {
  at: number;
  step: number;
}

/** One unit of time's picks: slots that step by visit, and slots that step by `at` itself. */
interface Period {
  at: number;
  visitSlots: RotationSlot[];
  stepSlots: RotationSlot[];
}

function collides(occurrences: readonly Occurrence[], size: number, window: number): boolean {
  for (let first = 0; first < occurrences.length; first += 1) {
    for (let second = first + 1; second < occurrences.length; second += 1) {
      const a = occurrences[first]!;
      const b = occurrences[second]!;
      if (b.at - a.at >= window) {
        break;
      }
      if ((b.step - a.step) % size === 0) {
        return true;
      }
    }
  }
  return false;
}

/** Every slot the fixtures use, its pool size, and the smallest pool that never repeats inside the window for any of them. */
function needsFrom(periodsPerFixture: readonly Period[][], window: number): PoolNeed[] {
  const sizes = new Map<string, number>();
  const runsBySlot = new Map<string, Occurrence[][]>();
  for (const periods of periodsPerFixture) {
    const bySlot = new Map<string, Occurrence[]>();
    const add = ({ slot, poolSize }: RotationSlot, at: number, byVisit: boolean): void => {
      sizes.set(slot, poolSize);
      const occurrences = bySlot.get(slot) ?? [];
      occurrences.push({ at, step: byVisit ? occurrences.length : at });
      bySlot.set(slot, occurrences);
    };
    for (const { at, visitSlots, stepSlots } of periods) {
      visitSlots.forEach((entry) => add(entry, at, true));
      stepSlots.forEach((entry) => add(entry, at, false));
    }
    for (const [slot, occurrences] of bySlot) {
      runsBySlot.set(slot, [...(runsBySlot.get(slot) ?? []), occurrences]);
    }
  }
  return [...sizes].sort(([a], [b]) => (a < b ? -1 : 1)).map(([slot, poolSize]) => {
    const runs = runsBySlot.get(slot) ?? [];
    let needed = 1;
    while (needed < LARGEST_POOL_TRIED && runs.some((occurrences) => collides(occurrences, needed, window))) {
      needed += 1;
    }
    return { slot, poolSize, needed, repeats: runs.some((occurrences) => collides(occurrences, poolSize, window)) };
  });
}

function todayPeriods(profile: StoredProfile): Period[] {
  const chart = chartFor(profile);
  const zone = readingZoneOf(profile);
  const chartSeed = natalSeedKey(profile);
  return Array.from({ length: 365 }, (_, index) => {
    const date = addDays("2026-01-01", index);
    const mode = colourModeFor(profile, dailyPillar(date, zone).stem);
    const visitSlots = dailySlots(dailyFacts(chart, date, zone), chartSeed);
    if (mode !== null) {
      visitSlots.push({ slot: dayColourSlot(mode), poolSize: DAY_COLOUR_LINES[mode].length });
    }
    return { at: daysBetween("1970-01-01", date), visitSlots, stepSlots: todaySuitsSlots(dayQuality(chart, date, zone)) };
  });
}

/** Today's pools: no line back within 14 days. */
export function todayPoolNeeds(profiles: readonly StoredProfile[]): PoolNeed[] {
  return needsFrom(profiles.map(todayPeriods), 14);
}

/** Ahead's pools: no line twice within 12 consecutive months, or within a decade's years. */
export function aheadPoolNeeds(profiles: readonly StoredProfile[]): PoolNeed[] {
  const months = profiles.map((profile) => {
    const chart = chartFor(profile);
    const zone = readingZoneOf(profile);
    return Array.from({ length: 120 }, (_, index): Period => {
      const year = 2026 + Math.floor(index / 12);
      const month = (index % 12) + 1;
      const facts = monthlyPillarFactsForCalendarMonth(chart, year, month, zone).facts;
      return { at: monthNumber(year, month), visitSlots: [], stepSlots: periodSlots(facts, "month") };
    });
  });
  const years = profiles.map((profile) =>
    Array.from({ length: 100 }, (_, index): Period => {
      const year = 2000 + index;
      return { at: year, visitSlots: [], stepSlots: periodSlots(annualPillarFacts(chartFor(profile), year).facts, "year") };
    }),
  );
  return [...needsFrom(months, 12), ...needsFrom(years, 10)];
}

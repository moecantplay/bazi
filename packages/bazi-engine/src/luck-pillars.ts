/**
 * Luck pillars (大运): the sequence of 10-year periods a life passes through.
 *
 * Direction of travel depends on the year-stem polarity and sex; the starting
 * age is set by the distance from birth to the bounding jié.
 */

import { DateTime } from "luxon";
import { polarityOfStem } from "./attributes.js";
import { pillarToSexagenaryIndex, sexagenaryPillar } from "./sexagenary.js";
import { findGoverningTerm, findNextTerm } from "./solar-terms.js";
import type { LuckPillar, Pillar, Sex, Stem } from "./types.js";

const MS_PER_DAY = 86_400_000;
const LUCK_PILLAR_COUNT = 8;
const YEARS_PER_PILLAR = 10;

export interface LuckPillarInput {
  instant: Date;
  zone: string;
  /** Year-stem of the natal chart (drives direction with sex). */
  yearStem: Stem;
  /** The natal month pillar; the sequence steps from here (exclusive). */
  monthPillar: Pillar;
  sex: Sex;
}

/**
 * Forward when a yang-year male or a yin-year female; otherwise backward.
 * Forward walks the sexagenary cycle up from the month pillar toward the next
 * jié; backward walks down toward the previous jié.
 */
function isForward(yearStem: Stem, sex: Sex): boolean {
  const yang = polarityOfStem(yearStem) === "yang";
  return (yang && sex === "male") || (!yang && sex === "female");
}

/**
 * Convert the day-gap to the bounding jié into whole months.
 *
 * Rule: 3 days = 1 year, so 1 day = 4 months; months = round(days × 4). This is
 * one common school's rounding (brief §4.9). startAge = floor(months / 12), and
 * each later pillar begins 120 months (10 years) after the one before.
 */
function monthsFromGap(gapDays: number): number {
  return Math.round(gapDays * 4);
}

export function luckPillars(input: LuckPillarInput): LuckPillar[] {
  const { instant, zone, yearStem, monthPillar, sex } = input;
  const forward = isForward(yearStem, sex);
  const step = forward ? 1 : -1;

  const boundary = forward ? findNextTerm(instant) : findGoverningTerm(instant);
  const gapDays = Math.abs(Date.parse(boundary.iso) - instant.getTime()) / MS_PER_DAY;
  const totalMonths = monthsFromGap(gapDays);

  const startAge = Math.floor(totalMonths / 12);
  // The pillar takes effect at the calendar year of birth + the accrued months.
  const effectiveStart = DateTime.fromJSDate(instant, { zone }).plus({ months: totalMonths });
  const startYear = effectiveStart.year;

  const monthIndex = pillarToSexagenaryIndex(monthPillar);
  const pillars: LuckPillar[] = [];
  for (let i = 0; i < LUCK_PILLAR_COUNT; i += 1) {
    pillars.push({
      pillar: sexagenaryPillar(monthIndex + step * (i + 1)),
      startAge: startAge + YEARS_PER_PILLAR * i,
      startYear: startYear + YEARS_PER_PILLAR * i,
    });
  }
  return pillars;
}

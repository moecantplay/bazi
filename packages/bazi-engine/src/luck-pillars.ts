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
import type { LuckPillar, LuckStart, Pillar, Sex, Stem } from "./types.js";

const MS_PER_HOUR = 3_600_000;
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
 * Exact offset from birth to the first luck pillar (起運).
 *
 * Rule (brief §4.9 school, extended to full precision): the gap from birth to
 * the bounding jié converts at 3 days = 1 year, hence 6 hours = 1 month and
 * 1 hour = 5 days (one 時辰 = 10 days). Each unit floors before the next
 * converts, matching how professional charting apps state "9年5個月25天".
 */
export function luckStart(input: LuckPillarInput): LuckStart {
  const { instant, zone, yearStem, sex } = input;
  const forward = isForward(yearStem, sex);
  const boundary = forward ? findNextTerm(instant) : findGoverningTerm(instant);
  const gapHours = Math.abs(Date.parse(boundary.iso) - instant.getTime()) / MS_PER_HOUR;

  const years = Math.floor(gapHours / 72);
  const afterYears = gapHours - years * 72;
  const months = Math.floor(afterYears / 6);
  const days = Math.floor((afterYears - months * 6) * 5);

  const startISO = DateTime.fromJSDate(instant, { zone })
    .plus({ years, months, days })
    .toISODate();
  if (startISO === null) {
    throw new RangeError("luckStart: birth instant is outside the representable range");
  }
  return { years, months, days, startISO };
}

export function luckPillars(input: LuckPillarInput): LuckPillar[] {
  const { zone, yearStem, monthPillar, sex } = input;
  const forward = isForward(yearStem, sex);
  const step = forward ? 1 : -1;

  const start = luckStart(input);
  // Western age at the moment the first pillar takes effect.
  const startAge = start.years;
  const startYear = DateTime.fromISO(start.startISO, { zone }).year;

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

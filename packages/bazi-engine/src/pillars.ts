/**
 * The four pillars (四柱): year, month, day, and hour.
 *
 * Inputs are an absolute UTC instant (a JS `Date`) plus an IANA timezone string.
 * The instant is the ground truth; the timezone says how to read it as local
 * civil time. All functions are pure and deterministic.
 */

import { DateTime } from "luxon";
import { FIVE_RATS, FIVE_TIGERS, JIE_BY_NAME } from "../data/tables.js";
import { branchAt, sexagenaryPillar, stemAt, stemIndex } from "./sexagenary.js";
import { findGoverningTerm, findSolarYear } from "./solar-terms.js";
import { applyTrueSolarTime } from "./true-solar-time.js";
import { DEFAULT_CONFIG, type EngineConfig, type Pillar, type Stem } from "./types.js";

/**
 * Sexagenary anchor for the solar year: the 立春-bounded year of 1984 is 甲子
 * (index 0). This is standard 60-cycle arithmetic, not an invented constant.
 */
const YEAR_ANCHOR = 1984;

/** Sexagenary anchor for the day cycle: 1949-10-01 (local civil date) is 甲子. */
const DAY_ANCHOR = DateTime.utc(1949, 10, 1);

/**
 * Supported year range, matching the embedded solar-term table (1900–2100).
 * `annualPillar`/`dailyPillar` compute from pure cycle arithmetic and would
 * otherwise silently extrapolate past the table, so they enforce this window to
 * stay consistent with the table-backed pillar functions.
 */
const MIN_SUPPORTED_YEAR = 1900;
const MAX_SUPPORTED_YEAR = 2100;

function assertSupportedYear(year: number): void {
  if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
    throw new RangeError(
      `Year ${year} is outside the supported range ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}`,
    );
  }
}

/** Read `instant` as local civil time in `zone`, throwing on an invalid zone. */
function zonedTime(instant: Date, zone: string): DateTime {
  const zoned = DateTime.fromJSDate(instant, { zone });
  if (!zoned.isValid) {
    throw new Error(`Invalid timezone "${zone}": ${zoned.invalidReason ?? "unknown"}`);
  }
  return zoned;
}

/** Ensure a longitude was supplied when true solar time is requested. */
function requireLongitude(longitude: number | undefined): number {
  if (longitude === undefined) {
    throw new Error("trueSolarTime requires a longitude");
  }
  return longitude;
}

/** Apply the true-solar-time shift when the config requests it. */
function effectiveInstant(
  instant: Date,
  zone: string,
  config: EngineConfig,
  longitude: number | undefined,
): Date {
  if (!config.trueSolarTime) {
    return instant;
  }
  return applyTrueSolarTime(instant, zone, requireLongitude(longitude));
}

/** The stem of a solar year, from its sexagenary position. */
function yearStemOf(solarYear: number): Stem {
  return stemAt(solarYear - YEAR_ANCHOR);
}

/**
 * Year pillar. The year boundary is the exact instant of 立春 (not 1 January,
 * not Chinese New Year). Verified against 1994 = 甲戌.
 */
export function yearPillar(instant: Date, zone: string): Pillar {
  zonedTime(instant, zone); // validate the zone; the boundary itself is absolute
  const solarYear = findSolarYear(instant);
  return sexagenaryPillar(solarYear - YEAR_ANCHOR);
}

/**
 * Month pillar. The month is the interval between consecutive jié: the branch
 * comes from the governing jié (立春 opens 寅), and the stem comes from the Five
 * Tigers rule keyed on the year stem, advanced by the month's ordinal.
 */
export function monthPillar(instant: Date, zone: string): Pillar {
  zonedTime(instant, zone); // validate the zone; jié boundaries are absolute
  const solarYear = findSolarYear(instant);
  const term = findGoverningTerm(instant);
  const jie = JIE_BY_NAME[term.name];
  if (jie === undefined) {
    throw new Error(`Unknown solar term "${term.name}"`);
  }
  const tigerStem = FIVE_TIGERS[yearStemOf(solarYear)];
  return {
    stem: stemAt(stemIndex(tigerStem) + jie.monthOrdinal),
    branch: jie.branch,
  };
}

/**
 * Day pillar. A continuous 60-day cycle anchored at 1949-10-01 = 甲子. The day
 * flips at local midnight; under `lateZiHour: "shift-day"` a 23:00–23:59:59
 * birth takes the next day's pillar instead.
 */
export function dayPillar(
  instant: Date,
  zone: string,
  config: EngineConfig = DEFAULT_CONFIG,
  longitude?: number,
): Pillar {
  const zoned = zonedTime(
    effectiveInstant(instant, zone, config, longitude),
    zone,
  );
  let civilDate = DateTime.utc(zoned.year, zoned.month, zoned.day);
  if (config.lateZiHour === "shift-day" && zoned.hour === 23) {
    civilDate = civilDate.plus({ days: 1 });
  }
  const dayIndex = Math.round(civilDate.diff(DAY_ANCHOR, "days").days);
  return sexagenaryPillar(dayIndex);
}

/**
 * Hour pillar. The 2-hour branch runs 23:00–01:00 = 子, 01:00–03:00 = 丑, …. The
 * stem comes from the Five Rats rule keyed on the supplied day stem (the caller
 * chooses which day stem applies under late-zi rules), advanced by the slot.
 */
export function hourPillar(
  instant: Date,
  zone: string,
  dayStem: Stem,
  config: EngineConfig = DEFAULT_CONFIG,
  longitude?: number,
): Pillar {
  const zoned = zonedTime(
    effectiveInstant(instant, zone, config, longitude),
    zone,
  );
  const slot = Math.floor((zoned.hour + 1) / 2) % 12;
  return {
    stem: stemAt(stemIndex(FIVE_RATS[dayStem]) + slot),
    branch: branchAt(slot),
  };
}

/**
 * The sexagenary pillar of a Gregorian year (立春-based year identity), e.g.
 * `annualPillar(2026)` = 丙午. Used for annual (流年) pillars.
 */
export function annualPillar(year: number): Pillar {
  assertSupportedYear(year);
  return sexagenaryPillar(year - YEAR_ANCHOR);
}

/**
 * The day pillar for a calendar date (`YYYY-MM-DD`) under the midnight rule.
 * Used for daily (流日) pillars.
 */
export function dailyPillar(date: string, zone: string): Pillar {
  const noon = DateTime.fromISO(date, { zone }).set({ hour: 12 });
  if (!noon.isValid) {
    throw new Error(`Invalid date "${date}" or zone "${zone}": ${noon.invalidReason ?? "unknown"}`);
  }
  assertSupportedYear(noon.year);
  return dayPillar(noon.toJSDate(), zone);
}

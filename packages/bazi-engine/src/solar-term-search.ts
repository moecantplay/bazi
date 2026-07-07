/**
 * Computation of the 12 jié (month-boundary solar terms) via astronomy-engine.
 *
 * A jié is the instant the sun's apparent ecliptic longitude reaches a fixed
 * target (立春 = 315°, then every 30°). This module is pure and importable so it
 * can be unit-tested and driven by the generator script. The runtime engine
 * does NOT call it: it reads the pre-computed `data/solar-terms.json` instead.
 */

import { createRequire } from "node:module";
import { JIE } from "../data/tables.js";
import type { SolarTermEntry } from "./types.js";

// astronomy-engine ships both an ESM and a CJS build; test runner (vite) and
// script runner (tsx) resolve them inconsistently. Loading the CJS build via
// createRequire is deterministic across both, while `typeof import(...)` keeps
// the named exports fully typed.
const astronomy = createRequire(import.meta.url)(
  "astronomy-engine",
) as typeof import("astronomy-engine");

/** Days to allow SearchSunLongitude to scan forward before giving up. */
const SEARCH_LIMIT_DAYS = 370;

/**
 * The instant, as an ISO-8601 UTC string, at which the sun next reaches
 * `longitude` at or after `start`.
 */
export function solarLongitudeInstant(longitude: number, start: Date): string {
  const time = astronomy.SearchSunLongitude(longitude, start, SEARCH_LIMIT_DAYS);
  if (time === null) {
    throw new Error(
      `Sun longitude ${longitude}° not found within ${SEARCH_LIMIT_DAYS} days of ${start.toISOString()}`,
    );
  }
  return time.date.toISOString();
}

/**
 * The 12 jié occurring within Gregorian calendar year `year`, sorted by instant
 * (calendar order: 小寒 in early January through 大雪 in December). Each target
 * ecliptic longitude occurs exactly once per tropical year, so searching from
 * 1 January finds that year's occurrence for every term.
 */
export function solarTermsForYear(year: number): SolarTermEntry[] {
  const start = new Date(Date.UTC(year, 0, 1));
  const entries = JIE.map((jie): SolarTermEntry => ({
    name: jie.name,
    longitude: jie.longitude,
    iso: solarLongitudeInstant(jie.longitude, start),
  }));
  entries.sort((a, b) => Date.parse(a.iso) - Date.parse(b.iso));
  return entries;
}

/**
 * All jié across an inclusive range of Gregorian years, in strictly increasing
 * instant order.
 */
export function solarTermsForRange(
  startYear: number,
  endYear: number,
): SolarTermEntry[] {
  const all: SolarTermEntry[] = [];
  for (let year = startYear; year <= endYear; year += 1) {
    all.push(...solarTermsForYear(year));
  }
  return all;
}

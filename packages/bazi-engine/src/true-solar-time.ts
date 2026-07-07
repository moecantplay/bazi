/**
 * Apparent (true) solar time adjustment.
 *
 * Civil clock time differs from the sun's actual position by two effects:
 *  1. Longitude offset — the birth location sits east/west of its timezone's
 *     reference meridian; the sun crosses the local meridian 4 minutes earlier
 *     per degree of eastward longitude.
 *  2. Equation of time — the difference between apparent and mean solar time,
 *     caused by Earth's orbital eccentricity and axial tilt (±~16 minutes).
 *
 * When enabled, day/hour boundaries are binned by apparent solar time.
 */

import { createRequire } from "node:module";
import { DateTime } from "luxon";

// See solar-term-search.ts: load the CJS build via createRequire so the module
// resolves identically under vite (tests) and tsx (scripts), while staying typed.
const astronomy = createRequire(import.meta.url)(
  "astronomy-engine",
) as typeof import("astronomy-engine");

/** Minutes of civil time per degree of longitude (24 h / 360°). */
const MINUTES_PER_DEGREE = 4;

/** Degrees of longitude spanned by one hour of timezone offset. */
const DEGREES_PER_OFFSET_HOUR = 15;

const observerAtOrigin = new astronomy.Observer(0, 0, 0);

/**
 * Julian centuries since J2000.0 for a given instant.
 * Definitional constants — Meeus, Astronomical Algorithms, ch. 7: Unix epoch =
 * JD 2440587.5, J2000.0 = JD 2451545.0, one Julian century = 36525 days.
 */
function julianCenturies(instant: Date): number {
  const julianDay = instant.getTime() / 86_400_000 + 2_440_587.5;
  return (julianDay - 2_451_545.0) / 36_525.0;
}

/**
 * The sun's geometric mean longitude (degrees, 0–360).
 *
 * astronomy-engine exposes the sun's apparent right ascension but not its mean
 * longitude, so the mean-time reference is computed from the standard published
 * polynomial. Source: Meeus, Astronomical Algorithms, ch. 25.
 */
function sunMeanLongitude(instant: Date): number {
  const t = julianCenturies(instant);
  const longitude = 280.46646 + 36_000.76983 * t + 0.0003032 * t * t;
  return ((longitude % 360) + 360) % 360;
}

/** Normalize an angle in degrees to the range (−180, 180]. */
function normalizeSignedDegrees(degrees: number): number {
  return (((degrees + 180) % 360) + 360) % 360 - 180;
}

/**
 * The equation of time at `instant`, in minutes (apparent − mean solar time).
 * Positive means a sundial reads ahead of the mean-time clock.
 */
export function equationOfTimeMinutes(instant: Date): number {
  const meanLongitude = sunMeanLongitude(instant);
  const apparent = astronomy.Equator(
    astronomy.Body.Sun,
    instant,
    observerAtOrigin,
    true,
    true,
  );
  const apparentLongitude = apparent.ra * DEGREES_PER_OFFSET_HOUR; // RA hours → degrees
  const difference = normalizeSignedDegrees(meanLongitude - apparentLongitude);
  return difference * MINUTES_PER_DEGREE;
}

/**
 * Shift a UTC instant so that reading it in `zone` yields apparent solar time
 * at the given `longitude` (degrees, east positive).
 */
export function applyTrueSolarTime(
  instant: Date,
  zone: string,
  longitude: number,
): Date {
  const offsetHours = DateTime.fromJSDate(instant, { zone }).offset / 60;
  const referenceMeridian = offsetHours * DEGREES_PER_OFFSET_HOUR;
  const longitudeCorrection = (longitude - referenceMeridian) * MINUTES_PER_DEGREE;
  const totalMinutes = longitudeCorrection + equationOfTimeMinutes(instant);
  return new Date(instant.getTime() + totalMinutes * 60_000);
}

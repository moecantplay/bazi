/**
 * Compute a chart's pillars from a stored profile, wrapping the frozen engine
 * API so screens never assemble instants or configs themselves.
 */

import {
  DEFAULT_CONFIG,
  dayPillar,
  hourPillar,
  monthPillar,
  yearPillar,
  type EngineConfig,
  type Pillar
} from "@daymaster/bazi-engine";
import type { StoredBirth, StoredConfig } from "./profile";
import { zonedTimeToUtc } from "./zoned-time";

export const MIN_BIRTH_YEAR = 1900;
export const MAX_BIRTH_YEAR = 2100;

export interface ChartPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  /** Null when the birth time is unknown; no hour pillar may be shown. */
  hour: Pillar | null;
}

/** True when `date` (YYYY-MM-DD) names a year the engine tables support. */
export function isYearInRange(date: string): boolean {
  const year = Number(date.slice(0, 4));
  return year >= MIN_BIRTH_YEAR && year <= MAX_BIRTH_YEAR;
}

function toEngineConfig(config: StoredConfig): EngineConfig {
  return {
    lateZiHour: config.lateZiHour,
    trueSolarTime: config.trueSolarTime
  };
}

/**
 * Derive the year/month/day (and hour, when known) pillars for a birth.
 *
 * Unknown birth times use local noon as the instant: noon sits far from every
 * day and hour boundary, so year/month/day come out unambiguous while no hour
 * pillar is ever produced. True solar time shifts day/hour boundaries by the
 * birthplace longitude; year and month follow the absolute solar terms and are
 * unaffected, matching the engine's own contract.
 */
export function computePillars(birth: StoredBirth, config: StoredConfig): ChartPillars {
  const zone = birth.city.tz;
  const time = birth.time ?? "12:00";
  const instant = zonedTimeToUtc(birth.date, time, zone);

  const engineConfig = birth.time ? toEngineConfig(config) : DEFAULT_CONFIG;
  const longitude = engineConfig.trueSolarTime ? birth.city.lng : undefined;

  const year = yearPillar(instant, zone);
  const month = monthPillar(instant, zone);
  const day = dayPillar(instant, zone, engineConfig, longitude);
  const hour = birth.time
    ? hourPillar(instant, zone, day.stem, engineConfig, longitude)
    : null;

  return { year, month, day, hour };
}

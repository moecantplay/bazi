/**
 * The canonical chart for a stored profile. Every screen that needs derived
 * chart data (pillars, luck cycles, later the reading) reads it through here so
 * the engine is invoked one consistent way and the result is memoized.
 *
 * The ChartInput mirrors lib/pillars.ts exactly: an unknown birth time uses
 * local noon and default engine settings (noon sits far from every day/hour
 * boundary), true solar time supplies the birthplace longitude, and year/month
 * follow the absolute solar terms regardless.
 */

import {
  DEFAULT_CONFIG,
  computeChart,
  type Chart,
  type ChartInput
} from "@daymaster/bazi-engine";
import type { StoredProfile } from "./profile";
import { zonedTimeToUtc } from "./zoned-time";

function chartInputFor(profile: StoredProfile): ChartInput {
  const { birth, config } = profile;
  const zone = birth.city.tz;
  const time = birth.time ?? "12:00";
  const instant = zonedTimeToUtc(birth.date, time, zone);

  const engineConfig = birth.time ? config : DEFAULT_CONFIG;
  return {
    instant,
    zone,
    sex: birth.sex,
    hourKnown: birth.time !== null,
    longitude: engineConfig.trueSolarTime ? birth.city.lng : undefined,
    config: engineConfig
  };
}

let cache: { key: string; chart: Chart } | null = null;

/** The derived chart for `profile`, memoized on its birth details and config. */
export function chartFor(profile: StoredProfile): Chart {
  const key = JSON.stringify({ birth: profile.birth, config: profile.config });
  if (cache && cache.key === key) {
    return cache.chart;
  }
  const chart = computeChart(chartInputFor(profile));
  cache = { key, chart };
  return chart;
}

/**
 * @daymaster/presentation — pure TS view-models extracted from apps/web.
 *
 * Framework-agnostic (no React, no DOM/localStorage access at runtime): shapes
 * and derives data already computed by bazi-engine and content for display.
 */

export const PRESENTATION_VERSION = "0.1.0";

export type {
  Sex,
  LateZiHour,
  StoredCity,
  StoredBirth,
  StoredConfig,
  StoredProfile,
  StoredPerson
} from "./types.js";

export { fnv1a, createSeededRandom } from "./hash.js";
export { todayLabel, addDays, daysBetween, formatLong, dayProgress } from "./dates.js";
export { zonedTimeToUtc } from "./zoned-time.js";
export { ELEMENT_SWATCH_CLASS, ELEMENT_LABEL, ELEMENT_ORDER } from "./elements.js";
export { describeStem, describeBranch, palaceWord } from "./display.js";
export { streakLine } from "./streak.js";

export {
  computePillars,
  isYearInRange,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR
} from "./pillars.js";
export type { ChartPillars } from "./pillars.js";

export { chartFor, chartForBirth } from "./chart.js";
export { dayTone } from "./day-tone.js";
export type { DayTone } from "./day-tone.js";
export { dayTerrain } from "./terrain.js";
export { natalSeedKey } from "./seed-key.js";
export { compareBundleFor } from "./compare.js";
export type { CompareBundle } from "./compare.js";
export {
  findDatesFor,
  dateFinderChartLabels,
  dateFinderVerdictSeedBase,
  LEANING_TINT,
  LEANING_WORD,
  MIN_DATE,
  MAX_DATE
} from "./date-finder.js";
export type { DateSearch } from "./date-finder.js";

export { ANIMAL_ICON_PATHS } from "./animal-icon-paths.js";
export type { AnimalIconPath } from "./animal-icon-paths.js";
export { ELEMENT_ICON_PATHS } from "./glyph-icon-paths.js";
export type { ElementIconPaths, IconPrimitive } from "./glyph-icon-paths.js";

export { dailySeedKey, natalReadingFor, dailyBundleFor } from "./reading.js";
export type { DailyBundle } from "./reading.js";
export { dayGuidanceFor } from "./guidance.js";
export type { DayGuidance, GuidanceChip, GuidanceBundle } from "./guidance.js";
export { routeWaypointsFor } from "./route-waypoints.js";
export type { RouteWaypoint } from "./route-waypoints.js";
export {
  todayScreenModel,
  headlineRuns,
  clampOffsetToRange,
  TODAY_RANGE_DAYS
} from "./today-screen.js";
export type { TodayScreenModel, TodayDateRange, HeadlineRun } from "./today-screen.js";
export { elevationWeek, elevationPath, ELEVATION_WEEK_LENGTH } from "./elevation.js";
export type { ElevationCell } from "./elevation.js";
export { activityTerrain } from "./activity-terrain.js";
export type { ActivityTerrainCell } from "./activity-terrain.js";
export { luckPillarReadingsFor } from "./luck-reading.js";
export type { LuckPillarReading } from "./luck-reading.js";
export { annualReadingFor, monthlyReadingFor } from "./cycle-reading.js";
export type { AnnualCycleReading, MonthlyCycleReading } from "./cycle-reading.js";
export { chartPreviewFor } from "./chart-preview.js";
export type { ChartPreviewResult } from "./chart-preview.js";
export { starsForPalace } from "./pillar-stars.js";
export { mapHeroSummary } from "./map-hero.js";
export type { MapHeroSummary } from "./map-hero.js";
export { guidanceBoardFor, groupGuidanceByFactTag } from "./guidance-board.js";
export type { GuidanceBoard } from "./guidance-board.js";
export { renderRun } from "./render-run.js";
export type { RenderedRun } from "./render-run.js";

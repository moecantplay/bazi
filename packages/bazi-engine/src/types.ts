/**
 * Core value types for the Daymaster BaZi engine.
 *
 * A BaZi chart is built from Heavenly Stems (天干) and Earthly Branches (地支).
 * M1 covers only these primitive types plus the pillar they combine into;
 * derived chart-level types (hidden stems, ten gods, luck pillars) arrive in M2.
 */

/** The ten Heavenly Stems (天干), in canonical order 甲…癸. */
export type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

/** The twelve Earthly Branches (地支), in canonical order 子…亥. */
export type Branch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

/** The five Chinese elements (五行). */
export type Element = "wood" | "fire" | "earth" | "metal" | "water";

/** Yin/Yang polarity (阴阳). */
export type Polarity = "yang" | "yin";

/** A single pillar (柱): one stem paired with one branch. */
export interface Pillar {
  stem: Stem;
  branch: Branch;
}

/**
 * How to treat a birth in the "late zi" hour (23:00–23:59:59 local).
 * - `"midnight"`: the day pillar flips at local midnight (the zi hour that
 *   begins at 23:00 still belongs to the current civil day).
 * - `"shift-day"`: a 23:00–23:59:59 birth is assigned the NEXT day's pillar.
 */
export type LateZiHour = "midnight" | "shift-day";

/** Engine configuration knobs affecting day/hour boundaries. */
export interface EngineConfig {
  lateZiHour: LateZiHour;
  /**
   * When true, day/hour boundaries use apparent solar time at the birth
   * location (longitude correction + equation of time) instead of civil
   * clock time. Requires a longitude to be supplied to day/hour functions.
   */
  trueSolarTime: boolean;
}

/** Default engine configuration: civil midnight boundary, no true solar time. */
export const DEFAULT_CONFIG: EngineConfig = {
  lateZiHour: "midnight",
  trueSolarTime: false,
};

/** One month-boundary solar term (jié) instant embedded in the data table. */
export interface SolarTermEntry {
  /** Term name, e.g. 立春. */
  name: string;
  /** Target apparent ecliptic longitude of the sun, in degrees. */
  longitude: number;
  /** Exact instant of the term as an ISO-8601 UTC timestamp. */
  iso: string;
}

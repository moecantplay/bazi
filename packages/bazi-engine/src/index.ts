/**
 * @daymaster/bazi-engine — Milestone M1 public API.
 *
 * Deterministic BaZi four-pillar computation from an absolute instant and an
 * IANA timezone. Derived chart features (hidden stems, ten gods, luck) land in
 * M2 and are intentionally absent here.
 *
 * Note for callers: `hourPillar` keys the Five Rats table on the `dayStem` you
 * pass. Under `lateZiHour: "shift-day"`, schools differ on which day's stem
 * names a 23:00–24:00 hour — pass the stem of whichever dayPillar you display.
 */

export const ENGINE_VERSION = "0.1.0";

export type {
  Stem,
  Branch,
  Element,
  Polarity,
  Pillar,
  LateZiHour,
  EngineConfig,
  SolarTermEntry,
} from "./types.js";
export { DEFAULT_CONFIG } from "./types.js";

export {
  STEMS,
  BRANCHES,
  STEM_ELEMENTS,
  STEM_POLARITIES,
  BRANCH_ELEMENTS,
  FIVE_TIGERS,
  FIVE_RATS,
  JIE,
  JIE_BY_NAME,
} from "../data/tables.js";
export type { JieDefinition } from "../data/tables.js";

export {
  sexagenaryPillar,
  pillarToSexagenaryIndex,
  stemAt,
  branchAt,
  stemIndex,
  branchIndex,
} from "./sexagenary.js";

export {
  yearPillar,
  monthPillar,
  dayPillar,
  hourPillar,
  annualPillar,
  dailyPillar,
} from "./pillars.js";

export { findGoverningTerm, findSolarYear, SOLAR_TERMS } from "./solar-terms.js";

export {
  equationOfTimeMinutes,
  applyTrueSolarTime,
} from "./true-solar-time.js";

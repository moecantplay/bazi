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
  Sex,
  Palace,
  PalacedBranch,
  TenGod,
  InteractionType,
  Interaction,
  CombineInteraction,
  ClashInteraction,
  HarmInteraction,
  TrineInteraction,
  PunishmentInteraction,
  StrengthResult,
  LuckPillar,
  ChartMeta,
  ChartInput,
  ChartHiddenStems,
  ChartTenGods,
  Chart,
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
  HIDDEN_STEMS,
  ELEMENT_PRODUCTION_ORDER,
} from "../data/tables.js";
export type { JieDefinition } from "../data/tables.js";
export {
  SIX_COMBINES,
  SIX_CLASHES,
  TRINES,
  PUNISHMENTS,
  HARMS,
} from "../data/interactions-tables.js";
export type { TrineDefinition, PunishmentDefinition } from "../data/interactions-tables.js";

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

export { findGoverningTerm, findNextTerm, findSolarYear, SOLAR_TERMS } from "./solar-terms.js";

export {
  equationOfTimeMinutes,
  applyTrueSolarTime,
} from "./true-solar-time.js";

export { elementOfStem, polarityOfStem, elementOfBranch } from "./attributes.js";
export {
  produces,
  producedBy,
  controls,
  controlledBy,
  relate,
  type ElementRelation,
} from "./five-elements.js";
export { hiddenStems } from "./hidden-stems.js";
export { tenGods } from "./ten-gods.js";
export { interactions, natalPalacedBranches } from "./interactions.js";
export { luckPillars, type LuckPillarInput } from "./luck-pillars.js";
export { strength, type StrengthInput } from "./strength.js";
export { favorableElements, type FavorableInput } from "./favorable-elements.js";
export { computeChart } from "./chart.js";
export { natalFacts, dailyFacts, type ReadingFact } from "./facts.js";

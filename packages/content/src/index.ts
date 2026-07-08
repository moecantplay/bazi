/**
 * @daymaster/content — the reading content system (Milestone M3).
 *
 * Turns the engine's structured ReadingFacts into voice-compliant, second-person
 * reading lines. All selection is deterministic in a seedKey; this layer does
 * zero chart math. Every user-facing line obeys VOICE.md.
 */

export const CONTENT_VERSION = "0.1.0";

export {
  ACTIVITY_LABELS,
  DISCLAIMER,
  DAY_MASTER_GLOSS,
  INTERACTION_GLOSSES,
  LIFE_STAGE_GLOSS,
  LIFE_STAGE_GLOSSES,
  LUCK_PILLAR_GLOSS,
  NAYIN_GLOSS,
  OFFICER_GLOSSES,
  STAR_GLOSSES,
  STRENGTH_CHECK_GLOSSES,
  TEN_GOD_GLOSSES,
} from "./vocab.js";
export type { ActivityLabel } from "./vocab.js";
export type {
  ReadingLine,
  ReadingSection,
  ReadingSectionKey,
  NatalReading,
  DailyReading,
  CompareReading,
} from "./types.js";
export { BRANCH_ANIMALS, stripHanCharacters } from "./strip-han.js";
export { natalReading } from "./natal-reading.js";
export { dailyReading } from "./daily-reading.js";
export { luckTransitionLines } from "./luck-reading.js";
export { compareReading } from "./compare-reading.js";
export { dayGuidance, dateVerdictLine } from "./day-guidance.js";
export type { GuidanceChip, DayGuidance } from "./day-guidance.js";
export { horizonReading } from "./horizon-reading.js";
export type { HorizonReading } from "./horizon-reading.js";

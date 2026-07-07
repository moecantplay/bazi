/**
 * @daymaster/content — the reading content system (Milestone M3).
 *
 * Turns the engine's structured ReadingFacts into voice-compliant, second-person
 * reading lines. All selection is deterministic in a seedKey; this layer does
 * zero chart math. Every user-facing line obeys VOICE.md.
 */

export const CONTENT_VERSION = "0.1.0";

export {
  DISCLAIMER,
  DAY_MASTER_GLOSS,
  INTERACTION_GLOSSES,
  LUCK_PILLAR_GLOSS,
  TEN_GOD_GLOSSES,
} from "./vocab.js";
export type {
  ReadingLine,
  ReadingSection,
  ReadingSectionKey,
  NatalReading,
  DailyReading,
  CompareReading,
} from "./types.js";
export { natalReading } from "./natal-reading.js";
export { dailyReading } from "./daily-reading.js";
export { luckTransitionLines } from "./luck-reading.js";
export { compareReading } from "./compare-reading.js";

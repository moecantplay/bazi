/**
 * The wording-selection half of the reading streak line. Reading/writing the
 * persisted count (`daymaster.streak.v1`) is localStorage I/O and stays in
 * apps/web; this is only the pure "which sentence do we show" choice.
 */

import { fnv1a } from "./hash.js";

/**
 * Ways of saying "you've shown up N days in a row". One is picked per calendar
 * day — variety keeps the line playful, but it never changes mid-day and never
 * randomizes at render time.
 */
const STREAK_WORDINGS: ReadonlyArray<(count: number) => string> = [
  (count) => `${count} days running`,
  (count) => `${count}-day streak`,
  (count) => `${count} days in a row`,
  (count) => `${count} days and counting`,
  (count) => `${count} visits, back to back`,
];

/** The streak line for the Today screen, deterministic in the calendar day. */
export function streakLine(count: number, todayIso: string): string {
  const wording = STREAK_WORDINGS[fnv1a(`streak:${todayIso}`) % STREAK_WORDINGS.length];
  return wording === undefined ? `${count} days running` : wording(count);
}

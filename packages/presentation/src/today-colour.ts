/**
 * Today's colour (M24-06). On a day whose element (the day stem's) helps the
 * reader, its own colour; on one that wears them down, a helper that keeps it
 * in check, else the helper it feeds. One always exists: a weak chart's
 * helpers (self, resource) check wealth and output and are fed by officer; a
 * strong chart's (output, wealth, officer) check resource and self. The
 * steadying rule is interpretive and flagged in .claude/specs/flags.md.
 */

import { controls, elementOfStem, produces } from "@daymaster/bazi-engine";
import { dayColour, type DayColour } from "@daymaster/content";
import { dailyBundleFor } from "./reading.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";
import { elementSplit } from "./you-screen.js";

export function todayColourFor(profile: StoredProfile, dateISO: string): DayColour | null {
  const { helps } = elementSplit(profile);
  const dayElement = elementOfStem(dailyBundleFor(profile, dateISO).dayPillar.stem);
  const seedKey = `${natalSeedKey(profile)}|${dateISO}`;
  if (helps.includes(dayElement)) {
    return dayColour(dayElement, "lean", seedKey);
  }
  const steadier =
    helps.find((element) => controls(element) === dayElement) ??
    helps.find((element) => produces(dayElement) === element);
  return steadier === undefined ? null : dayColour(steadier, "steady", seedKey);
}

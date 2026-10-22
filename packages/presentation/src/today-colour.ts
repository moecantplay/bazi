/**
 * Today's colour (M24-06). On a day whose element (the day stem's) helps the
 * reader, its own colour; on one that wears them down, a helper that keeps it
 * in check, else the helper it feeds. One always exists: a weak chart's
 * helpers (self, resource) check wealth and output and are fed by officer; a
 * strong chart's (output, wealth, officer) check resource and self. The
 * steadying rule is interpretive and flagged in .claude/specs/flags.md.
 */

import { controls, dailyPillar, elementOfStem, produces, type Element, type Stem } from "@daymaster/bazi-engine";
import { dayColour, type DayColour, type DayColourMode } from "@daymaster/content";
import { readingZoneOf } from "./reading-zone.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";
import { elementSplit } from "./you-screen.js";

function colourElementFor(profile: StoredProfile, dayStem: Stem): { element: Element; mode: DayColourMode } | null {
  const { helps } = elementSplit(profile);
  const dayElement = elementOfStem(dayStem);
  if (helps.includes(dayElement)) {
    return { element: dayElement, mode: "lean" };
  }
  const steadier =
    helps.find((element) => controls(element) === dayElement) ??
    helps.find((element) => produces(dayElement) === element);
  return steadier === undefined ? null : { element: steadier, mode: "steady" };
}

/** Whether the day's colour leans in or steadies, or null when no colour fits: the colour line's situation. */
export function colourModeFor(profile: StoredProfile, dayStem: Stem): DayColourMode | null {
  return colourElementFor(profile, dayStem)?.mode ?? null;
}

/** Today's colour; `visits` steps its line by visit (M24-11), else by day number. */
export function todayColourFor(profile: StoredProfile, dateISO: string, visits?: Readonly<Record<string, number>>): DayColour | null {
  const choice = colourElementFor(profile, dailyPillar(dateISO, readingZoneOf(profile)).stem);
  if (!choice) {
    return null;
  }
  return dayColour(choice.element, choice.mode, { chart: natalSeedKey(profile), date: dateISO, visits });
}

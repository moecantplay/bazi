/**
 * TRIAL (2026-10-05 reshape trial build): view-models for You and People —
 * the natal and pair facts handed to content's plain readings. Ahead's are in
 * trial-ahead.ts.
 */

import { controls, elementOfStem, natalFacts, produces, type Element } from "@daymaster/bazi-engine";
import {
  dayColour,
  pairReading,
  youColours,
  youElements,
  youReading,
  type DayColour,
  type PlainReading,
  type YouColours,
  type YouElements,
} from "@daymaster/content";
import { chartFor } from "./chart.js";
import { compareBundleFor } from "./compare.js";
import { dailyBundleFor } from "./reading.js";
import { ELEMENT_ORDER } from "./elements.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredBirth, StoredProfile } from "./types.js";

/** The You screen: portrait and plain cards from the natal facts. */
export function youScreenFor(profile: StoredProfile): PlainReading | null {
  return youReading(natalFacts(chartFor(profile)), natalSeedKey(profile));
}

/**
 * R15: the elements that help you (the engine's favourable set, in its order)
 * and the ones that wear you down — the rest, the same strength rule read the
 * other way.
 */
export function youElementsFor(profile: StoredProfile): YouElements | null {
  const { helps, wears } = elementSplit(profile);
  return youElements(helps, wears);
}

/** R16: the colours of the same split. */
export function youColoursFor(profile: StoredProfile): YouColours | null {
  const { helps, wears } = elementSplit(profile);
  return youColours(helps, wears);
}

/**
 * R17: Today's colour for one date. On a day whose element helps you, its own
 * colour; on one that wears you down, a helper that keeps it in check, else
 * the helper it feeds. One always exists: a weak chart's helpers (self,
 * resource) check wealth and output and are fed by officer; a strong chart's
 * (output, wealth, officer) check resource and self.
 */
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

function elementSplit(profile: StoredProfile): { helps: Element[]; wears: Element[] } {
  const helps = chartFor(profile).favorableElements;
  return { helps, wears: ELEMENT_ORDER.filter((element) => !helps.includes(element)) };
}

/** People: the pair reading for one saved person. */
export function pairScreenFor(profile: StoredProfile, birth: StoredBirth): PlainReading | null {
  return pairReading(compareBundleFor(profile, birth).facts);
}

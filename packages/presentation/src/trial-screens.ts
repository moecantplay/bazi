/**
 * TRIAL (2026-10-05 reshape trial build): view-models for You and People —
 * the natal and pair facts handed to content's plain readings. Ahead's are in
 * trial-ahead.ts.
 */

import { natalFacts } from "@daymaster/bazi-engine";
import { pairReading, youElements, youReading, type PlainReading, type YouElements } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { compareBundleFor } from "./compare.js";
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
  const helps = chartFor(profile).favorableElements;
  const wears = ELEMENT_ORDER.filter((element) => !helps.includes(element));
  return youElements(helps, wears);
}

/** People: the pair reading for one saved person. */
export function pairScreenFor(profile: StoredProfile, birth: StoredBirth): PlainReading | null {
  return pairReading(compareBundleFor(profile, birth).facts);
}

/**
 * TRIAL (2026-10-05 reshape trial build): view-models for You and People —
 * the natal and pair facts handed to content's plain readings. Ahead's are in
 * trial-ahead.ts.
 */

import { natalFacts } from "@daymaster/bazi-engine";
import { pairReading, youReading, type PlainReading } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { compareBundleFor } from "./compare.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredBirth, StoredProfile } from "./types.js";

/** The You screen: portrait and plain cards from the natal facts. */
export function youScreenFor(profile: StoredProfile): PlainReading | null {
  return youReading(natalFacts(chartFor(profile)), natalSeedKey(profile));
}

/** People: the pair reading for one saved person. */
export function pairScreenFor(profile: StoredProfile, birth: StoredBirth): PlainReading | null {
  return pairReading(compareBundleFor(profile, birth).facts);
}

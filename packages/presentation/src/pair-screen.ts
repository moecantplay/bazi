/** People's view-model (M24-09): the pair's compare facts handed to content's plain pair reading. */

import { pairReading, type PlainReading } from "@daymaster/content";
import { compareBundleFor } from "./compare.js";
import type { StoredBirth, StoredProfile } from "./types.js";

/** The plain pair reading for one saved person. */
export function pairScreenFor(profile: StoredProfile, birth: StoredBirth): PlainReading | null {
  return pairReading(compareBundleFor(profile, birth).facts);
}

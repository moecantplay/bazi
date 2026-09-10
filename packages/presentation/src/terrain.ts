/**
 * The Today terrain: the ground palette is keyed to the day pillar's element,
 * computed in the profile's own birth timezone so it rolls over at the same
 * midnight as the rest of Today.
 */

import { dailyPillar, type Element } from "@daymaster/bazi-engine";
import { describeStem } from "./display.js";
import { readingZoneOf } from "./reading-zone.js";
import type { StoredProfile } from "./types.js";

/** Today's terrain element for `profile` on `todayIso`. */
export function dayTerrain(profile: StoredProfile, todayIso: string): Element {
  const zone = readingZoneOf(profile);
  const pillar = dailyPillar(todayIso, zone);
  return describeStem(pillar.stem).element;
}

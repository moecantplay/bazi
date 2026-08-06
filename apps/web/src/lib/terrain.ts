/**
 * The Today terrain (DESIGN.md v4 §Tokens): the ground palette is keyed to
 * the day pillar's element, computed in the profile's own birth timezone so
 * it rolls over at the same midnight as the rest of Today (the M12 rule).
 */

import { dailyPillar, type Element } from "@daymaster/bazi-engine";
import { describeStem } from "./display";
import type { StoredProfile } from "./profile";

/** Today's terrain element for `profile` on `todayIso`. */
export function dayTerrain(profile: StoredProfile, todayIso: string): Element {
  const zone = profile.birth.city.tz;
  const pillar = dailyPillar(todayIso, zone);
  return describeStem(pillar.stem).element;
}

/**
 * Which zone a day is read in.
 *
 * The natal chart is fixed to the birth zone, but "today" is wherever the
 * reader is now — the same clock the date label and the map's live "you are
 * here" dot already follow. In practice the day pillar is the same in every
 * zone (it is keyed at local noon, far from midnight); what moves is the day
 * officer on the nine or so solar-term boundary days a year, when noon in
 * one zone falls before the jié and noon in another falls after it, and the
 * monthly pillar in the same boundary case. Reading in the device zone keeps
 * those in step with the clock the reader is actually living by.
 */

import type { StoredProfile } from "./types.js";

/** The zone daily/monthly transits are read in: the reader's, else the birth zone. */
export function readingZoneOf(profile: StoredProfile): string {
  return profile.readingZone ?? profile.birth.city.tz;
}

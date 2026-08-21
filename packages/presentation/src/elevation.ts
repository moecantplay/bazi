/**
 * The seven-day elevation profile's data: each of the next WEEK_LENGTH days'
 * summed dayTone plotted as elevation (favoured days sit higher, friction
 * days sit lower), plus the dashed SVG path string joining them.
 */

import { dailyPillar, type Element } from "@daymaster/bazi-engine";
import { addDays } from "./dates.js";
import { dayTone, type DayTone } from "./day-tone.js";
import { describeBranch } from "./display.js";
import type { StoredProfile } from "./types.js";

export const ELEVATION_WEEK_LENGTH = 7;

/** Elevation (percent from the top) for each tone — favoured is higher. */
const TONE_Y: Record<DayTone, number> = {
  favoured: 22,
  even: 50,
  friction: 78
};

export interface ElevationCell {
  iso: string;
  tone: DayTone;
  animal: string;
  element: Element;
  x: number;
  y: number;
}

/** The next `ELEVATION_WEEK_LENGTH` days (today first), plotted for the profile. */
export function elevationWeek(profile: StoredProfile, todayISO: string): ElevationCell[] {
  const zone = profile.birth.city.tz;
  return Array.from({ length: ELEVATION_WEEK_LENGTH }, (_, index) => {
    const iso = addDays(todayISO, index);
    const tone = dayTone(profile, iso);
    const branch = describeBranch(dailyPillar(iso, zone).branch);
    return {
      iso,
      tone,
      animal: branch.gloss,
      element: branch.element,
      x: ((index + 0.5) / ELEVATION_WEEK_LENGTH) * 100,
      y: TONE_Y[tone]
    };
  });
}

/** The dashed-line "M...L...L..." path joining plotted cells, in plot order. */
export function elevationPath(cells: readonly { x: number; y: number }[]): string {
  return cells.map((cell, index) => `${index === 0 ? "M" : "L"}${cell.x} ${cell.y}`).join(" ");
}

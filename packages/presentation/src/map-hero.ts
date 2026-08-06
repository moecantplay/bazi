/** The map hero's derived summary: how many waypoints are marked crossings, and the SVG's aria-label. */

import type { DayTone } from "./day-tone.js";
import type { RouteWaypoint } from "./route-waypoints.js";

export interface MapHeroSummary {
  crossingCount: number;
  ariaLabel: string;
}

export function mapHeroSummary(waypoints: readonly RouteWaypoint[], tone: DayTone): MapHeroSummary {
  const crossingCount = waypoints.filter((waypoint) => waypoint.crossing).length;
  const toneWord =
    tone === "favoured" ? "a clear stretch" : tone === "friction" ? "a slower stretch" : "an even stretch";
  const ariaLabel = `Today's route: ${toneWord}${
    crossingCount > 0 ? `, ${crossingCount} marked crossing${crossingCount > 1 ? "s" : ""}` : ""
  }`;
  return { crossingCount, ariaLabel };
}

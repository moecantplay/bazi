/** The map hero's derived summary: how many day-long waypoints are crossings, and the SVG's aria-label (tone, crossings, the timed hours). */

import type { DayTone } from "./day-tone.js";
import type { RouteWaypoint } from "./route-waypoints.js";

export interface MapHeroSummary {
  crossingCount: number;
  ariaLabel: string;
}

export function mapHeroSummary(waypoints: readonly RouteWaypoint[], tone: DayTone): MapHeroSummary {
  const dayLong = waypoints.filter((waypoint) => waypoint.timing.kind === "all-day");
  const crossingCount = dayLong.filter((waypoint) => waypoint.crossing).length;
  const toneWord =
    tone === "favoured" ? "a clear stretch" : tone === "friction" ? "a slower stretch" : "an even stretch";
  const crossings =
    crossingCount > 0 ? `, ${crossingCount} day-long crossing${crossingCount > 1 ? "s" : ""}` : "";
  const hours = waypoints
    .filter((waypoint) => waypoint.timing.kind === "hours")
    .map((waypoint) =>
      waypoint.timing.kind === "hours"
        ? `${waypoint.crossing ? "rough hour" : "easy hour"} ${waypoint.timing.label}`
        : ""
    )
    .filter((part) => part.length > 0);
  const hoursPart = hours.length > 0 ? `, ${hours.join(", ")}` : "";
  const ariaLabel = `Today's route: ${toneWord}${crossings}${hoursPart}`;
  return { crossingCount, ariaLabel };
}

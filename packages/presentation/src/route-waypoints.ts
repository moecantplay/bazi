/**
 * Selects the map hero's waypoints. Two kinds, kept apart because they hold
 * for different spans of time:
 *
 * - Day-long: the day's two strongest transit-interaction facts, in the same
 *   order Today's reading ranks them (the lead first). They're in force from
 *   midnight to midnight, so the map shows them off the route in an "all day"
 *   row rather than at one point.
 * - Timed: the day's rough hour and easy hour (engine `hour-interaction`
 *   facts), each a two-hour block with a clock window, plotted on the route
 *   at that time.
 */

import type { Branch, InteractionType, Palace, ReadingFact } from "@daymaster/bazi-engine";
import { hourWindowLabel, rankTransits } from "@daymaster/content";
import { hourWindowProgress } from "./dates.js";

/** Interaction types the map hero marks with a crossing (circle + X). */
const CROSSING_TYPES: ReadonlySet<InteractionType> = new Set(["six-clash", "punishment", "harm"]);

type HourInteractionFact = Extract<ReadingFact, { kind: "hour-interaction" }>;

/** When a waypoint holds: the whole day, or one two-hour block. */
export type WaypointTiming =
  | { kind: "all-day" }
  | {
      kind: "hours";
      startHour: number;
      endHour: number;
      /** Clock window as people say it ("11 am–1 pm"). */
      label: string;
      /** Where along the route (0 = MORNING, 1 = EVENING) the block's centre falls. */
      progress: number;
    };

export interface RouteWaypoint {
  interaction: InteractionType;
  /** The branch the mark's animal shows: the transit's for day-long, the hour's for timed. */
  transitBranch: Branch;
  /** Clash/punishment/harm get a crossing mark; combine/trine get a plain node. */
  crossing: boolean;
  timing: WaypointTiming;
  /** The natal palace a day-long mark touches, or "hours" for a timed mark. */
  area: Palace | "hours";
}

/** The map shows at most this many day-long marks. */
const MAX_DAY_LONG = 2;

/** Minimum route fraction between two timed marks so their labels never overlap. */
const MIN_TIMED_GAP = 0.14;

/**
 * Timed marks in route order, the later one nudged right when two blocks
 * land within MIN_TIMED_GAP of each other (a 卯/辰 pair both clamp near the
 * MORNING end, for instance). Only ever pushes right: the two partners of
 * one branch are never both late-night blocks, so nothing can be pushed off
 * the EVENING end.
 */
function spreadTimed(waypoints: RouteWaypoint[]): RouteWaypoint[] {
  const timed = waypoints
    .filter((waypoint) => waypoint.timing.kind === "hours")
    .sort((a, b) => progressOf(a) - progressOf(b));
  for (let index = 1; index < timed.length; index += 1) {
    const previous = timed[index - 1]!;
    const current = timed[index]!;
    if (progressOf(current) - progressOf(previous) < MIN_TIMED_GAP) {
      setProgress(current, progressOf(previous) + MIN_TIMED_GAP);
    }
  }
  return timed;
}

function progressOf(waypoint: RouteWaypoint): number {
  return waypoint.timing.kind === "hours" ? waypoint.timing.progress : 0;
}

function setProgress(waypoint: RouteWaypoint, progress: number): void {
  if (waypoint.timing.kind === "hours") {
    waypoint.timing.progress = progress;
  }
}

function timedWaypoint(fact: HourInteractionFact): RouteWaypoint {
  return {
    interaction: fact.interaction,
    transitBranch: fact.hourBranch,
    crossing: CROSSING_TYPES.has(fact.interaction),
    area: "hours",
    timing: {
      kind: "hours",
      startHour: fact.startHour,
      endHour: fact.endHour,
      label: hourWindowLabel(fact.startHour, fact.endHour),
      progress: hourWindowProgress(fact.startHour, fact.endHour)
    }
  };
}

/** Every route waypoint: the day-long ones first (up to two), then the timed ones in clock order. */
export function routeWaypointsFor(facts: readonly ReadingFact[]): RouteWaypoint[] {
  const dayLong = rankTransits(facts)
    .slice(0, MAX_DAY_LONG)
    .map((fact): RouteWaypoint => ({
      interaction: fact.interaction,
      transitBranch: fact.transitBranch,
      crossing: CROSSING_TYPES.has(fact.interaction),
      area: fact.natalPalaces[0] ?? "day",
      timing: { kind: "all-day" }
    }));
  const timed = spreadTimed(
    facts
      .filter((fact): fact is HourInteractionFact => fact.kind === "hour-interaction")
      .map(timedWaypoint)
  );
  return [...dayLong, ...timed];
}

/**
 * Selects the map hero's waypoints. Two kinds, kept apart because they hold
 * for different spans of time:
 *
 * - Day-long: up to two transit-interaction facts — the same relation facts
 *   already surfaced as the first waypoint-rail lines (topics starting
 *   "interaction:"). They're in force from midnight to midnight, so the map
 *   shows them off the route in an "all day" row rather than at one point.
 * - Timed: the day's rough hour and easy hour (engine `hour-interaction`
 *   facts), each a two-hour block with a clock window, plotted on the route
 *   at that time.
 *
 * Day-long waypoints are matched back from their lines: a ReadingLine doesn't
 * carry the transit branch itself, so each selected line is matched to its
 * originating ReadingFact A ReadingLine doesn't carry the transit
 * branch itself, so each selected line is matched back to its originating
 * ReadingFact by rebuilding the fact tag's runs with content's own
 * `interactionTagRuns` (packages/content/src/vocab.ts, the same builder
 * packages/content/src/banks/transit-interactions.ts uses) and comparing the
 * structured citation — no private word map duplicated here.
 */

import type { Branch, InteractionType, ReadingFact } from "@daymaster/bazi-engine";
import { hourWindowLabel, interactionTagRuns, type ReadingLine, type TokenLine } from "@daymaster/content";
import { hourWindowProgress } from "./dates.js";

/** Structural equality for two TokenLines — both are plain serializable data. */
function sameRuns(a: TokenLine, b: TokenLine | null): boolean {
  return b !== null && JSON.stringify(a) === JSON.stringify(b);
}

/** Interaction types the map hero marks with a crossing (circle + X). */
const CROSSING_TYPES: ReadonlySet<InteractionType> = new Set(["six-clash", "punishment", "harm"]);

type TransitInteractionFact = Extract<ReadingFact, { kind: "transit-interaction" }>;
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
}

function tagRunsFor(fact: TransitInteractionFact): TokenLine {
  const room = fact.natalPalaces[0] ?? "day";
  return interactionTagRuns(fact.branches, fact.interaction, room);
}

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
    timing: {
      kind: "hours",
      startHour: fact.startHour,
      endHour: fact.endHour,
      label: hourWindowLabel(fact.startHour, fact.endHour),
      progress: hourWindowProgress(fact.startHour, fact.endHour)
    }
  };
}

/**
 * Every route waypoint: day-long ones first (up to two, in the same order as
 * the waypoint-rail reading), then the timed ones in clock order.
 */
export function routeWaypointsFor(
  lines: readonly ReadingLine[],
  facts: readonly ReadingFact[]
): RouteWaypoint[] {
  const timed = spreadTimed(
    facts
      .filter((fact): fact is HourInteractionFact => fact.kind === "hour-interaction")
      .map(timedWaypoint)
  );
  return [...dayLongWaypointsFor(lines, facts), ...timed];
}

/** Up to two day-long waypoints, matched back to their transit-interaction facts. */
function dayLongWaypointsFor(
  lines: readonly ReadingLine[],
  facts: readonly ReadingFact[]
): RouteWaypoint[] {
  const transitFacts = facts.filter(
    (fact): fact is TransitInteractionFact => fact.kind === "transit-interaction"
  );
  const interactionLines = lines
    .filter((line) => line.topic?.startsWith("interaction:"))
    .slice(0, 2);

  return interactionLines.flatMap((line): RouteWaypoint[] => {
    const type = line.topic?.slice("interaction:".length) as InteractionType | undefined;
    if (!type) {
      return [];
    }
    const candidates = transitFacts.filter((fact) => fact.interaction === type);
    const matched = candidates.find((fact) => sameRuns(tagRunsFor(fact), line.factTagRuns)) ?? candidates[0];
    if (!matched) {
      return [];
    }
    return [
      {
        interaction: matched.interaction,
        transitBranch: matched.transitBranch,
        crossing: CROSSING_TYPES.has(matched.interaction),
        timing: { kind: "all-day" }
      }
    ];
  });
}

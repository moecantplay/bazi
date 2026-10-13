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
 *   at that time. The reader's best hour (M24-13) is placed alongside them
 *   as its own mark, `bestHourMarkFor`, spread together with them.
 */

import type { Branch, Element, InteractionType, Palace, ReadingFact } from "@daymaster/bazi-engine";
import { hourWindowLabel, rankTransits } from "@daymaster/content";
import { TIMED_PROGRESS_MAX, hourWindowProgress, hourWindowRawProgress } from "./dates.js";

/** Interaction types the map hero marks with a crossing (circle + X). */
const CROSSING_TYPES: ReadonlySet<InteractionType> = new Set(["six-clash", "punishment", "harm"]);

type HourInteractionFact = Extract<ReadingFact, { kind: "hour-interaction" }>;
type BestHourFact = Extract<ReadingFact, { kind: "best-hour" }>;

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

/** Anything placed on the route at a time: a timed waypoint's timing or the best-hour mark. */
interface Placed {
  progress: number;
}

interface TimedSlot {
  /** Unclamped position, so marks that clamp to the same end keep their order in the day. */
  raw: number;
  placed: Placed;
}

/**
 * Spreads up to three timed marks (rough, easy, the reader's best hour) at
 * least MIN_TIMED_GAP apart, in the order they fall in the day. Marks are
 * pushed right first; if that runs the last one past the EVENING end, it is
 * pinned there and the others are pushed back left. Three marks need 0.28 of
 * the route, well inside its usable 0.2–0.86, so both passes always fit.
 */
function spreadTimed(slots: TimedSlot[]): void {
  const ordered = [...slots].sort((a, b) => a.raw - b.raw);
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1]!.placed;
    const current = ordered[index]!.placed;
    if (current.progress - previous.progress < MIN_TIMED_GAP) {
      current.progress = previous.progress + MIN_TIMED_GAP;
    }
  }
  const last = ordered[ordered.length - 1]?.placed;
  if (!last || last.progress <= TIMED_PROGRESS_MAX) {
    return;
  }
  last.progress = TIMED_PROGRESS_MAX;
  for (let index = ordered.length - 2; index >= 0; index -= 1) {
    const next = ordered[index + 1]!.placed;
    const current = ordered[index]!.placed;
    if (next.progress - current.progress < MIN_TIMED_GAP) {
      current.progress = next.progress - MIN_TIMED_GAP;
    }
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

/** The reader's best hour on the route (M24-13), beside the day's rough and easy hours. */
export interface BestHourMark {
  branch: Branch;
  /** The hour stem's element: the mark wears its colours. */
  element: Element;
  startHour: number;
  endHour: number;
  /** Clock window as people say it ("11 am–1 pm"). */
  label: string;
  /** Where along the route the mark sits; the easy hour's position when they are the same block. */
  progress: number;
  /** Same block as the day's easy hour: no mark of its own, the easy mark carries it. */
  isEasyHour: boolean;
}

interface TimedLayout {
  timed: RouteWaypoint[];
  bestHour: BestHourMark | null;
}

function timedLayout(facts: readonly ReadingFact[]): TimedLayout {
  const hours = facts.filter((fact): fact is HourInteractionFact => fact.kind === "hour-interaction");
  const timed = hours.map(timedWaypoint);
  const slots: TimedSlot[] = timed.flatMap((waypoint) =>
    waypoint.timing.kind === "hours"
      ? [{ raw: hourWindowRawProgress(waypoint.timing.startHour, waypoint.timing.endHour), placed: waypoint.timing }]
      : []
  );

  const fact = facts.find((candidate): candidate is BestHourFact => candidate.kind === "best-hour");
  const bestHour: BestHourMark | null = fact
    ? {
        branch: fact.hourBranch,
        element: fact.element,
        startHour: fact.startHour,
        endHour: fact.endHour,
        label: hourWindowLabel(fact.startHour, fact.endHour),
        progress: hourWindowProgress(fact.startHour, fact.endHour),
        isEasyHour: fact.isEasyHour
      }
    : null;
  if (bestHour && !bestHour.isEasyHour) {
    slots.push({ raw: hourWindowRawProgress(bestHour.startHour, bestHour.endHour), placed: bestHour });
  }

  spreadTimed(slots);
  if (bestHour?.isEasyHour) {
    const easy = timed.find((waypoint) => !waypoint.crossing);
    bestHour.progress = easy && easy.timing.kind === "hours" ? easy.timing.progress : bestHour.progress;
  }
  const inRouteOrder = [...timed].sort((a, b) => progressOf(a) - progressOf(b));
  return { timed: inRouteOrder, bestHour };
}

function progressOf(waypoint: RouteWaypoint): number {
  return waypoint.timing.kind === "hours" ? waypoint.timing.progress : 0;
}

/** Every route waypoint: the day-long ones first (up to two), then the day's timed ones in route order. */
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
  return [...dayLong, ...timedLayout(facts).timed];
}

/** The reader's best hour, spread on the route together with the day's timed waypoints. */
export function bestHourMarkFor(facts: readonly ReadingFact[]): BestHourMark | null {
  return timedLayout(facts).bestHour;
}

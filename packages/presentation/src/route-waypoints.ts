/**
 * Selects up to two transit-interaction facts to plot as map-hero waypoints —
 * the same relation facts already surfaced as the first waypoint-rail lines
 * (topics starting "interaction:"). A ReadingLine doesn't carry the transit
 * branch itself, so each selected line is matched back to its originating
 * ReadingFact by rebuilding the fact tag's runs with content's own
 * `interactionTagRuns` (packages/content/src/vocab.ts, the same builder
 * packages/content/src/banks/transit-interactions.ts uses) and comparing the
 * structured citation — no private word map duplicated here.
 */

import type { Branch, InteractionType, ReadingFact } from "@daymaster/bazi-engine";
import { interactionTagRuns, type ReadingLine, type TokenLine } from "@daymaster/content";

/** Structural equality for two TokenLines — both are plain serializable data. */
function sameRuns(a: TokenLine, b: TokenLine | null): boolean {
  return b !== null && JSON.stringify(a) === JSON.stringify(b);
}

/** Interaction types the map hero marks with a crossing (circle + X). */
const CROSSING_TYPES: ReadonlySet<InteractionType> = new Set(["six-clash", "punishment", "harm"]);

type TransitInteractionFact = Extract<ReadingFact, { kind: "transit-interaction" }>;

export interface RouteWaypoint {
  interaction: InteractionType;
  transitBranch: Branch;
  /** Clash/punishment/harm get a crossing mark; combine/trine get a plain node. */
  crossing: boolean;
}

function tagRunsFor(fact: TransitInteractionFact): TokenLine {
  const room = fact.natalPalaces[0] ?? "day";
  return interactionTagRuns(fact.branches, fact.interaction, room);
}

/** Up to two route waypoints, in the same order as the waypoint-rail reading. */
export function routeWaypointsFor(
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
        crossing: CROSSING_TYPES.has(matched.interaction)
      }
    ];
  });
}

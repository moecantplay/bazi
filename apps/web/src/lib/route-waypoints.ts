/**
 * Selects up to two transit-interaction facts to plot as map-hero waypoints —
 * the same relation facts already surfaced as the first waypoint-rail lines
 * (topics starting "interaction:"). A ReadingLine doesn't carry the transit
 * branch itself, so each selected line is matched back to its originating
 * ReadingFact by reconstructing the fact tag the same way the content
 * package does (packages/content/src/banks/transit-interactions.ts). That
 * builder isn't exported, so INTERACTION_WORD mirrors its small word map;
 * the palace half reuses this module's own palaceWord, which already covers
 * the same natal-palace words.
 */

import type { Branch, InteractionType, ReadingFact } from "@daymaster/bazi-engine";
import type { ReadingLine } from "@daymaster/content";
import { palaceWord } from "./display";

const INTERACTION_WORD: Record<InteractionType, string> = {
  "six-combine": "combine",
  "six-clash": "clash",
  trine: "trine",
  punishment: "punishment",
  harm: "harm"
};

/** Interaction types the map hero marks with a crossing (circle + X). */
const CROSSING_TYPES: ReadonlySet<InteractionType> = new Set(["six-clash", "punishment", "harm"]);

type TransitInteractionFact = Extract<ReadingFact, { kind: "transit-interaction" }>;

export interface RouteWaypoint {
  interaction: InteractionType;
  transitBranch: Branch;
  /** Clash/punishment/harm get a crossing mark; combine/trine get a plain node. */
  crossing: boolean;
}

function tagFor(fact: TransitInteractionFact): string {
  const room = fact.natalPalaces[0] ?? "day";
  return `${fact.branches.join("")} ${INTERACTION_WORD[fact.interaction]} · ${palaceWord(room) ?? "home palace"}`;
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
    const matched = candidates.find((fact) => tagFor(fact) === line.factTag) ?? candidates[0];
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

/**
 * Favorable elements (喜用神): a climate-first, interpretive heuristic.
 *
 * Like {@link strength}, this is one simplified school's approach, not a
 * canonical table. It seeds the seasonal climate corrector first, then adds
 * elements that support a weak day master or drain a strong one, de-duplicated
 * and capped to keep the guidance focused.
 */

import { elementOfStem } from "./attributes.js";
import { controlledBy, controls, produces, producedBy } from "./five-elements.js";
import type { Branch, Element, Stem } from "./types.js";

/** Winter months call for Fire; summer months call for Water. Interpretive. */
const WINTER_BRANCHES: readonly Branch[] = ["亥", "子", "丑"];
const SUMMER_BRANCHES: readonly Branch[] = ["巳", "午", "未"];
const MAX_ELEMENTS = 3;

export interface FavorableInput {
  dayMaster: Stem;
  monthBranch: Branch;
  strength: "strong" | "weak";
}

export function favorableElements(input: FavorableInput): Element[] {
  const dayMasterElement = elementOfStem(input.dayMaster);
  const ordered: Element[] = [];

  if (WINTER_BRANCHES.includes(input.monthBranch)) {
    ordered.push("fire");
  } else if (SUMMER_BRANCHES.includes(input.monthBranch)) {
    ordered.push("water");
  }

  if (input.strength === "weak") {
    // Support the weak: the day master's own element and its resource.
    ordered.push(dayMasterElement, producedBy(dayMasterElement));
  } else {
    // Drain the strong: output, wealth, and officer elements.
    ordered.push(
      produces(dayMasterElement),
      controls(dayMasterElement),
      controlledBy(dayMasterElement),
    );
  }

  return [...new Set(ordered)].slice(0, MAX_ELEMENTS);
}

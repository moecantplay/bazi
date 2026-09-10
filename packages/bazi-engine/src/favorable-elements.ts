/**
 * Favorable elements (喜用神): a strength-first, interpretive heuristic.
 *
 * Like {@link strength}, this is one simplified school's approach, not a
 * canonical table. The strength verdict decides the set — support a weak day
 * master (self + resource), drain a strong one (output, wealth, officer). The
 * seasonal climate corrector (winter wants Fire, summer wants Water) then
 * leads the list only when it agrees with that verdict: a weak Water day
 * master born in winter is not told Fire suits it, because Fire is what
 * drains it. De-duplicated and capped to keep the guidance focused.
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

function climateElement(monthBranch: Branch): Element | null {
  if (WINTER_BRANCHES.includes(monthBranch)) {
    return "fire";
  }
  if (SUMMER_BRANCHES.includes(monthBranch)) {
    return "water";
  }
  return null;
}

export function favorableElements(input: FavorableInput): Element[] {
  const dayMasterElement = elementOfStem(input.dayMaster);

  const byStrength: Element[] =
    input.strength === "weak"
      ? [dayMasterElement, producedBy(dayMasterElement)]
      : [produces(dayMasterElement), controls(dayMasterElement), controlledBy(dayMasterElement)];

  const climate = climateElement(input.monthBranch);
  const ordered = climate !== null && byStrength.includes(climate) ? [climate, ...byStrength] : byStrength;

  return [...new Set(ordered)].slice(0, MAX_ELEMENTS);
}

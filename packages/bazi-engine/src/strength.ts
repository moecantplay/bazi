/**
 * Day-master strength (身强 / 身弱).
 *
 * This is ONE school's simplified, interpretive method — not a canonical rule
 * from the brief's data tables. It weighs how much the visible chart supports
 * versus drains the day master, giving the month branch (the seasonal root)
 * double weight. The weights and tie-break below are the tunable, interpretive
 * part; they are deliberately isolated here.
 */

import { elementOfBranch, elementOfStem } from "./attributes.js";
import { relate } from "./five-elements.js";
import { hiddenStems } from "./hidden-stems.js";
import type { Element, Pillar, StrengthResult, Stem } from "./types.js";

/** Interpretive weights: the seasonal (month) branch counts double. */
const MONTH_BRANCH_WEIGHT = 2;
const OTHER_WEIGHT = 1;

export interface StrengthInput {
  dayMaster: Stem;
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

/** A supporter shares the day master's element or generates it (印 / 比劫). */
function isSupport(dayMasterElement: Element, other: Element): boolean {
  const relation = relate(dayMasterElement, other);
  return relation === "same" || relation === "resource";
}

export function strength(input: StrengthInput): StrengthResult {
  const dayMasterElement = elementOfStem(input.dayMaster);
  const pillars = [input.year, input.month, input.day, input.hour].filter(
    (pillar): pillar is Pillar => pillar !== null,
  );

  let supporterScore = 0;
  let drainerScore = 0;

  const add = (element: Element, weight: number): void => {
    if (isSupport(dayMasterElement, element)) {
      supporterScore += weight;
    } else {
      drainerScore += weight;
    }
  };

  for (const pillar of pillars) {
    add(elementOfStem(pillar.stem), OTHER_WEIGHT);
    const branchWeight = pillar === input.month ? MONTH_BRANCH_WEIGHT : OTHER_WEIGHT;
    add(elementOfBranch(pillar.branch), branchWeight);
  }

  const seasonalSupport = isSupport(dayMasterElement, elementOfBranch(input.month.branch));

  // 得地 (rooted): the day master's own element hides in some branch — a root
  // to stand on. Same-element hidden stems only (比劫 roots), the common rule.
  const rooted = pillars.some((pillar) =>
    hiddenStems(pillar.branch).some((hidden) => elementOfStem(hidden) === dayMasterElement),
  );

  // 得勢 (backed): supporters are a strict majority of the OTHER visible stems.
  const otherStems = pillars.filter((pillar) => pillar !== input.day).map((pillar) => pillar.stem);
  const backers = otherStems.filter((stem) => isSupport(dayMasterElement, elementOfStem(stem)));
  const backed = backers.length * 2 > otherStems.length;

  // Tie goes to weak: a day master needs a clear majority to count as strong.
  const value = supporterScore > drainerScore ? "strong" : "weak";
  return { value, supporterScore, drainerScore, seasonalSupport, rooted, backed };
}

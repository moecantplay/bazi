/**
 * Element and polarity accessors for stems and branches, resolved through the
 * index-aligned reference arrays.
 */

import { BRANCH_ELEMENTS, STEM_ELEMENTS, STEM_POLARITIES } from "../data/tables.js";
import { branchIndex, stemIndex } from "./sexagenary.js";
import type { Branch, Element, Polarity, Stem } from "./types.js";

/** The element (五行) of a stem. */
export function elementOfStem(stem: Stem): Element {
  return STEM_ELEMENTS[stemIndex(stem)]!;
}

/** The polarity (阴阳) of a stem. */
export function polarityOfStem(stem: Stem): Polarity {
  return STEM_POLARITIES[stemIndex(stem)]!;
}

/** The element (五行) of a branch. */
export function elementOfBranch(branch: Branch): Element {
  return BRANCH_ELEMENTS[branchIndex(branch)]!;
}

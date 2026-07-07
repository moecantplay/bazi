/**
 * Five-element (五行) cycle relationships.
 *
 * Two cycles govern every element pair: the generating cycle 相生
 * (Wood→Fire→Earth→Metal→Water→Wood) and the controlling cycle 相克
 * (Wood→Earth→Water→Fire→Metal→Wood), which is the generating order stepped by
 * two. All relations are derived from a single ordered array, not hand-listed.
 */

import { ELEMENT_PRODUCTION_ORDER } from "../data/tables.js";
import type { Element } from "./types.js";

const ORDER = ELEMENT_PRODUCTION_ORDER;

function orderIndex(element: Element): number {
  return ORDER.indexOf(element);
}

function at(index: number): Element {
  return ORDER[((index % ORDER.length) + ORDER.length) % ORDER.length]!;
}

/** The element that `element` generates (its "output"/child). */
export function produces(element: Element): Element {
  return at(orderIndex(element) + 1);
}

/** The element that generates `element` (its "resource"/parent). */
export function producedBy(element: Element): Element {
  return at(orderIndex(element) - 1);
}

/** The element that `element` controls (its "wealth"). */
export function controls(element: Element): Element {
  return at(orderIndex(element) + 2);
}

/** The element that controls `element` (its "officer"). */
export function controlledBy(element: Element): Element {
  return at(orderIndex(element) - 2);
}

/** How element `other` relates to reference element `self`. */
export type ElementRelation = "same" | "output" | "wealth" | "officer" | "resource";

/**
 * Classify `other` relative to `self`:
 * - `same`: identical element
 * - `output`: self generates other (食伤)
 * - `wealth`: self controls other (财)
 * - `officer`: other controls self (官杀)
 * - `resource`: other generates self (印)
 */
export function relate(self: Element, other: Element): ElementRelation {
  if (self === other) {
    return "same";
  }
  if (produces(self) === other) {
    return "output";
  }
  if (controls(self) === other) {
    return "wealth";
  }
  if (controlledBy(self) === other) {
    return "officer";
  }
  return "resource";
}

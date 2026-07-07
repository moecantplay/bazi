/**
 * Shared element presentation. Element hues appear only as fills (swatch dots,
 * bar fills) with ink/ink-soft labels beside them, per DESIGN.md's rule that
 * element colors are never used for normal-size text.
 */

import type { Element } from "@daymaster/bazi-engine";

/** Tailwind background class for each element's hue (a fill, never text). */
export const ELEMENT_SWATCH_CLASS: Record<Element, string> = {
  wood: "bg-element-wood",
  fire: "bg-element-fire",
  earth: "bg-element-earth",
  metal: "bg-element-metal",
  water: "bg-element-water"
};

/** Capitalized English label for each element. */
export const ELEMENT_LABEL: Record<Element, string> = {
  wood: "Wood",
  fire: "Fire",
  earth: "Earth",
  metal: "Metal",
  water: "Water"
};

/** The five elements in the canonical production order (for stable display). */
export const ELEMENT_ORDER: readonly Element[] = ["wood", "fire", "earth", "metal", "water"];

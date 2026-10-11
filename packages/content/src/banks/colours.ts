/**
 * Colours for each element, worn or kept around you: You's colours (M24-08)
 * and Today's colour (M24-06).
 *
 * The first colour of each list is the classical one — 黃帝內經·素問·金匱真言論
 * (ch. 4): 東方青色, 南方赤色, 中央黃色, 西方白色, 北方黑色 (Wood green,
 * Fire red, Earth yellow, Metal white, Water black). The shades after it are
 * modern feng-shui convention with no classical source — flagged in
 * .claude/specs/flags.md, at most two per element.
 */

import type { Element } from "@daymaster/bazi-engine";

export type Colour =
  | "green"
  | "teal"
  | "red"
  | "orange"
  | "pink"
  | "yellow"
  | "beige"
  | "brown"
  | "white"
  | "grey"
  | "gold"
  | "black"
  | "navy";

export const ELEMENT_COLOURS: Record<Element, readonly [Colour, ...Colour[]]> = {
  wood: ["green", "teal"],
  fire: ["red", "orange", "pink"],
  earth: ["yellow", "beige", "brown"],
  metal: ["white", "grey", "gold"],
  water: ["black", "navy"],
};

/** Wardrobe staples first: the fix line names the one a reader most likely lives in. */
export const STAPLE_ORDER: readonly Element[] = ["water", "metal", "earth", "wood", "fire"];

export const COLOURS_WHERE = "In what you wear, on your desk, around your room.";

export function colourFixLine(staple: Colour, helper: Colour): string {
  return `If you live in ${staple}, add one ${helper} thing: a scarf, a bag, a mug.`;
}

/** Today's colour line (M24-06): leaning in, or steadying the day. Neutral, so it never contradicts the day's lead. */
export function dayColourLine(mode: "lean" | "steady", colour: Colour): string {
  return mode === "lean"
    ? `It matches the day. Wear it, or keep something ${colour} close.`
    : `It keeps you steady today. A little goes far: a scarf, a mug, a pen.`;
}

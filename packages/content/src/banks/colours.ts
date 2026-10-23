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

/**
 * Today's colour line (M24-06): leaning in, or steadying the day. Neutral, so
 * it never contradicts the day's lead. Pools stepped by visit (M24-11);
 * {colour} is the day's colour.
 */
export const DAY_COLOUR_LINES: Record<"lean" | "steady", readonly string[]> = {
  lean: [
    "Today and {colour} go together. Let it show somewhere: socks, a sleeve, a phone case.",
    "It's the day's own colour, and it suits you. Wear as much or as little as you like.",
    "Something {colour} on your desk keeps you in tune with the day.",
    "It matches the day. Wear it, or keep something {colour} close.",
    "This one goes with the grain of today. Even a small touch counts.",
    "Lean into it. Your favourite {colour} thing is a fine pick.",
    "The day wears it, so you can too. Carry one {colour} piece with you.",
    "It's in step with today. A touch at your wrist or on your bag is plenty.",
    "Match the day with a little {colour}, wherever you'll see it often.",
    "Today's shade and yours line up. Keep some {colour} where your eyes land.",
  ],
  steady: [
    "It keeps you steady today. A little goes far: a scarf, a mug, a pen.",
    "This one balances you out. Keep something {colour} within reach.",
    "A touch of {colour} helps you keep an even keel.",
    "It evens you out. One {colour} thing in view is enough.",
    "Think of it as ballast: a small amount keeps you level.",
    "It gives you something to lean on. Have one {colour} item with you through the day.",
    "Keep some {colour} nearby to stay settled, whatever the hours bring.",
    "It brings you back to balance. A sock, a sleeve or a screen background will do.",
    "Small doses work best. Try {colour} in a pocket or on a keyring.",
    "It anchors you. Add one {colour} touch to whatever you're wearing.",
  ],
};

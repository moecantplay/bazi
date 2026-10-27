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
    "This colour [backs you up|has your back]. Let it show [somewhere|in one spot]: socks, a sleeve, a phone case.",
    "It's the colour of the moment, and it suits you. [Wear plenty of it or a hint|Wear a lot of it or a trace], as you like.",
    "Put one {colour} [mug|notebook|pen] on your desk, [where it can catch your eye|in plain sight].",
    "It matches the mood. Wear it, or carry one {colour} [item|object].",
    "This one goes with the grain. Even a [faint|light] touch counts.",
    "Lean into it. Your favourite {colour} [jumper|shirt|scarf] is a fine pick.",
    "It fits [the moment|your mood] well, so wear it. Carry one {colour} piece [with you|in your bag].",
    "It's [in tune|in step] with you. A touch at your wrist or on your bag is [plenty|enough].",
    "Match the moment with [a dash|a splash] of {colour}, wherever you'll see it often.",
    "Its shade and yours line up. [Put|Leave] some {colour} where your eyes land.",
  ],
  steady: [
    "It steadies you. [A dash|A hint] goes far: a scarf, a mug, a pen.",
    "This one balances you out. [Have|Leave] one {colour} [item|object] within reach.",
    "A touch of {colour} [helps you hold|puts you on] an even keel.",
    "It evens you out. One {colour} [object|accessory] in view is [enough|plenty].",
    "Think of it as ballast: [a modest amount|a single piece] holds you level.",
    "It gives you a steady footing. [Have|Carry] one {colour} item with you [until evening|wherever you go].",
    "[Wear|Carry] some {colour} to stay settled, whatever [turns up|happens].",
    "It [brings|draws] you back to balance. A sock, a sleeve or a screen background will do.",
    "[Light|Modest] doses do the most. Try {colour} in a pocket or on a keyring.",
    "It anchors you. Add one {colour} [touch|accent] to [your outfit|whatever you're wearing].",
  ],
};

/**
 * Element-shaped natal content: which element runs loudest, which is absent,
 * the strong/weak reading, the elements that tend to suit you, and the rooms
 * (industries) each favorable element inclines toward.
 *
 * Career material is framed as inclination, never instruction (VOICE.md §5).
 * The industry lists come from the brief; the Fire "power and utilities" entry
 * replaces the brief's "energy" because "energy" is a banned voice word.
 */

import type { Element } from "@daymaster/bazi-engine";

/** Lines for the element that dominates the chart (keyed by that element). */
export const DOMINANT_LINES: Record<Element, readonly string[]> = {
  wood: [
    "Wood runs loudest in your chart: growth, plans, the urge to keep starting things. Your challenge is finishing what you've already planted.",
    "You lead with Wood — expansion, direction, the reach upward. Pruning tends to come harder to you than sowing.",
  ],
  fire: [
    "Fire is your loudest element: warmth, visibility, quick enthusiasm. The work is pacing the burn so it lasts.",
    "You run on Fire — bright, expressive, fast to light. Even a hearth needs to bank down between blazes.",
  ],
  earth: [
    "Earth dominates your chart: steadiness, loyalty, the instinct to hold ground. Watch that holding doesn't harden into stuck.",
    "You are heavy on Earth — reliable, grounded, slow to uproot. Movement is the muscle worth training.",
  ],
  metal: [
    "Metal is your loudest note: standards, structure, the clean cut. Softening the edge, at times, costs you nothing.",
    "You lead with Metal — precision, resolve, a taste for order. Not everything needs sharpening.",
  ],
  water: [
    "Water runs deepest in you: adaptability, depth, the flow around obstacles. Give the current a channel so it doesn't just pool.",
    "You are rich in Water — fluid, perceptive, always moving. A little structure turns drift into direction.",
  ],
};

/** Lines for an element wholly absent from the chart — a room you visit, not a lack. */
export const MISSING_LINES: Record<Element, readonly string[]> = {
  wood: [
    "Wood is missing from your chart — the raw appetite to begin and expand. Starting from nothing may feel less native to you than tending what already exists.",
    "There's no Wood in your chart — the green push of first growth. You often do your best beginning alongside someone who overflows with it.",
  ],
  fire: [
    "Fire is absent here — the outward warmth, the easy visibility. You may run cooler and more private, and warmth is something you can choose to add.",
    "Your chart carries no Fire — the spark that seeks a room's attention. Being seen tends to be a decision for you rather than a reflex.",
  ],
  earth: [
    "Earth is missing from your chart — the ballast, the settled ground. You tend to keep your footing through motion more than through anchoring.",
    "There's no Earth in your chart — the steadying weight. Stability is something you build on purpose rather than stand on by default.",
  ],
  metal: [
    "Metal is absent here — the hard edge and the clean no. Boundaries may be something you construct deliberately rather than feel by instinct.",
    "Your chart carries no Metal — the cut that separates and decides. Firmness tends to be a practiced skill for you, not a first reflex.",
  ],
  water: [
    "Water is missing from your chart — the flow, the give, the depth beneath. Adapting may take conscious effort where others simply bend.",
    "There's no Water in your chart — the current that finds a way around. Flexibility is a choice you make rather than a tide you ride.",
  ],
};

/** Lines when all five elements are present (nothing missing) — a balanced chart. */
export const BALANCED_LINES: readonly string[] = [
  "Your five elements sit close to even. No single note drowns the others, which makes you adaptable and, sometimes, hard to pin down.",
  "The elements in your chart are fairly balanced. Your work is less about fixing an excess and more about choosing where to lean.",
  "No element runs away with your chart. That evenness is its own kind of steadiness.",
];

/** Strong-day-master lines: resourced, able to carry load. */
export const STRONG_LINES: readonly string[] = [
  "Your day-master — the stem that stands for you — reads strong: a hiker with a full pack and good boots. You can take on load; the risk is taking on too much before you notice.",
  "You carry a strong day-master, meaning the you at the chart's center is well-rooted and well-supplied. The discipline worth practicing is knowing when to stop pushing.",
  "A strong day-master means you rarely run empty — a stove that holds its heat. Direct that surplus on purpose, or it spends itself on whatever's nearest.",
];

/** Weak-day-master lines: a light pack, never a deficiency (VOICE.md §8). */
export const WEAK_LINES: readonly string[] = [
  "Your day-master — the stem that stands for you — travels light; a weak reading is a light pack, not a lack. You move easily, borrow well, and do your best work with the right support around you.",
  "You carry a light pack: a weaker day-master that thrives in good company, the cyclist riding in the group rather than alone into the wind. Choosing your allies is choosing your strength.",
  "A weak day-master is lean, not poor — the traveler who packs half and moves twice as far. You go further by leaning smartly than by carrying everything yourself.",
];

/** One line per favorable element — the rooms that tend to suit you. */
export const FAVORABLE_LINES: Record<Element, string> = {
  wood: "Wood tends to suit you — the room of growth, beginnings, and green patience. Time spent starting and tending things usually repays you.",
  fire: "Fire tends to suit you — the room of warmth, expression, and visibility. Being seen and sharing what you know tends to feed you.",
  earth: "Earth tends to suit you — the room of steadiness, care, and solid ground. Building slowly and holding steady tends to agree with you.",
  metal: "Metal tends to suit you — the room of clarity, craft, and clean decisions. Refining, cutting, and finishing tend to bring out your best.",
  water: "Water tends to suit you — the room of flow, depth, and connection. Moving, linking, and going deep tend to serve you well.",
};

/** Career inclinations per element — rooms you tend to do well in, never instructions. */
export const CAREER_LINES: Record<Element, string> = {
  wood: "Rooms you tend to do well in lean Wood: publishing, botany and agriculture, textiles, early-stage ventures still finding their shape. Growth-stage work tends to fit your grain.",
  fire: "Rooms you tend to do well in lean Fire: teaching and training, media, marketing, food and drink, power and utilities, electronics. Work that puts you in front of people tends to fit.",
  earth: "Rooms you tend to do well in lean Earth: property, construction, consulting, people and HR work, wellness. Work built on trust and steadiness tends to suit you.",
  metal: "Rooms you tend to do well in lean Metal: engineering, hardware, finance operations, law. Work that rewards precision and structure tends to fit your hand.",
  water: "Rooms you tend to do well in lean Water: logistics, trading, communications, tourism. Work that moves and connects tends to agree with you.",
};

/**
 * The You screen's wording (M24-08): how you carry weight, how even you are,
 * the rooms you tend to do well in, and the line beside each element chip.
 * Everyday words only (VOICE.md rule 11); element names appear only as chip
 * labels, never in these lines.
 */

import type { Element } from "@daymaster/bazi-engine";
import type { CardText } from "../../readings/plain/plain-reading.js";

export const STRENGTH_CARDS: Record<"strong" | "weak", CardText> = {
  strong: ["Strong on your own", "You handle a lot unaided. The skill is choosing what to take on."],
  weak: ["Better in good company", "You go further riding with a group than alone into the wind."],
};

export const BALANCE_CARDS = {
  even: ["Well rounded", "No one side of you drowns out the rest. You adapt easily and can be tricky to pin down."],
  leaning: ["One strong note", "One side of you leads the rest. Give the quieter sides a turn now and then."],
  gap: ["Others fill a gap", "People who think differently from you bring what your own mix leaves out."],
} as const satisfies Record<string, CardText>;

export const ROOMS_TITLE = "Rooms you tend to do well in";

/** What each favourable element tends to feel like in a life. */
export const HELPS_YOU: Record<Element, string> = {
  wood: "growth and fresh starts",
  fire: "being seen and sharing what you know",
  earth: "steady, slow building",
  metal: "clear decisions and tidy edges",
  water: "ideas, talk and movement",
};

/** What each unfavourable element tends to feel like when it piles up. */
export const WEARS_YOU: Record<Element, string> = {
  wood: "starting more than you can finish",
  fire: "running hot and always being on show",
  earth: "worry, weight and problems that won't budge",
  metal: "hard rules, sharp words and pressure",
  water: "drift, overthinking and too much talk",
};

/** One small way back to each favourable element, worded apart from its chip line so the screen says it once. */
const EASE_YOU: Record<Element, string> = {
  wood: "start one new project and let it grow at its own pace",
  fire: "show someone what you've been working on",
  earth: "pick one patient job and see it through",
  metal: "make one clean decision and clear one surface",
  water: "go for a walk or ring someone for a chat",
};

/** The ease line, pointing back to the first element that helps. */
export function easeLine(helps: Element): string {
  return `When it wears on you, ${EASE_YOU[helps]}.`;
}

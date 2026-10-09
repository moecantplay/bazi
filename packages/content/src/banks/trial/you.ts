/**
 * TRIAL (2026-10-05 reshape trial build): the You screen's plain cards — how
 * you carry weight, how even you are, the rooms you tend to do well in — and
 * the lines beside each element chip (R15). Everyday words only (VOICE.md
 * rule 11); the element names appear only as chip labels.
 */

import type { Element } from "@daymaster/bazi-engine";
import type { PeriodCardText } from "./period.js";

export const STRENGTH_CARDS: Record<"strong" | "weak", PeriodCardText> = {
  strong: ["Strong on your own", "You carry a lot unaided. The skill is choosing what to carry."],
  weak: ["Better in good company", "You go further riding with a group than alone into the wind."],
};

export const BALANCE_CARDS = {
  even: ["Well rounded", "No one side of you drowns out the rest. You adapt easily and can be hard to pin down."],
  leaning: ["One strong note", "One side of you leads the rest. Give the quieter sides a turn now and then."],
  gap: ["Others fill a gap", "People who think differently from you bring something you don't carry yourself."],
} as const satisfies Record<string, PeriodCardText>;

/** What each favourable element tends to feel like in a life. */
export const HELPS_YOU: Record<Element, string> = {
  wood: "growing and starting things",
  fire: "being seen and sharing what you know",
  earth: "steady, slow building",
  metal: "clear decisions and tidy edges",
  water: "ideas, talk and movement",
};

/** What each unfavourable element tends to feel like when it piles up. */
export const WEARS_YOU: Record<Element, string> = {
  wood: "starting more than you can finish",
  fire: "running hot and always being on show",
  earth: "worry, weight and things that won't budge",
  metal: "hard rules, sharp words and pressure",
  water: "drift, overthinking and too much talk",
};

/** The ease line, pointing back to the first element that helps. */
export function easeLine(helps: Element): string {
  return `When it wears on you, turn back to ${HELPS_YOU[helps]}.`;
}
export const ROOMS_TITLE = "Rooms you tend to do well in";

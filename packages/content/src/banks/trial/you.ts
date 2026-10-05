/**
 * TRIAL (2026-10-05 reshape trial build): the You screen's plain cards — how
 * you carry weight, how even you are, what feeds you, the rooms you tend to do
 * well in. Everyday words only (VOICE.md rule 11).
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
export const FEEDS_YOU: Record<Element, string> = {
  wood: "growing and starting things",
  fire: "being seen and sharing what you know",
  earth: "steady, slow building",
  metal: "clear decisions and tidy edges",
  water: "ideas, talk and movement",
};

export const FEEDS_YOU_TITLE = "What feeds you";
export const ROOMS_TITLE = "Rooms you tend to do well in";

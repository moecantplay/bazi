/**
 * TRIAL (2026-10-05 reshape trial build): People's plain pair lead, keyed by
 * how the two day-masters relate, and plain cards for the pair's sign links.
 * Everyday words only (VOICE.md rule 11).
 */

import type { ElementRelation, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";
import type { PeriodCardText, PeriodLeadText } from "./period.js";

/** Keyed by how your element relates to theirs ("output" = you feed them). */
export const PAIR_LEADS: Record<ElementRelation, PeriodLeadText> = {
  same: {
    headline: "Two of a kind.",
    body: "You two run on the same fuel, which makes you quick to understand each other and quick to compete. Agree early on who leads what.",
    action: "Split one shared job clearly between you.",
  },
  output: {
    headline: "You tend to give more, and it mostly works.",
    body: "You're often the one giving in this pair. Generosity lasts longer when you name its limits, so say what you need too.",
    action: "Tell them one thing you'd like them to do for you.",
  },
  resource: {
    headline: "They tend to look after you.",
    body: "Support tends to flow from them to you. Notice it out loud; thanks keeps the flow from feeling one-way.",
    action: "Thank them for one specific thing this week.",
  },
  wealth: {
    headline: "You tend to set the direction.",
    body: "In this pair, your view often carries the day. Leave room for theirs, and the steering feels shared rather than imposed.",
    action: "Ask their view first on the next decision.",
  },
  officer: {
    headline: "They tend to set the direction.",
    body: "Their view often carries the day in this pair, which can sharpen you or wear on you. Say plainly where you want a say.",
    action: "Name one decision you'd like to make together.",
  },
};

export const PAIR_INTERACTION_CARDS: Record<InteractionType, PeriodCardText> = {
  "six-clash": ["Friction to work through", "You pull in different directions here; talk it out early."],
  punishment: ["An old pattern between you", "The same small argument may recur; name it once."],
  harm: ["Small leaks", "Little irritations add up if they're left unsaid."],
  "six-combine": ["Easy together", "Cooperation comes naturally here."],
  trine: ["A shared drive", "Together you move faster, and faster still with one more on board."],
};

/** Where in your life a pair link lands, as a title suffix. */
export const PAIR_AREA_SUFFIX: Record<LifeArea, string> = {
  work: "around work",
  family: "about family",
  home: "at home",
  plans: "in long-term plans",
};

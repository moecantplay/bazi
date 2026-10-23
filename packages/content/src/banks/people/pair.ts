/**
 * People's plain pair lead, keyed by how the two day-masters relate, and plain
 * cards for the pair's sign links (M24-09). Everyday words only (VOICE.md
 * rule 11).
 */

import type { ElementRelation, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";
import type { CardText } from "../../readings/plain/plain-reading.js";
import type { PeriodLeadText } from "../ahead/period.js";

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

export const PAIR_INTERACTION_CARDS: Record<InteractionType, readonly CardText[]> = {
  "six-clash": [
    ["Friction to work through", "You pull in different directions here; talk it out early."],
    ["Opposite pulls", "When you each want something different, decide together who bends this time."],
    ["Crossed wires", "They may push just when you want to rest, so agree on timing first."],
    ["A tug of war", "Disagreements between you clear faster when you name them the same day."],
  ],
  punishment: [
    ["An old pattern between you", "The same small argument may recur; name it once."],
    ["A familiar loop", "You two may keep circling one sore subject, so settle it properly."],
    ["A repeat quarrel", "When an old disagreement resurfaces, ask what's really behind it."],
    ["Old habits between you", "Habits that grate on each other tend to come back until you talk them through."],
  ],
  harm: [
    ["Small leaks", "Little irritations add up if they're left unsaid."],
    ["Quiet misunderstandings", "They may read you wrong, or you them, so check before assuming."],
    ["Unspoken niggles", "A small kindness between you does a lot to smooth things over."],
    ["Thin patience", "When either of you is tired, small things sting, so pick calm moments to talk."],
  ],
  "six-combine": [
    ["Easy together", "Cooperation comes naturally here."],
    ["A natural fit", "You two tend to agree without much discussion."],
    ["Good partners", "Shared tasks between you tend to go smoothly and quickly."],
    ["In step", "You tend to sense what they need before they ask."],
  ],
  trine: [
    ["A shared drive", "Together you move faster, and faster still with one more on board."],
    ["Common ground", "You two want similar things, which makes plans easy to share."],
    ["Big projects in tandem", "Large undertakings suit you as a pair, since you push the same way."],
    ["Pulling the same way", "When one of you starts something, the other tends to join in."],
  ],
};

/** Where in your life a pair link lands, as a title suffix. */
export const PAIR_AREA_SUFFIX: Record<LifeArea, string> = {
  work: "around work",
  family: "about family",
  home: "at home",
  plans: "in long-term plans",
};

/**
 * What each of you brings out in the other, by the character one day-master
 * sees in the other. A pool, so the two lines differ when both see the same.
 */
export const PAIR_BRINGS: Record<string, readonly string[]> = {
  "Friend": ["Doing it together.", "A teammate for the long haul."],
  "Rob Wealth": ["Pace-setters at your elbow.", "A friendly race to keep up."],
  "Eating God": ["Making for the joy of it.", "Easy laughter and good food."],
  "Hurting Officer": ["A sharp, busy eye.", "The nerve to speak up."],
  "Indirect Wealth": ["Chances off the plan.", "A taste for lucky detours."],
  "Direct Wealth": ["Steady effort pays.", "Patience with the slow work."],
  "Seven Killings": ["Pressure that builds strength.", "Grit when things get hard."],
  "Direct Officer": ["Doing things properly.", "Respect for fair rules."],
  "Indirect Resource": ["Learning your own way.", "Curiosity about odd ideas."],
  "Direct Resource": ["Help comes easily.", "A sense of being looked after."],
};

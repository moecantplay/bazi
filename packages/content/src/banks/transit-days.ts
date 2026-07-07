/**
 * The two always-present daily notes: the element of the day (and whether it
 * suits you), and the day's Ten God relationship to your day master.
 *
 * Ten God lines are keyed off the fact's english label. Every line is texture,
 * never instruction (VOICE.md §4, §5).
 */

import type { Element } from "@daymaster/bazi-engine";
import type { ReadingLine } from "../types.js";
import { elementWord } from "../vocab.js";

/** Element-day lines, split by whether the element is favorable to the reader. */
const ELEMENT_DAY_FAVORABLE: Record<Element, string> = {
  wood: "A Wood day, and Wood tends to suit you. Good grain for starting something small or tending what's already growing.",
  fire: "A Fire day, and Fire tends to suit you. Warmth is on your side — a fair time to be seen or to share what you know.",
  earth: "An Earth day, and Earth tends to suit you. Steady footing; a good grain for building rather than rushing.",
  metal: "A Metal day, and Metal tends to suit you. Clarity comes easier — a fair day to finish, refine, or decide.",
  water: "A Water day, and Water tends to suit you. Things flow more freely; a good grain for connecting or going deep.",
};

const ELEMENT_DAY_UNFAVORABLE: Record<Element, string> = {
  wood: "A Wood day, which runs a little against your grain. Beginnings may feel effortful — pace them rather than force them.",
  fire: "A Fire day, which isn't quite your grain. The tempo runs fast and bright; let it pass through without chasing it.",
  earth: "An Earth day, which sits a little heavy for you. Things may feel slow — treat it as ballast, not a wall.",
  metal: "A Metal day, which cuts against your grain slightly. Edges feel sharper; softer handling goes further.",
  water: "A Water day, which runs a bit against your grain. Focus can drift — give it a channel and it settles.",
};

/** Every element-day line, for exhaustive voice checking. */
export const ELEMENT_DAY_TEMPLATES: readonly string[] = [
  ...Object.values(ELEMENT_DAY_FAVORABLE),
  ...Object.values(ELEMENT_DAY_UNFAVORABLE),
];

/** Build the element-day line. */
export function elementDayLine(element: Element, favorable: boolean): ReadingLine {
  const table = favorable ? ELEMENT_DAY_FAVORABLE : ELEMENT_DAY_UNFAVORABLE;
  const text = table[element];
  const factTag = `${elementWord(element)} day${favorable ? " · suits you" : ""}`;
  return { text, factTag };
}

/** Ten God lines keyed by the english label the engine emits. */
const TEN_GOD_LINES: Record<string, string> = {
  Friend:
    "The day carries a Friend note (比肩) — peers at your table, people carrying the same pack you do. A grain that favors doing it together over going it alone.",
  "Rob Wealth":
    "The day carries a Rob Wealth note (劫财) — friendly rivalry, the housemate who eats your leftovers and still makes you laugh. Good drive; keep an eye on what it spends.",
  "Eating God":
    "The day carries an Eating God note (食神) — the part of you that cooks for friends rather than for a review. A pleasant grain for making and enjoying without a scoreboard.",
  "Hurting Officer":
    "The day carries a Hurting Officer note (伤官) — the witty rule-bender who improves the recipe and annoys the chef. Bright for creating, restless inside anyone else's format.",
  "Indirect Wealth":
    "The day carries an Indirect Wealth note (偏财) — the lucky find, chances that arrive sideways like a good parking spot. Light and mobile; hold it loosely.",
  "Direct Wealth":
    "The day carries a Direct Wealth note (正财) — the earned paycheck, value that arrives because you showed up all month. A grain that rewards patience and care.",
  "Seven Killings":
    "The day carries a Seven Killings note (七杀) — pressure that trains you, the coach who makes you run the hill again. Met squarely, it forges rather than breaks.",
  "Direct Officer":
    "The day carries a Direct Officer note (正官) — the dependable rule-keeper, the part of you that files it properly and sleeps well. A grain that favors order and follow-through.",
  "Indirect Resource":
    "The day carries an Indirect Resource note (偏印) — insight from the odd angle, the answer that arrives in the shower. Good for thinking sideways and learning strangely.",
  "Direct Resource":
    "The day carries a Direct Resource note (正印) — being looked after, the friend who brings soup without being asked. A grain that favors rest and taking things in.",
};

const TEN_GOD_GENERIC =
  "The day carries a distinct ten-god note — one of ten flavors of how the day's stem relates to yours. Read it as texture for today, not instruction.";

/** Every ten-god line including the generic fallback, for exhaustive voice checking. */
export const TEN_GOD_TEMPLATES: readonly string[] = [
  ...Object.values(TEN_GOD_LINES),
  TEN_GOD_GENERIC,
];

/** Build the ten-god-day line, with a safe fallback for unknown labels. */
export function tenGodDayLine(english: string, chinese: string): ReadingLine {
  const text = TEN_GOD_LINES[english] ?? TEN_GOD_GENERIC;
  const factTag = TEN_GOD_LINES[english] ? `${english} · ${chinese}` : "ten-god note";
  return { text, factTag };
}

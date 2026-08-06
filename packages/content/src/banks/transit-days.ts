/**
 * The two always-present daily notes: the element of the day (and whether it
 * suits you), and the day's Ten God relationship to your day master.
 *
 * Ten God lines are keyed off the fact's english label. Every line is texture,
 * never instruction (VOICE.md §4, §5).
 */

import type { Element } from "@daymaster/bazi-engine";
import type { DraftLine } from "../types.js";
import type { TokenLine } from "../tokens.js";
import { elementWord, TEN_GOD_CHINESE, TEN_GOD_GLOSSES } from "../vocab.js";

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
export function elementDayLine(element: Element, favorable: boolean): DraftLine {
  const table = favorable ? ELEMENT_DAY_FAVORABLE : ELEMENT_DAY_UNFAVORABLE;
  const text = table[element];
  const factTag = `${elementWord(element)} day${favorable ? " · suits you" : ""}`;
  return { text, factTag, topic: "elements" };
}

/**
 * Ten God lines keyed by the english label the engine emits. Each line opens
 * on the classical name — framed as the old name, never as a bare subject —
 * and follows with the modern understanding in full (VOICE.md §11).
 */
const TEN_GOD_LINES: Record<string, string> = {
  Friend:
    "The old calendars call today a Friend day (比肩) — in everyday terms, peers at your table, people carrying the same pack you do. A grain that favors doing it together over going it alone.",
  "Rob Wealth":
    "The old books name today Rob Wealth (劫财) — in modern terms, friendly rivalry: the housemate who eats your leftovers and still makes you laugh. Good drive; keep an eye on what it spends.",
  "Eating God":
    "The old calendars call today an Eating God day (食神) — put plainly, making for the joy of it, cooking for friends rather than for a review. A pleasant grain for enjoying without a scoreboard.",
  "Hurting Officer":
    "The old books name today Hurting Officer (伤官) — in everyday terms, the witty rule-bender who improves the recipe and annoys the chef. Bright for creating, restless inside anyone else's format.",
  "Indirect Wealth":
    "The old calendars call today an Indirect Wealth day (偏财) — in modern terms, the lucky find: chances that arrive sideways like a good parking spot. Light and mobile; hold them loosely.",
  "Direct Wealth":
    "The old books name today Direct Wealth (正财) — put plainly, the earned paycheck: value that arrives because you showed up all month. A grain that rewards patience and care.",
  "Seven Killings":
    "The old calendars call today a Seven Killings day (七杀) — in everyday terms, pressure that trains you, the coach who makes you run the hill again. Met squarely, it forges rather than breaks.",
  "Direct Officer":
    "The old books name today Direct Officer (正官) — in modern terms, doing things properly: kept promises, tidy paperwork, the part of you that sleeps well. A grain that favors order and follow-through.",
  "Indirect Resource":
    "The old calendars call today an Indirect Resource day (偏印) — put plainly, learning by your own strange route: answers that arrive in the shower or mid-walk. Good for thinking sideways and learning strangely.",
  "Direct Resource":
    "The old books name today Direct Resource (正印) — in everyday terms, being looked after, the friend who brings soup without being asked. A grain that favors rest and taking things in.",
};

/**
 * Structured equivalent of {@link TEN_GOD_LINES}, authored directly as runs
 * rather than derived from the strings above (VOICE.md §11's exemplar case:
 * the classical name opens the line, framed as a name, then the same breath
 * carries the modern understanding in full). The term run's `gloss` is the
 * canonical short gloss from `TEN_GOD_GLOSSES`; the surrounding text runs
 * carry the fuller sentence the reader actually reads. `han` carries the
 * classical characters structurally — no presenter renders it this
 * milestone (decision F), so the parenthetical the string version needs
 * ("Friend day (比肩)") simply isn't needed in the run sequence.
 */
const TEN_GOD_LINE_RUNS: Record<string, TokenLine> = {
  Friend: [
    { kind: "text", text: "The old calendars call today a " },
    {
      kind: "term",
      term: "Friend",
      gloss: TEN_GOD_GLOSSES.Friend as string,
      han: TEN_GOD_CHINESE.Friend as string,
    },
    {
      kind: "text",
      text: " day — in everyday terms, peers at your table, people carrying the same pack you do. A grain that favors doing it together over going it alone.",
    },
  ],
  "Rob Wealth": [
    { kind: "text", text: "The old books name today " },
    {
      kind: "term",
      term: "Rob Wealth",
      gloss: TEN_GOD_GLOSSES["Rob Wealth"] as string,
      han: TEN_GOD_CHINESE["Rob Wealth"] as string,
    },
    {
      kind: "text",
      text: " — in modern terms, friendly rivalry: the housemate who eats your leftovers and still makes you laugh. Good drive; keep an eye on what it spends.",
    },
  ],
  "Eating God": [
    { kind: "text", text: "The old calendars call today an " },
    {
      kind: "term",
      term: "Eating God",
      gloss: TEN_GOD_GLOSSES["Eating God"] as string,
      han: TEN_GOD_CHINESE["Eating God"] as string,
    },
    {
      kind: "text",
      text: " day — put plainly, making for the joy of it, cooking for friends rather than for a review. A pleasant grain for enjoying without a scoreboard.",
    },
  ],
  "Hurting Officer": [
    { kind: "text", text: "The old books name today " },
    {
      kind: "term",
      term: "Hurting Officer",
      gloss: TEN_GOD_GLOSSES["Hurting Officer"] as string,
      han: TEN_GOD_CHINESE["Hurting Officer"] as string,
    },
    {
      kind: "text",
      text: " — in everyday terms, the witty rule-bender who improves the recipe and annoys the chef. Bright for creating, restless inside anyone else's format.",
    },
  ],
  "Indirect Wealth": [
    { kind: "text", text: "The old calendars call today an " },
    {
      kind: "term",
      term: "Indirect Wealth",
      gloss: TEN_GOD_GLOSSES["Indirect Wealth"] as string,
      han: TEN_GOD_CHINESE["Indirect Wealth"] as string,
    },
    {
      kind: "text",
      text: " day — in modern terms, the lucky find: chances that arrive sideways like a good parking spot. Light and mobile; hold them loosely.",
    },
  ],
  "Direct Wealth": [
    { kind: "text", text: "The old books name today " },
    {
      kind: "term",
      term: "Direct Wealth",
      gloss: TEN_GOD_GLOSSES["Direct Wealth"] as string,
      han: TEN_GOD_CHINESE["Direct Wealth"] as string,
    },
    {
      kind: "text",
      text: " — put plainly, the earned paycheck: value that arrives because you showed up all month. A grain that rewards patience and care.",
    },
  ],
  "Seven Killings": [
    { kind: "text", text: "The old calendars call today a " },
    {
      kind: "term",
      term: "Seven Killings",
      gloss: TEN_GOD_GLOSSES["Seven Killings"] as string,
      han: TEN_GOD_CHINESE["Seven Killings"] as string,
    },
    {
      kind: "text",
      text: " day — in everyday terms, pressure that trains you, the coach who makes you run the hill again. Met squarely, it forges rather than breaks.",
    },
  ],
  "Direct Officer": [
    { kind: "text", text: "The old books name today " },
    {
      kind: "term",
      term: "Direct Officer",
      gloss: TEN_GOD_GLOSSES["Direct Officer"] as string,
      han: TEN_GOD_CHINESE["Direct Officer"] as string,
    },
    {
      kind: "text",
      text: " — in modern terms, doing things properly: kept promises, tidy paperwork, the part of you that sleeps well. A grain that favors order and follow-through.",
    },
  ],
  "Indirect Resource": [
    { kind: "text", text: "The old calendars call today an " },
    {
      kind: "term",
      term: "Indirect Resource",
      gloss: TEN_GOD_GLOSSES["Indirect Resource"] as string,
      han: TEN_GOD_CHINESE["Indirect Resource"] as string,
    },
    {
      kind: "text",
      text: " day — put plainly, learning by your own strange route: answers that arrive in the shower or mid-walk. Good for thinking sideways and learning strangely.",
    },
  ],
  "Direct Resource": [
    { kind: "text", text: "The old books name today " },
    {
      kind: "term",
      term: "Direct Resource",
      gloss: TEN_GOD_GLOSSES["Direct Resource"] as string,
      han: TEN_GOD_CHINESE["Direct Resource"] as string,
    },
    {
      kind: "text",
      text: " — in everyday terms, being looked after, the friend who brings soup without being asked. A grain that favors rest and taking things in.",
    },
  ],
};

const TEN_GOD_GENERIC =
  "The day carries a distinct ten-god note — one of ten flavors of how the day's stem relates to yours. Read it as texture for today, not instruction.";

/** Every ten-god line including the generic fallback, for exhaustive voice checking. */
export const TEN_GOD_TEMPLATES: readonly string[] = [
  ...Object.values(TEN_GOD_LINES),
  TEN_GOD_GENERIC,
];

/** Build the ten-god-day line, with a safe fallback for unknown labels. */
export function tenGodDayLine(english: string, chinese: string): DraftLine {
  const known = TEN_GOD_LINES[english] !== undefined;
  const text = TEN_GOD_LINES[english] ?? TEN_GOD_GENERIC;
  const factTag = known ? `${english} · ${chinese}` : "ten-god note";
  const runs: TokenLine = TEN_GOD_LINE_RUNS[english] ?? [{ kind: "text", text: TEN_GOD_GENERIC }];
  const factTagRuns: TokenLine = known
    ? [{ kind: "term", term: english, gloss: TEN_GOD_GLOSSES[english] ?? english, han: chinese }]
    : [{ kind: "text", text: "ten-god note" }];
  return { text, factTag, topic: known ? `ten-god:${english}` : "ten-gods", runs, factTagRuns };
}

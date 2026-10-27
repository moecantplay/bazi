/**
 * The You screen (M24-08): the day-master portrait as the lead, plain cards
 * for what shapes you, then your elements and your colours. Presentation hands
 * over the favourable/unfavourable split; this only phrases it (no chart math
 * here). Selection is fixed per fact, so the same chart always reads the same.
 */

import type { Element, NatalFact } from "@daymaster/bazi-engine";
import { COLOURS_WHERE, ELEMENT_COLOURS, STAPLE_ORDER, colourFixLine, type Colour } from "../../banks/colours.js";
import { DAY_MASTER_LINES } from "../../banks/day-master.js";
import { CAREER_LINES } from "../../banks/elements.js";
import { portraitLine, portraitRest } from "../../banks/you/portrait.js";
import { BALANCE_CARDS, HELPS_YOU, ROOMS_TITLE, STRENGTH_CARDS, WEARS_YOU, easeLine } from "../../banks/you/you.js";
import { pick } from "../../hash.js";
import { capitalise, card, factOf, type PlainCard, type PlainReading } from "../plain/plain-reading.js";

export interface ElementLine {
  element: Element;
  line: string;
}

/** The elements that help you and the ones that wear you down, each with a plain line. */
export interface YouElements {
  helps: ElementLine[];
  wears: ElementLine[];
  ease: string;
}

/** Colours that suit you and colours to go easy on, from the same split. */
export interface YouColours {
  suit: Colour[];
  easyOn: Colour[];
  where: string;
  fix: string | null;
}

/** The portrait lead and the What shapes you cards, or null without a day-master. */
export function youReading(facts: readonly NatalFact[], seedKey: string): PlainReading | null {
  const dayMaster = factOf(facts, "day-master");
  if (!dayMaster) {
    return null;
  }
  const lines = DAY_MASTER_LINES[dayMaster.stem];
  const cards: PlainCard[] = [];

  const strength = factOf(facts, "strength");
  if (strength) {
    cards.push(card("strength", STRENGTH_CARDS[strength.value]));
  }

  const balance = factOf(facts, "element-balance");
  if (balance) {
    const counts = Object.values(balance.counts);
    const shape = balance.missing.length > 0 ? "gap" : Math.max(...counts) - Math.min(...counts) <= 2 ? "even" : "leaning";
    cards.push(card("element-balance", BALANCE_CARDS[shape]));
  }

  const favorable = factOf(facts, "favorable");
  if (favorable && favorable.elements.length > 0) {
    const careerElement = pick(favorable.elements, seedKey, `career:${favorable.elements.join("")}`);
    const rooms = CAREER_LINES[careerElement].replace(/^\w+ inclines you to fields such as /, "");
    cards.push({ topic: "favorable", title: ROOMS_TITLE, line: capitalise(rooms) });
  }

  return {
    lead: {
      headline: portraitLine(dayMaster.stem),
      body: [portraitRest(dayMaster.stem), lines[1] ?? ""].filter(Boolean).join(" "),
      action: lines[2] ?? "",
      topic: "day-master",
    },
    cards,
  };
}

/** Your elements, or null with nothing favourable to lead with. */
export function youElements(helps: readonly Element[], wears: readonly Element[]): YouElements | null {
  const [first] = helps;
  if (first === undefined) {
    return null;
  }
  return {
    helps: helps.map((element) => ({ element, line: capitalise(HELPS_YOU[element]) })),
    wears: wears.map((element) => ({ element, line: capitalise(WEARS_YOU[element]) })),
    ease: easeLine(first),
  };
}

/** Your colours, or null with nothing favourable to lead with. */
export function youColours(helps: readonly Element[], wears: readonly Element[]): YouColours | null {
  const [helper] = helps;
  if (helper === undefined) {
    return null;
  }
  const staple = STAPLE_ORDER.find((element) => wears.includes(element));
  return {
    suit: helps.flatMap((element) => ELEMENT_COLOURS[element]),
    easyOn: wears.flatMap((element) => ELEMENT_COLOURS[element]),
    where: COLOURS_WHERE,
    fix: staple === undefined ? null : colourFixLine(ELEMENT_COLOURS[staple][0], ELEMENT_COLOURS[helper][0]),
  };
}

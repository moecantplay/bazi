/**
 * TRIAL (2026-10-05 reshape trial build): plain readings for Ahead's periods,
 * the You screen and People's pairs — one lead (headline → body → one thing to
 * try) and plain cards for the rest, the same shape Today uses (M20-21).
 * Selection is fixed per fact, so the same facts always read the same.
 */

import type { CompareFact, Element, ReadingFact } from "@daymaster/bazi-engine";
import { CAREER_LINES } from "../../banks/elements.js";
import { DAY_MASTER_LINES } from "../../banks/day-master.js";
import { PAIR_AREA_SUFFIX, PAIR_INTERACTION_CARDS, PAIR_LEADS } from "../../banks/trial/pair.js";
import {
  PERIOD_ELEMENT_SENTENCES,
  PERIOD_INTERACTION_CARDS,
  PERIOD_LEADS,
  PERIOD_QUIET_LEADS,
  PERIOD_TEN_GOD_CARDS,
  type PeriodCardText,
  type PeriodLeadText,
} from "../../banks/trial/period.js";
import { portraitLine, portraitRest } from "../../banks/trial/portrait.js";
import { BALANCE_CARDS, HELPS_YOU, ROOMS_TITLE, STRENGTH_CARDS, WEARS_YOU, easeLine } from "../../banks/trial/you.js";
import { pick } from "../../hash.js";
import { interactionTopic, rankTransits } from "../daily/lead.js";
import { lifeAreaOf } from "../daily/life-areas.js";

export interface PlainLead {
  headline: string;
  body: string;
  action: string;
  topic: string;
}

export interface PlainCard {
  topic: string;
  title: string;
  line: string;
}

export interface PlainReading {
  lead: PlainLead;
  cards: PlainCard[];
}

export type PeriodSpan = "month" | "year" | "decade";

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

function factOf<K extends ReadingFact["kind"]>(facts: readonly ReadingFact[], kind: K): FactOf<K> | undefined {
  return facts.find((fact): fact is FactOf<K> => fact.kind === kind);
}

function card(topic: string, [title, line]: PeriodCardText): PlainCard {
  return { topic, title, line };
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A month's, year's or decade's reading from its period facts. */
export function periodReading(facts: readonly ReadingFact[], span: PeriodSpan): PlainReading {
  const fill = (text: string) => text.replaceAll("{span}", `this ${span}`);
  const ranked = rankTransits(facts);
  const strongest = ranked[0];
  const tenGod = factOf(facts, "ten-god-period");
  const element = factOf(facts, "element-period");

  const god = tenGod?.english ?? "Friend";
  const leadText: PeriodLeadText = strongest
    ? PERIOD_LEADS[strongest.interaction][lifeAreaOf(strongest.natalPalaces[0])]
    : (PERIOD_QUIET_LEADS[god] ?? PERIOD_QUIET_LEADS["Friend"]!);
  const leadTopic = strongest ? interactionTopic(strongest) : `ten-god:${god}`;
  const elementSentence = element ? ` ${PERIOD_ELEMENT_SENTENCES[element.element][element.favorable ? "suits" : "against"]}` : "";

  const cards: PlainCard[] = [];
  const seen = new Set([leadTopic]);
  for (const fact of ranked) {
    const topic = interactionTopic(fact);
    if (seen.has(topic)) {
      continue;
    }
    seen.add(topic);
    cards.push(card(topic, PERIOD_INTERACTION_CARDS[fact.interaction][lifeAreaOf(fact.natalPalaces[0])]));
  }
  if (strongest && tenGod) {
    cards.push(card(`ten-god:${god}`, PERIOD_TEN_GOD_CARDS[god] ?? PERIOD_TEN_GOD_CARDS["Friend"]!));
  }

  return {
    lead: {
      headline: fill(leadText.headline),
      body: fill(`${leadText.body}${elementSentence}`),
      action: leadText.action,
      topic: leadTopic,
    },
    cards: cards.map((entry) => ({ ...entry, title: fill(entry.title), line: fill(entry.line) })),
  };
}

export interface ElementLine {
  element: Element;
  line: string;
}

/** R15: the elements that help you and the ones that wear you down, each with a plain line. */
export interface YouElements {
  helps: ElementLine[];
  wears: ElementLine[];
  ease: string;
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

/** The You screen: the day-master portrait as the lead, plain cards after. */
export function youReading(facts: readonly ReadingFact[], seedKey: string): PlainReading | null {
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
    const rooms = CAREER_LINES[careerElement].replace(/^Rooms you tend to do well in lean \w+: /, "");
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

/** People: how the two of you meet, from the pair's compare facts. */
export function pairReading(facts: readonly CompareFact[]): PlainReading | null {
  const dayMasters = facts.find((fact): fact is Extract<CompareFact, { kind: "compare-day-masters" }> => fact.kind === "compare-day-masters");
  if (!dayMasters) {
    return null;
  }
  const leadText = PAIR_LEADS[dayMasters.relation];
  const cards: PlainCard[] = [];
  const seen = new Set<string>();
  for (const fact of facts) {
    if (fact.kind !== "compare-interaction") {
      continue;
    }
    const area = lifeAreaOf(fact.aPalace);
    const topic = `pair:${fact.interaction}:${area}`;
    if (seen.has(topic)) {
      continue;
    }
    seen.add(topic);
    const [title, line] = PAIR_INTERACTION_CARDS[fact.interaction];
    cards.push({ topic, title: `${title} ${PAIR_AREA_SUFFIX[area]}`, line });
  }
  const theyBring = PERIOD_TEN_GOD_CARDS[dayMasters.aSeesB.english];
  if (theyBring) {
    cards.push({ topic: `ten-god:${dayMasters.aSeesB.english}`, title: "What they bring out in you", line: `${theyBring[0]}.` });
  }
  const youBring = PERIOD_TEN_GOD_CARDS[dayMasters.bSeesA.english];
  if (youBring) {
    cards.push({ topic: `ten-god:${dayMasters.bSeesA.english}`, title: "What you bring them", line: `${youBring[0]}.` });
  }
  return { lead: { ...leadText, topic: `relation:${dayMasters.relation}` }, cards };
}

/**
 * Ahead's seasons (M24-07): a month's, year's or decade's plain reading from
 * its period facts. The strongest link to the reader's chart leads (the same
 * severity order Today uses); a quiet period leads with its character. Every
 * other link becomes a card. Selection is fixed per fact, so the same period
 * always reads the same.
 */

import type { ReadingFact } from "@daymaster/bazi-engine";
import {
  PERIOD_ELEMENT_SENTENCES,
  PERIOD_INTERACTION_CARDS,
  PERIOD_LEADS,
  PERIOD_QUIET_LEADS,
  PERIOD_TEN_GOD_CARDS,
  type PeriodLeadText,
} from "../../banks/ahead/period.js";
import { interactionTopic, rankTransits } from "../daily/lead.js";
import { lifeAreaOf } from "../daily/life-areas.js";
import { card, factOf, type PlainCard, type PlainReading } from "../plain/plain-reading.js";

export type PeriodSpan = "month" | "year" | "decade";

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

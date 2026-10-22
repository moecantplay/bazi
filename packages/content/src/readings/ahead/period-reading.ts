/**
 * Ahead's seasons (M24-07): a month's, year's or decade's plain reading from
 * its period facts. The strongest link to the reader's chart leads (the same
 * severity order Today uses); a quiet period leads with its character. Every
 * other link becomes a card. Each slot steps through its pool by the period's
 * number (M24-11), so neighbouring months and years read differently and the
 * same period always reads the same.
 */

import type { PeriodFact } from "@daymaster/bazi-engine";
import {
  PERIOD_ELEMENT_SENTENCES,
  PERIOD_INTERACTION_CARDS,
  PERIOD_LEADS,
  PERIOD_QUIET_LEADS,
  PERIOD_TEN_GOD_CARDS,
} from "../../banks/ahead/period.js";
import { steppedPicker, type Picker, type RotationSlot } from "../../rotation.js";
import { interactionTopic, rankTransits } from "../daily/lead.js";
import { lifeAreaOf } from "../daily/life-areas.js";
import { card, factOf, type PlainCard, type PlainReading } from "../plain/plain-reading.js";

export type PeriodSpan = "month" | "year" | "decade";

/** What a period's pools step by: the chart's seed and the period's number. */
export interface PeriodSeed {
  chart: string;
  step: number;
}

function compose(facts: readonly PeriodFact[], span: PeriodSpan, pick: Picker): PlainReading {
  const fill = (text: string) => text.replaceAll("{span}", `this ${span}`);
  const ranked = rankTransits(facts);
  const strongest = ranked[0];
  const tenGod = factOf(facts, "ten-god-period");
  const element = factOf(facts, "element-period");

  const god = tenGod?.english ?? "Friend";
  const leadText = strongest
    ? pick(PERIOD_LEADS[strongest.interaction][lifeAreaOf(strongest.natalPalaces[0])], `${span}:lead:${strongest.interaction}:${lifeAreaOf(strongest.natalPalaces[0])}`)
    : pick(PERIOD_QUIET_LEADS[god] ?? PERIOD_QUIET_LEADS["Friend"]!, `${span}:lead:quiet:${god}`);
  const leadTopic = strongest ? interactionTopic(strongest) : `ten-god:${god}`;
  const tone = element?.favorable ? "suits" : "against";
  const elementSentence = element ? ` ${pick(PERIOD_ELEMENT_SENTENCES[element.element][tone], `${span}:element:${element.element}:${tone}`)}` : "";

  const cards: PlainCard[] = [];
  const seen = new Set([leadTopic]);
  for (const fact of ranked) {
    const topic = interactionTopic(fact);
    if (seen.has(topic)) {
      continue;
    }
    seen.add(topic);
    cards.push(card(topic, pick(PERIOD_INTERACTION_CARDS[fact.interaction][lifeAreaOf(fact.natalPalaces[0])], `${span}:card:${topic}`)));
  }
  if (strongest && tenGod) {
    cards.push(card(`ten-god:${god}`, pick(PERIOD_TEN_GOD_CARDS[god] ?? PERIOD_TEN_GOD_CARDS["Friend"]!, `${span}:card:ten-god:${god}`)));
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

export function periodReading(facts: readonly PeriodFact[], span: PeriodSpan, seed: PeriodSeed): PlainReading {
  return compose(facts, span, steppedPicker(seed.chart, seed.step));
}

/** Every slot a period's reading picks under, with its pool size (for the pool-minimum test). */
export function periodSlots(facts: readonly PeriodFact[], span: PeriodSpan): RotationSlot[] {
  const slots: RotationSlot[] = [];
  compose(facts, span, steppedPicker("", 0, slots));
  return slots;
}

/**
 * The plain cards below Today's first screen: every fact the first screen
 * didn't use, in a fixed order (other sign links, element, the day's
 * character, hours, pace, small signs). Each card's "Read more" opens its
 * topic page.
 */

import type { DayFact } from "@daymaster/bazi-engine";
import { cyclePick, dayNumber } from "../../hash.js";
import { textRun, type TokenLine } from "../../tokens.js";
import type { DailySeed, TopicCard } from "../../types.js";
import { hourWindowLabel } from "../../vocab.js";
import {
  CARD_KICKERS,
  ELEMENT_CARDS,
  INTERACTION_CARDS,
  STAGE_CARDS,
  STAR_TITLES,
  TEN_GOD_CARDS,
  type CardText,
} from "../../banks/daily/cards.js";
import { BEST_HOUR_LINES } from "../../banks/topics/day.js";
import { interactionTopic, rankTransits, type Lead, type Modifier } from "./lead.js";
import { lifeAreaOf } from "./life-areas.js";

type FactOf<K extends DayFact["kind"]> = Extract<DayFact, { kind: K }>;

function factOf<K extends DayFact["kind"]>(facts: readonly DayFact[], kind: K): FactOf<K> | undefined {
  return facts.find((fact): fact is FactOf<K> => fact.kind === kind);
}

function card(topic: string, kicker: string, [title, line]: CardText): TopicCard {
  return { topic, kicker, titles: [textRun(title)], line: textRun(line), note: null };
}

function bestHourNote(bestHour: FactOf<"best-hour"> | undefined): TokenLine | null {
  if (!bestHour) {
    return null;
  }
  return textRun(bestHour.isEasyHour ? BEST_HOUR_LINES.cardIsEasyHour : BEST_HOUR_LINES.card(hourWindowLabel(bestHour.startHour, bestHour.endHour)));
}

/** Every non-lead fact as a plain card. */
export function topicCards(facts: readonly DayFact[], lead: Lead, modifier: Modifier | null, seed: DailySeed): TopicCard[] {
  const cards: TopicCard[] = [];

  for (const fact of rankTransits(facts)) {
    const topic = interactionTopic(fact);
    if (topic === lead.topic) {
      continue;
    }
    const pool = INTERACTION_CARDS[fact.interaction][lifeAreaOf(fact.natalPalaces[0])];
    cards.push(card(topic, CARD_KICKERS.interaction, cyclePick(pool, seed.chart, `card:${topic}`, dayNumber(seed.date))));
  }

  const element = factOf(facts, "element-day");
  if (element && !modifier) {
    const text = ELEMENT_CARDS[element.element][element.favorable ? "suits" : "against"];
    cards.push(card(`element:${element.element}`, CARD_KICKERS.element, text));
  }

  const tenGod = factOf(facts, "ten-god-day");
  if (tenGod && lead.kind !== "quiet") {
    const text = TEN_GOD_CARDS[tenGod.english] ?? TEN_GOD_CARDS["Friend"]!;
    cards.push(card(`ten-god:${tenGod.english}`, CARD_KICKERS.tenGod, text));
  }

  const hours = facts.filter((fact): fact is FactOf<"hour-interaction"> => fact.kind === "hour-interaction");
  const easy = hours.find((fact) => fact.interaction === "six-combine");
  const rough = hours.find((fact) => fact.interaction === "six-clash");
  if (easy && rough) {
    cards.push({
      topic: "hours",
      kicker: CARD_KICKERS.hours,
      titles: [textRun(`Easiest ${hourWindowLabel(easy.startHour, easy.endHour)}`)],
      line: textRun(`Roughest ${hourWindowLabel(rough.startHour, rough.endHour)}.`),
      note: bestHourNote(factOf(facts, "best-hour")),
    });
  }

  const stage = factOf(facts, "stage-day");
  if (stage) {
    const text = STAGE_CARDS[stage.stage.english] ?? ["Your pace today", "Take the day at the speed it offers."];
    cards.push(card(`stage:${stage.stage.english}`, CARD_KICKERS.stage, text));
  }

  const stars = facts.filter((fact): fact is FactOf<"star-day"> => fact.kind === "star-day");
  if (stars.length > 0) {
    cards.push({
      topic: "stars",
      kicker: CARD_KICKERS.stars,
      titles: stars.map((star) => textRun(STAR_TITLES[star.star] ?? "A small sign today")),
      line: null,
      note: null,
    });
  }

  return cards;
}

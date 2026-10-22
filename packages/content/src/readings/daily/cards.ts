/**
 * The plain cards below Today's first screen: every fact the first screen
 * didn't use, in a fixed order (other sign links, element, the day's
 * character, hours, pace, small signs). Each card's "Read more" opens its
 * topic page. Each card steps through its pool by visit (rotation.ts), except
 * the hours card's times and the star titles, which name their sign on the
 * small-signs page. The hours card's best-hour note does rotate.
 */

import type { DayFact } from "@daymaster/bazi-engine";
import { textRun, type TokenLine } from "../../tokens.js";
import { fillSlots, type Picker } from "../../rotation.js";
import type { TopicCard } from "../../types.js";
import { hourWindowLabel } from "../../vocab.js";
import {
  CARD_KICKERS,
  ELEMENT_CARDS,
  INTERACTION_CARDS,
  STAGE_CARDS,
  STAGE_CARD_FALLBACK,
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

function bestHourNote(bestHour: FactOf<"best-hour"> | undefined, pick: Picker): TokenLine | null {
  if (!bestHour) {
    return null;
  }
  if (bestHour.isEasyHour) {
    return textRun(pick(BEST_HOUR_LINES.cardIsEasyHour, "best-hour:easy"));
  }
  const window = hourWindowLabel(bestHour.startHour, bestHour.endHour);
  return textRun(fillSlots(pick(BEST_HOUR_LINES.card, "best-hour:window"), { window }));
}

/** Every non-lead fact as a plain card. */
export function topicCards(facts: readonly DayFact[], lead: Lead, modifier: Modifier | null, pick: Picker): TopicCard[] {
  const cards: TopicCard[] = [];

  for (const fact of rankTransits(facts)) {
    const topic = interactionTopic(fact);
    if (topic === lead.topic) {
      continue;
    }
    const pool = INTERACTION_CARDS[fact.interaction][lifeAreaOf(fact.natalPalaces[0])];
    cards.push(card(topic, CARD_KICKERS.interaction, pick(pool, `card:${topic}`)));
  }

  const element = factOf(facts, "element-day");
  if (element && !modifier) {
    const tone = element.favorable ? "suits" : "against";
    const text = pick(ELEMENT_CARDS[element.element][tone], `card:element:${element.element}:${tone}`);
    cards.push(card(`element:${element.element}`, CARD_KICKERS.element, text));
  }

  const tenGod = factOf(facts, "ten-god-day");
  if (tenGod && lead.kind !== "quiet") {
    const text = pick(TEN_GOD_CARDS[tenGod.english] ?? TEN_GOD_CARDS["Friend"]!, `card:ten-god:${tenGod.english}`);
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
      note: bestHourNote(factOf(facts, "best-hour"), pick),
    });
  }

  const stage = factOf(facts, "stage-day");
  if (stage) {
    const text = pick(STAGE_CARDS[stage.stage.english] ?? [STAGE_CARD_FALLBACK], `card:stage:${stage.stage.english}`);
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

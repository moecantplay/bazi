/**
 * A topic page (M20-21 R11): the long form behind one of Today's cards, or
 * behind the reading itself. Found by the card's topic key among the day's
 * facts; null when the key names nothing the day carries.
 */

import type { Branch, DayFact } from "@daymaster/bazi-engine";
import { textRun } from "../tokens.js";
import type { DailySeed, TopicContext, TopicPage } from "../types.js";
import { BRANCH_ANIMALS, elementWord, hourWindowLabel } from "../vocab.js";
import { pickerFor, type Picker } from "../rotation.js";
import { ELEMENT_CARDS, STAGE_CARDS, STAGE_CARD_FALLBACK, STAR_TITLES, TEN_GOD_CARDS } from "../banks/daily/cards.js";
import { AREA_SIGN_SUBJECT, AREA_TITLE_PHRASE, INTERACTION_TOPICS } from "../banks/topics/interactions.js";
import {
  ELEMENT_NAME_ORIGIN,
  ELEMENT_TOPIC,
  BEST_HOUR_LINES,
  HOURS_TOPIC,
  QUIET_FOR_YOU,
  STAGE_NAME_ORIGIN,
  STAGE_WORK,
  STARS_NAME_ORIGIN,
  STAR_LINES,
  TEN_GOD_NAME_ORIGIN,
  TEN_GOD_TOPICS,
} from "../banks/topics/day.js";
import { ELEMENT_SUITS, INTERACTION_SUITS, STAGE_SUITS, TEN_GOD_SUITS, type TopicSuits } from "../banks/topics/suits.js";
import { TOPIC_CLOSING } from "../banks/topics/depth.js";
import { interactionTopic, rankTransits, type TransitFact } from "./daily/lead.js";
import { deepenTopicPage } from "./topic-depth.js";
import { lifeAreaOf } from "./daily/life-areas.js";

type FactOf<K extends DayFact["kind"]> = Extract<DayFact, { kind: K }>;

function page(fields: Partial<TopicPage> & Pick<TopicPage, "title" | "nameOrigin">): TopicPage {
  return {
    oldName: null,
    forYou: null,
    how: [],
    goodFor: [],
    holdOff: [],
    work: [],
    stars: [],
    tagline: null,
    where: [],
    sore: null,
    visual: null,
    recurrences: [],
    closing: textRun(TOPIC_CLOSING),
    ...fields,
  };
}

function suits(entry: TopicSuits | undefined): Pick<TopicPage, "goodFor" | "holdOff"> {
  return { goodFor: lines(entry?.goodFor ?? []), holdOff: lines(entry?.holdOff ?? []) };
}

function lines(texts: readonly string[]) {
  return texts.map(textRun);
}

function joinWords(words: readonly string[]): string {
  if (words.length <= 1) {
    return words[0] ?? "";
  }
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1] as string}`;
}

/** "Today's sign, the horse, sits opposite the rat, your birth chart's sign for work." */
function mechanics(fact: TransitFact, verb: string): string {
  const natal = [...fact.branches];
  natal.splice(natal.indexOf(fact.transitBranch), 1);
  const animals = natal.map((branch) => `the ${BRANCH_ANIMALS[branch as Branch]}`);
  const subjects = [...new Set(fact.natalPalaces.map((palace) => AREA_SIGN_SUBJECT[lifeAreaOf(palace)]))];
  const signs = subjects.length > 1 ? `your birth chart's signs for ${joinWords(subjects)}` : `your birth chart's sign for ${subjects[0] ?? "home and partner"}`;
  return `Today's sign, the ${BRANCH_ANIMALS[fact.transitBranch]}, ${verb} ${joinWords(animals)}, ${signs}.`;
}

function interactionPage(fact: TransitFact): TopicPage {
  const topic = INTERACTION_TOPICS[fact.interaction];
  return page({
    title: textRun(`${topic.title} ${AREA_TITLE_PHRASE[lifeAreaOf(fact.natalPalaces[0])]}`),
    oldName: textRun(`The old calendars call this ${topic.oldName}.`),
    forYou: textRun(mechanics(fact, topic.verb)),
    how: lines(topic.how),
    ...suits(INTERACTION_SUITS[fact.interaction]),
    work: lines(topic.work),
    nameOrigin: textRun(topic.nameOrigin),
  });
}

function tenGodPage(fact: FactOf<"ten-god-day">, quiet: boolean, pick: Picker): TopicPage {
  const [title, line] = pick(TEN_GOD_CARDS[fact.english] ?? TEN_GOD_CARDS["Friend"]!, `card:ten-god:${fact.english}`);
  const topic = TEN_GOD_TOPICS[fact.english] ?? TEN_GOD_TOPICS["Friend"]!;
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this a ${fact.english} day.`),
    forYou: textRun(quiet ? `${QUIET_FOR_YOU} ${line}` : line),
    how: lines([topic.how]),
    ...suits(TEN_GOD_SUITS[fact.english] ?? TEN_GOD_SUITS["Friend"]),
    work: lines([topic.work]),
    nameOrigin: textRun(TEN_GOD_NAME_ORIGIN),
  });
}

function elementPage(fact: FactOf<"element-day">, pick: Picker): TopicPage {
  const tone = fact.favorable ? "suits" : "against";
  const [title, line] = pick(ELEMENT_CARDS[fact.element][tone], `card:element:${fact.element}:${tone}`);
  const name = elementWord(fact.element);
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this a ${name} day.`),
    forYou: textRun(ELEMENT_TOPIC[tone].forYou(name)),
    how: lines([line]),
    ...suits(ELEMENT_SUITS[fact.element][tone]),
    work: lines([ELEMENT_TOPIC[tone].work]),
    nameOrigin: textRun(ELEMENT_NAME_ORIGIN),
  });
}

function stagePage(fact: FactOf<"stage-day">, pick: Picker): TopicPage {
  const english = fact.stage.english;
  const [title, line] = pick(STAGE_CARDS[english] ?? [STAGE_CARD_FALLBACK], `card:stage:${english}`);
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this stage ${english}.`),
    forYou: textRun(line),
    ...suits(STAGE_SUITS[english]),
    work: lines([STAGE_WORK[english] ?? "Match your plans to the pace the day offers."]),
    nameOrigin: textRun(STAGE_NAME_ORIGIN),
  });
}

function bestHourWhy(bestHour: FactOf<"best-hour"> | undefined): string {
  if (!bestHour) {
    return "";
  }
  const element = elementWord(bestHour.element);
  const why = bestHour.isEasyHour
    ? BEST_HOUR_LINES.whyIsEasyHour(element)
    : BEST_HOUR_LINES.why(hourWindowLabel(bestHour.startHour, bestHour.endHour), element);
  return ` ${why}`;
}

function hoursPage(easy: FactOf<"hour-interaction">, rough: FactOf<"hour-interaction">, bestHour: FactOf<"best-hour"> | undefined): TopicPage {
  const easyWindow = hourWindowLabel(easy.startHour, easy.endHour);
  const roughWindow = hourWindowLabel(rough.startHour, rough.endHour);
  const day = BRANCH_ANIMALS[easy.dayBranch];
  return page({
    title: textRun(`Easiest ${easyWindow}, roughest ${roughWindow}`),
    forYou: textRun(`The ${BRANCH_ANIMALS[easy.hourBranch]} hour, ${easyWindow}, runs with today's sign, the ${day}. The ${BRANCH_ANIMALS[rough.hourBranch]} hour, ${roughWindow}, runs against it.${bestHourWhy(bestHour)}`),
    how: lines([HOURS_TOPIC.how]),
    work: lines(HOURS_TOPIC.work),
    nameOrigin: textRun(HOURS_TOPIC.nameOrigin),
  });
}

function starsPage(stars: readonly FactOf<"star-day">[]): TopicPage {
  return page({
    title: textRun("Today's small signs"),
    stars: stars.map((star) => ({
      title: textRun(STAR_TITLES[star.star] ?? "A small sign today"),
      line: textRun(STAR_LINES[star.star] ?? "A small mark on the day."),
      oldName: textRun(star.english),
    })),
    nameOrigin: textRun(STARS_NAME_ORIGIN),
  });
}

/** Without the day's seed, a card pool's first entry heads the page. */
function firstEntry<T>(pool: readonly T[]): T {
  return pool[0] as T;
}

/**
 * The card's own pick when Today counted the slot; the pool's first entry when
 * no card shows it (a quiet day's character page, opened from the lead, or an
 * element that joined the body), so those titles never change day to day.
 */
function cardPicker(seed: DailySeed): Picker {
  const pick = pickerFor(seed);
  return <T>(pool: readonly T[], slot: string): T => (seed.visits?.[slot] === undefined ? firstEntry(pool) : pick(pool, slot));
}

/**
 * The page for a topic key, or null when the day carries nothing under it.
 * With the chart's context, the page gains fuller sections (M20-26), and its
 * title, and its opening line where the page has no fuller opening of its
 * own, are the ones the card showed (M24-11).
 */
export function topicPage(topic: string, facts: readonly DayFact[], context?: TopicContext): TopicPage | null {
  const base = basePage(topic, facts, context ? cardPicker(context.seed) : firstEntry);
  return base && context ? deepenTopicPage(base, topic, facts, context) : base;
}

function basePage(topic: string, facts: readonly DayFact[], pick: Picker): TopicPage | null {
  if (topic.startsWith("interaction:")) {
    const fact = rankTransits(facts).find((candidate) => interactionTopic(candidate) === topic);
    return fact ? interactionPage(fact) : null;
  }
  if (topic.startsWith("ten-god:")) {
    const fact = facts.find((candidate): candidate is FactOf<"ten-god-day"> => candidate.kind === "ten-god-day" && `ten-god:${candidate.english}` === topic);
    return fact ? tenGodPage(fact, rankTransits(facts).length === 0, pick) : null;
  }
  if (topic.startsWith("element:")) {
    const fact = facts.find((candidate): candidate is FactOf<"element-day"> => candidate.kind === "element-day" && `element:${candidate.element}` === topic);
    return fact ? elementPage(fact, pick) : null;
  }
  if (topic.startsWith("stage:")) {
    const fact = facts.find((candidate): candidate is FactOf<"stage-day"> => candidate.kind === "stage-day" && `stage:${candidate.stage.english}` === topic);
    return fact ? stagePage(fact, pick) : null;
  }
  if (topic === "hours") {
    const hours = facts.filter((candidate): candidate is FactOf<"hour-interaction"> => candidate.kind === "hour-interaction");
    const easy = hours.find((fact) => fact.interaction === "six-combine");
    const rough = hours.find((fact) => fact.interaction === "six-clash");
    const bestHour = facts.find((candidate): candidate is FactOf<"best-hour"> => candidate.kind === "best-hour");
    return easy && rough ? hoursPage(easy, rough, bestHour) : null;
  }
  if (topic === "stars") {
    const stars = facts.filter((candidate): candidate is FactOf<"star-day"> => candidate.kind === "star-day");
    return stars.length > 0 ? starsPage(stars) : null;
  }
  return null;
}

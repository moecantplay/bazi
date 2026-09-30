/**
 * A topic page (M20-21 R11): the long form behind one of Today's cards, or
 * behind the reading itself. Found by the card's topic key among the day's
 * facts; null when the key names nothing the day carries.
 */

import type { Branch, ReadingFact } from "@daymaster/bazi-engine";
import { textRun } from "../tokens.js";
import type { TopicPage } from "../types.js";
import { BRANCH_ANIMALS, elementWord, hourWindowLabel } from "../vocab.js";
import { ELEMENT_CARDS, STAGE_CARDS, STAR_TITLES, TEN_GOD_CARDS } from "../banks/daily/cards.js";
import { AREA_SIGN_SUBJECT, AREA_TITLE_PHRASE, INTERACTION_TOPICS } from "../banks/topics/interactions.js";
import {
  ELEMENT_NAME_ORIGIN,
  ELEMENT_TOPIC,
  HOURS_TOPIC,
  QUIET_FOR_YOU,
  STAGE_NAME_ORIGIN,
  STAGE_WORK,
  STARS_NAME_ORIGIN,
  STAR_LINES,
  TEN_GOD_NAME_ORIGIN,
  TEN_GOD_TOPICS,
} from "../banks/topics/day.js";
import { interactionTopic, rankTransits, type TransitFact } from "./daily/lead.js";
import { lifeAreaOf } from "./daily/life-areas.js";

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

function page(fields: Partial<TopicPage> & Pick<TopicPage, "title" | "nameOrigin">): TopicPage {
  return { oldName: null, forYou: null, how: [], work: [], stars: [], ...fields };
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
    work: lines(topic.work),
    nameOrigin: textRun(topic.nameOrigin),
  });
}

function tenGodPage(fact: FactOf<"ten-god-day">, quiet: boolean): TopicPage {
  const [title, line] = TEN_GOD_CARDS[fact.english] ?? TEN_GOD_CARDS["Friend"]!;
  const topic = TEN_GOD_TOPICS[fact.english] ?? TEN_GOD_TOPICS["Friend"]!;
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this a ${fact.english} day.`),
    forYou: textRun(quiet ? `${QUIET_FOR_YOU} ${line}` : line),
    how: lines([topic.how]),
    work: lines([topic.work]),
    nameOrigin: textRun(TEN_GOD_NAME_ORIGIN),
  });
}

function elementPage(fact: FactOf<"element-day">): TopicPage {
  const tone = fact.favorable ? "suits" : "against";
  const [title, line] = ELEMENT_CARDS[fact.element][tone];
  const name = elementWord(fact.element);
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this a ${name} day.`),
    forYou: textRun(ELEMENT_TOPIC[tone].forYou(name)),
    how: lines([line]),
    work: lines([ELEMENT_TOPIC[tone].work]),
    nameOrigin: textRun(ELEMENT_NAME_ORIGIN),
  });
}

function stagePage(fact: FactOf<"stage-day">): TopicPage {
  const english = fact.stage.english;
  const [title, line] = STAGE_CARDS[english] ?? ["Your pace today", "Take the day at the speed it offers."];
  return page({
    title: textRun(title),
    oldName: textRun(`The old calendars call this stage ${english}.`),
    forYou: textRun(line),
    work: lines([STAGE_WORK[english] ?? "Match your plans to the pace the day offers."]),
    nameOrigin: textRun(STAGE_NAME_ORIGIN),
  });
}

function hoursPage(easy: FactOf<"hour-interaction">, rough: FactOf<"hour-interaction">): TopicPage {
  const easyWindow = hourWindowLabel(easy.startHour, easy.endHour);
  const roughWindow = hourWindowLabel(rough.startHour, rough.endHour);
  const day = BRANCH_ANIMALS[easy.dayBranch];
  return page({
    title: textRun(`Easiest ${easyWindow}, roughest ${roughWindow}`),
    forYou: textRun(`The ${BRANCH_ANIMALS[easy.hourBranch]} hour, ${easyWindow}, runs with today's sign, the ${day}. The ${BRANCH_ANIMALS[rough.hourBranch]} hour, ${roughWindow}, runs against it.`),
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

/** The page for a topic key, or null when the day carries nothing under it. */
export function topicPage(topic: string, facts: readonly ReadingFact[]): TopicPage | null {
  if (topic.startsWith("interaction:")) {
    const fact = rankTransits(facts).find((candidate) => interactionTopic(candidate) === topic);
    return fact ? interactionPage(fact) : null;
  }
  if (topic.startsWith("ten-god:")) {
    const fact = facts.find((candidate): candidate is FactOf<"ten-god-day"> => candidate.kind === "ten-god-day" && `ten-god:${candidate.english}` === topic);
    return fact ? tenGodPage(fact, rankTransits(facts).length === 0) : null;
  }
  if (topic.startsWith("element:")) {
    const fact = facts.find((candidate): candidate is FactOf<"element-day"> => candidate.kind === "element-day" && `element:${candidate.element}` === topic);
    return fact ? elementPage(fact) : null;
  }
  if (topic.startsWith("stage:")) {
    const fact = facts.find((candidate): candidate is FactOf<"stage-day"> => candidate.kind === "stage-day" && `stage:${candidate.stage.english}` === topic);
    return fact ? stagePage(fact) : null;
  }
  if (topic === "hours") {
    const hours = facts.filter((candidate): candidate is FactOf<"hour-interaction"> => candidate.kind === "hour-interaction");
    const easy = hours.find((fact) => fact.interaction === "six-combine");
    const rough = hours.find((fact) => fact.interaction === "six-clash");
    return easy && rough ? hoursPage(easy, rough) : null;
  }
  if (topic === "stars") {
    const stars = facts.filter((candidate): candidate is FactOf<"star-day"> => candidate.kind === "star-day");
    return stars.length > 0 ? starsPage(stars) : null;
  }
  return null;
}

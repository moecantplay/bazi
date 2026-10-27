/**
 * The copy audit's inputs (M20-02 R1, R4): every screen's text, collected
 * through the same view-models the screens render from. Nothing here picks or
 * phrases a line; it reads what the view-models return and turns token runs
 * into text with the app's own plainGloss. Labels, chips and drawings are
 * left out: they are fixed words, not sentences.
 */

import { plainGloss, type PlainReading, type TokenLine, type TopicPage } from "@daymaster/content";
import {
  addDays,
  decadeView,
  decadesOf,
  monthView,
  natalReadingFor,
  pairScreenFor,
  TODAY_RANGE_DAYS,
  todayScreenModel,
  topicPageFor,
  yearView,
  yearsOfDecade,
  youColoursFor,
  youElementsFor,
  youScreenFor,
  type StoredProfile
} from "../../src/index.js";
import type { AuditSlot, AuditView } from "./metrics.js";

export const START = "2026-10-20";
export const DAYS = 90;
const AHEAD_MONTH_YEARS = [2026, 2027];
const AHEAD_YEAR = 2026;

export type SurfaceName = "Today" | "Topic pages" | "Ahead" | "You" | "Your chart" | "People";

/** A view, tagged with the fixture it was rendered for. */
export interface FixtureView extends AuditView {
  fixture: string;
}

export type Surfaces = Record<SurfaceName, FixtureView[]>;

type Fixture = readonly [string, StoredProfile];

function slot(name: string, text: string | null | undefined): AuditSlot[] {
  return text ? [{ slot: name, text }] : [];
}

function runs(name: string, line: TokenLine | null): AuditSlot[] {
  return line ? slot(name, plainGloss(line)) : [];
}

function plainReadingSlots(reading: PlainReading): AuditSlot[] {
  return [
    ...slot("headline", reading.lead.headline),
    ...slot("body", reading.lead.body),
    ...slot("action", reading.lead.action),
    ...reading.cards.flatMap((card) => [...slot("card title", card.title), ...slot("card line", card.line)])
  ];
}

function topicSlots(page: TopicPage): AuditSlot[] {
  return [
    ...runs("title", page.title),
    ...runs("tagline", page.tagline),
    ...runs("old name", page.oldName),
    ...runs("for you", page.forYou),
    ...page.stars.flatMap((star) => [...runs("star title", star.title), ...runs("star line", star.line), ...runs("star old name", star.oldName)]),
    ...page.how.flatMap((line) => runs("how", line)),
    ...page.where.flatMap((row) => runs("where", row.line)),
    ...runs("sore spot", page.sore?.body ?? null),
    ...page.goodFor.flatMap((line) => runs("good for", line)),
    ...page.holdOff.flatMap((line) => runs("hold off", line)),
    ...page.work.flatMap((line) => runs("work", line)),
    ...runs("name origin", page.nameOrigin),
    ...runs("closing", page.closing)
  ];
}

function todayAndTopics([fixture, profile]: Fixture): { today: FixtureView[]; topics: FixtureView[] } {
  const today: FixtureView[] = [];
  const topics: FixtureView[] = [];
  for (let index = 0; index < DAYS; index += 1) {
    const date = addDays(START, index);
    const { reading, suits, colour } = todayScreenModel(profile, date, date);
    today.push({
      fixture,
      key: `${fixture} ${date}`,
      slots: [
        ...runs("headline", reading.headline.runs),
        ...runs("body", reading.body.runs),
        ...runs("agency", reading.agency.runs),
        ...reading.cards.flatMap((card) => [
          ...card.titles.flatMap((title) => runs(card.topic === "stars" ? "star title" : "card title", title)),
          ...runs("card line", card.line),
          ...runs("card note", card.note)
        ]),
        ...runs("suits heading", suits.heading),
        ...runs("watch reason", suits.watchReason),
        ...slot("colour line", colour?.line)
      ]
    });
    const shown = [reading.leadTopic, ...(reading.modifierTopic ? [reading.modifierTopic] : []), ...reading.cards.map((card) => card.topic)];
    // Seen from the start of Today's range, the page's text is the same and its
    // "comes back on" dates (not text, so not measured) have no days to scan.
    // Scanning them made the audit ten times slower.
    const seenFrom = addDays(date, -TODAY_RANGE_DAYS);
    for (const topic of shown) {
      const page = topicPageFor(profile, date, seenFrom, topic);
      if (!page) {
        throw new Error(`${fixture} ${date}: Today shows ${topic} but has no topic page for it`);
      }
      topics.push({ fixture, key: `${fixture} ${date} ${topic}`, slots: topicSlots(page) });
    }
  }
  return { today, topics };
}

function ahead([fixture, profile]: Fixture): FixtureView[] {
  const views: FixtureView[] = [];
  for (const year of AHEAD_MONTH_YEARS) {
    for (let month = 1; month <= 12; month += 1) {
      const period = monthView(profile, year, month);
      if (period) {
        views.push({ fixture, key: `${fixture} ${period.label}`, slots: plainReadingSlots(period.reading) });
      }
    }
  }
  const { decades, currentIndex } = decadesOf(profile, AHEAD_YEAR);
  const current = currentIndex === null ? undefined : decades[currentIndex];
  for (const summary of current ? yearsOfDecade(profile, current) : []) {
    const period = yearView(profile, summary.key);
    views.push({ fixture, key: `${fixture} ${period.label}`, slots: plainReadingSlots(period.reading) });
  }
  for (const luck of decades) {
    const period = decadeView(profile, luck);
    views.push({ fixture, key: `${fixture} ${period.label}`, slots: plainReadingSlots(period.reading) });
  }
  return views;
}

function you([fixture, profile]: Fixture): FixtureView[] {
  const reading = youScreenFor(profile);
  const elements = youElementsFor(profile);
  const colours = youColoursFor(profile);
  const slots = [
    ...(reading ? plainReadingSlots(reading) : []),
    ...(elements
      ? [...elements.helps.flatMap((entry) => slot("helps", entry.line)), ...elements.wears.flatMap((entry) => slot("wears", entry.line)), ...slot("ease", elements.ease)]
      : []),
    ...slot("colours where", colours?.where),
    ...slot("colours fix", colours?.fix)
  ];
  return [{ fixture, key: fixture, slots }];
}

/** The chart page behind You: every section of the natal reading, slotted by section. */
function chart([fixture, profile]: Fixture): FixtureView[] {
  const slots = natalReadingFor(profile).sections.flatMap((section) => section.lines.flatMap((line) => runs(section.key, line.runs)));
  return [{ fixture, key: fixture, slots }];
}

function people([fixture, profile]: Fixture, fixtures: readonly Fixture[]): FixtureView[] {
  return fixtures.flatMap(([otherName, other]) => {
    if (otherName === fixture) {
      return [];
    }
    const reading = pairScreenFor(profile, other.birth);
    return reading ? [{ fixture, key: `${fixture} with ${otherName}`, slots: plainReadingSlots(reading) }] : [];
  });
}

/** Every surface's views for every fixture, in a fixed order. */
export function collectSurfaces(fixtures: readonly Fixture[]): Surfaces {
  const surfaces: Surfaces = { Today: [], "Topic pages": [], Ahead: [], You: [], "Your chart": [], People: [] };
  for (const fixture of fixtures) {
    const { today, topics } = todayAndTopics(fixture);
    surfaces.Today.push(...today);
    surfaces["Topic pages"].push(...topics);
    surfaces.Ahead.push(...ahead(fixture));
    surfaces.You.push(...you(fixture));
    surfaces["Your chart"].push(...chart(fixture));
    surfaces.People.push(...people(fixture, fixtures));
  }
  return surfaces;
}

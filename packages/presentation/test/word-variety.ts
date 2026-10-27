/**
 * How often one word carries a screen (M24-11 R12), over the copy audit's
 * collection (90 days from 2026-10-20, every reading fixture). A window is
 * what one reader meets together: 7 days of Today, 12 consecutive months of
 * Ahead, the years of one decade, or a single screen elsewhere. For each word
 * and two-word phrase, the most times it appears in any one window.
 *
 * Words are counted with a plain "-s" folded off ("plans" counts as "plan"),
 * function words are skipped, and the lines fixed on purpose sit out: the
 * hours card's times, star titles, and a topic page's old name, name origin,
 * sore spot and closing.
 */

import { collectSurfaces, type FixtureView } from "../scripts/copy-audit/surfaces.js";
import type { StoredProfile } from "../src/types.js";

export type WindowName =
  | "Today, 7 days"
  | "Ahead, 12 months"
  | "Ahead, a decade's years"
  | "Ahead, one decade"
  | "Topic page"
  | "People"
  | "You"
  | "Your chart";

export interface WordPeak {
  count: number;
  /** The first window that reached the count. */
  where: string;
}

export type WordPeaks = Record<WindowName, Map<string, WordPeak>>;

const TODAY_DAYS = 7;
const AHEAD_MONTHS = 12;
const FIXED_SLOTS = ["old name", "star old name", "name origin", "sore spot", "closing", "star title"];
const HOURS_LINE = /^(?:Easiest|Roughest) \d/;

const FUNCTION_WORDS = new Set(
  `a an the and or but nor so yet of to in on at for with by from into onto out up down off over under about as than then
  is are was were be been being am it its it's this that these those there here what which who whom whose when where why how
  i you your you're you've you'll you'd yours we our us they them their he she his her him me my mine
  that's there's what's it'll don't doesn't isn't aren't won't can't
  do does did doing done have has had having can could may might will would shall
  not no if just very all each any some more most much many one ones own same other such only also too
  let lets let's get gets got`.split(/\s+/)
);

function fold(word: string): string {
  if (FUNCTION_WORDS.has(word) || word.length <= 3 || !word.endsWith("s") || word.endsWith("ss")) {
    return word;
  }
  return word.slice(0, -1);
}

/** The counted words and two-word phrases of one line. */
export function termsOf(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .split(/[^a-z']+/)
    .map((word) => word.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
  const singles = words.filter((word) => !FUNCTION_WORDS.has(word) && word.length > 2).map(fold);
  const pairs = words
    .slice(1)
    .map((word, index) => [words[index] as string, word] as const)
    .filter(([first, second]) => !(FUNCTION_WORDS.has(first) && FUNCTION_WORDS.has(second)))
    .map(([first, second]) => `${first} ${fold(second)}`);
  return [...singles, ...pairs];
}

function countedTerms(view: FixtureView): string[] {
  return view.slots
    .filter(({ slot, text }) => !FIXED_SLOTS.includes(slot) && !HOURS_LINE.test(text))
    .flatMap(({ text }) => termsOf(text));
}

function record(peaks: Map<string, WordPeak>, views: readonly FixtureView[]): void {
  const tally = new Map<string, number>();
  for (const view of views) {
    for (const term of countedTerms(view)) {
      tally.set(term, (tally.get(term) ?? 0) + 1);
    }
  }
  const where = views.length === 1 ? views[0]!.key : `${views[0]!.key} to ${views.at(-1)!.key}`;
  for (const [term, count] of tally) {
    if (count > (peaks.get(term)?.count ?? 0)) {
      peaks.set(term, { count, where });
    }
  }
}

function slidingWindows(views: readonly FixtureView[], size: number): FixtureView[][] {
  if (views.length <= size) {
    return views.length > 0 ? [[...views]] : [];
  }
  return Array.from({ length: views.length - size + 1 }, (_, start) => views.slice(start, start + size));
}

function byFixture(views: readonly FixtureView[]): FixtureView[][] {
  const groups = new Map<string, FixtureView[]>();
  for (const view of views) {
    groups.set(view.fixture, [...(groups.get(view.fixture) ?? []), view]);
  }
  return [...groups.values()];
}

const MONTH_KEY = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const YEAR_KEY = / \d{4}$/;

/** Every word's peak per window, across every fixture. */
export function wordPeaks(fixtures: readonly (readonly [string, StoredProfile])[]): WordPeaks {
  const surfaces = collectSurfaces(fixtures);
  const peaks = Object.fromEntries(
    (["Today, 7 days", "Ahead, 12 months", "Ahead, a decade's years", "Ahead, one decade", "Topic page", "People", "You", "Your chart"] as const).map((name) => [name, new Map()])
  ) as WordPeaks;
  for (const views of byFixture(surfaces.Today)) {
    slidingWindows(views, TODAY_DAYS).forEach((window) => record(peaks["Today, 7 days"], window));
  }
  for (const views of byFixture(surfaces.Ahead)) {
    const months = views.filter((view) => MONTH_KEY.test(view.key));
    const years = views.filter((view) => !MONTH_KEY.test(view.key) && YEAR_KEY.test(view.key));
    const decades = views.filter((view) => !months.includes(view) && !years.includes(view));
    slidingWindows(months, AHEAD_MONTHS).forEach((window) => record(peaks["Ahead, 12 months"], window));
    record(peaks["Ahead, a decade's years"], years);
    decades.forEach((view) => record(peaks["Ahead, one decade"], [view]));
  }
  surfaces["Topic pages"].forEach((view) => record(peaks["Topic page"], [view]));
  surfaces.People.forEach((view) => record(peaks.People, [view]));
  surfaces.You.forEach((view) => record(peaks.You, [view]));
  surfaces["Your chart"].forEach((view) => record(peaks["Your chart"], [view]));
  return peaks;
}

/** VOICE.md rule 6 (owner, 2026-10-27): the most times a term may appear in one window. */
export const WORD_CAPS: Record<WindowName, number> = {
  "Today, 7 days": 7,
  "Ahead, 12 months": 6,
  "Ahead, a decade's years": 5,
  "Ahead, one decade": 3,
  "Topic page": 3,
  People: 3,
  You: 3,
  "Your chart": 3
};

/** What a line is about (its part of life, an element, an animal sign, a palace): these get twice the cap. */
const NAME_WORDS = new Set(
  `work family home plan wood fire earth metal water
  rat ox tiger rabbit dragon snake horse goat monkey rooster dog pig
  palace roots career horizon`.split(/\s+/)
);

function capFor(window: WindowName, term: string): number {
  const cap = WORD_CAPS[window];
  return term.split(" ").some((word) => NAME_WORDS.has(word)) ? cap * 2 : cap;
}

/** Every term over its cap, as "window | term", worst first. */
export function overCaps(peaks: WordPeaks): string[] {
  return (Object.entries(peaks) as [WindowName, Map<string, WordPeak>][]).flatMap(([window, terms]) =>
    [...terms.entries()]
      .filter(([term, peak]) => peak.count > capFor(window, term))
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([term]) => `${window} | ${term}`)
  );
}

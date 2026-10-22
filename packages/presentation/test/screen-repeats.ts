/**
 * What the rendered screens show (M24-11 R6, R2), counted per surface over the
 * copy audit's collection (90 days from 2026-10-20, every reading fixture):
 *
 * - Today's 14-day window: a sentence that comes back within 14 days for the
 *   same chart. The hours card's times and the star titles are exempt.
 * - Within a view: the same sentence twice, and two different sentences
 *   sharing a 4-word phrase. A title may echo the line it introduces, so
 *   titles sit out the phrase check.
 * - Plain writing (VOICE.md rules 1–4) on every rendered line, which reaches
 *   the lines composed inside `readings/**` that the bank walk can't.
 */

import { brokenRules, plainGloss, type PlainRule } from "@daymaster/content";
import { measureViews, sentencesOf } from "../scripts/copy-audit/metrics.js";
import { collectSurfaces, type SurfaceName } from "../scripts/copy-audit/surfaces.js";
import { addDays } from "../src/dates.js";
import { todayScreenModel } from "../src/today-screen.js";
import type { StoredProfile } from "../src/types.js";

export type ScreenCount = "window repeats" | "said twice" | "phrase pairs" | PlainRule;

export type ScreenCounts = Record<SurfaceName, Partial<Record<ScreenCount, number>>>;

const WINDOW_DAYS = 14;
const DAYS = 90;
const START = "2026-10-20";
const TITLE_SLOTS = ["title", "card title", "star title"];
const UNROTATED_CARDS = ["hours", "stars"];

/** Every sentence Today shows on a day that has to rotate: the hours card keeps only its best-hour note. */
function rotatingSentences(profile: StoredProfile, date: string): string[] {
  const { reading, suits, colour } = todayScreenModel(profile, date, date);
  const lines = [reading.headline.runs, reading.body.runs, reading.agency.runs].map(plainGloss);
  for (const card of reading.cards) {
    if (!UNROTATED_CARDS.includes(card.topic)) {
      lines.push(...card.titles.map(plainGloss), ...(card.line ? [plainGloss(card.line)] : []));
    }
    if (card.note) {
      lines.push(plainGloss(card.note));
    }
  }
  lines.push(plainGloss(suits.heading), ...(suits.watchReason ? [plainGloss(suits.watchReason)] : []), ...(colour ? [colour.line] : []));
  return lines.flatMap(sentencesOf);
}

/** Sentences that came back within the window for one chart over the 90 days. */
function windowRepeats(profile: StoredProfile): number {
  const lastSeen = new Map<string, number>();
  let repeats = 0;
  for (let day = 0; day < DAYS; day += 1) {
    for (const sentence of new Set(rotatingSentences(profile, addDays(START, day)))) {
      const previous = lastSeen.get(sentence);
      if (previous !== undefined && day - previous < WINDOW_DAYS) {
        repeats += 1;
      }
      lastSeen.set(sentence, day);
    }
  }
  return repeats;
}

/** Every count, per surface; zero counts are left out. */
export function screenCounts(fixtures: readonly (readonly [string, StoredProfile])[]): ScreenCounts {
  const surfaces = collectSurfaces(fixtures);
  const counts = {} as ScreenCounts;
  for (const [name, views] of Object.entries(surfaces) as [SurfaceName, (typeof surfaces)[SurfaceName]][]) {
    const tally: Partial<Record<ScreenCount, number>> = {};
    const add = (key: ScreenCount, amount: number): void => {
      if (amount > 0) {
        tally[key] = (tally[key] ?? 0) + amount;
      }
    };
    add("said twice", measureViews(views).withinViewDuplicates.extra);
    const untitled = views.map((view) => ({ ...view, slots: view.slots.filter((slot) => !TITLE_SLOTS.includes(slot.slot)) }));
    add("phrase pairs", measureViews(untitled).withinViewRepeats.pairs);
    for (const view of views) {
      for (const { text } of view.slots) {
        brokenRules(text).forEach((rule) => add(rule, 1));
      }
    }
    if (name === "Today") {
      add("window repeats", fixtures.reduce((sum, [, profile]) => sum + windowRepeats(profile), 0));
    }
    counts[name] = tally;
  }
  return counts;
}

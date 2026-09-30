/**
 * Today as one written piece (M20-21), over 90 real days for every fixture:
 * the first screen fits its budget, nothing on it repeats within a week, every
 * fact appears exactly once, and "What the day suits" never restates the first
 * screen.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { plainGloss } from "@daymaster/content";
import { addDays } from "../src/dates.js";
import { dailyBundleFor } from "../src/reading.js";
import { todayScreenModel } from "../src/today-screen.js";
import { READING_FIXTURES } from "./fixtures.js";

const START = "2026-09-29";
const DAYS = 90;
const WINDOW = 7;
const BUDGET = 70;

function wordsOf(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9'’ ]+/g, " ").split(/\s+/).filter(Boolean);
}

/** Every distinct 4-word phrase, within sentences (never across a break). */
function fourGrams(text: string): Set<string> {
  const grams = new Set<string>();
  for (const sentence of text.split(/[.!?;:\n]+/)) {
    const words = wordsOf(sentence);
    for (let index = 0; index + 4 <= words.length; index += 1) {
      grams.add(words.slice(index, index + 4).join(" "));
    }
  }
  return grams;
}

/** The topic key each fact files under; hours and stars group into one card each. */
function topicOf(fact: ReadingFact): string | null {
  switch (fact.kind) {
    case "transit-interaction":
      return `interaction:${fact.interaction}:${fact.natalPalaces[0] ?? "overall"}`;
    case "element-day":
      return `element:${fact.element}`;
    case "ten-god-day":
      return `ten-god:${fact.english}`;
    case "hour-interaction":
      return "hours";
    case "stage-day":
      return `stage:${fact.stage.english}`;
    case "star-day":
      return "stars";
    default:
      return null;
  }
}

describe.each(READING_FIXTURES)("Today over 90 days — fixture %s", (name, profile) => {
  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = addDays(START, index);
    const model = todayScreenModel(profile, date, date);
    const facts = dailyBundleFor(profile, date).facts;
    const first = [model.reading.headline, model.reading.body, model.reading.agency].map((line) => plainGloss(line.runs));
    return { date, model, facts, first };
  });

  it(`first screen stays within ${BUDGET} words`, () => {
    for (const day of days) {
      const words = wordsOf(day.first.join(" ")).length;
      expect(words, `${name} ${day.date}: ${day.first.join(" | ")}`).toBeLessThanOrEqual(BUDGET);
    }
  });

  it(`no 4-word phrase on the first screen comes back within ${WINDOW} days`, () => {
    for (let index = 0; index < days.length; index += 1) {
      const today = days[index]!;
      const grams = fourGrams(today.first.join(" \n "));
      for (let back = 1; back < WINDOW && index - back >= 0; back += 1) {
        const earlier = days[index - back]!;
        const repeated = [...fourGrams(earlier.first.join(" \n "))].filter((gram) => grams.has(gram));
        expect(repeated, `${name}: ${earlier.date} and ${today.date} share phrases`).toEqual([]);
      }
    }
  });

  it("a situation that comes back reads differently from its last visit", () => {
    const last = new Map<string, string>();
    for (const day of days) {
      const key = day.model.reading.leadTopic;
      const previous = last.get(key);
      if (previous !== undefined) {
        expect(day.first[0], `${name} ${day.date}: ${key} repeats its headline`).not.toBe(previous);
      }
      last.set(key, day.first[0]!);
    }
  });

  it("every fact appears exactly once: lead, modifier or one card", () => {
    for (const day of days) {
      const { reading } = day.model;
      const shown = [reading.leadTopic, ...(reading.modifierTopic ? [reading.modifierTopic] : []), ...reading.cards.map((card) => card.topic)];
      expect(new Set(shown).size, `${name} ${day.date}: a topic shows twice`).toBe(shown.length);
      const produced = new Set(day.facts.map(topicOf).filter((topic): topic is string => topic !== null));
      expect(new Set(shown), `${name} ${day.date}`).toEqual(produced);
    }
  });

  it("the Watch reason never restates the first screen", () => {
    for (const day of days) {
      const reason = day.model.suits.watchReason;
      if (!reason) {
        continue;
      }
      const grams = fourGrams(day.first.join(" \n "));
      const repeated = [...fourGrams(plainGloss(reason))].filter((gram) => grams.has(gram));
      expect(repeated, `${name} ${day.date}`).toEqual([]);
    }
  });

  it("a Watch chip always comes with its reason", () => {
    for (const day of days) {
      const { suits } = day.model;
      if (suits.chips.some((chip) => chip.leaning === "friction")) {
        expect(suits.watchReason, `${name} ${day.date}`).not.toBeNull();
      }
    }
  });
});

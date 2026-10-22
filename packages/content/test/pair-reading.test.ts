/**
 * M24-09: People's pair readings in plain words (VOICE.md rule 11) — every
 * relation's lead, every link card in every life area — and the trial's lead
 * for one pair, kept exactly.
 */

import { describe, expect, it } from "vitest";
import type { CompareFact } from "@daymaster/bazi-engine";
import { PAIR_AREA_SUFFIX, PAIR_INTERACTION_CARDS, PAIR_LEADS } from "../src/banks/people/pair.js";
import { pairReading } from "../src/index.js";
import { assertPlain } from "./plain-terms.js";

const PAIR: CompareFact[] = [
  {
    kind: "compare-day-masters",
    aStem: "戊",
    bStem: "庚",
    aElement: "earth",
    bElement: "metal",
    relation: "output",
    aSeesB: { chinese: "食神", english: "Eating God" },
    bSeesA: { chinese: "偏印", english: "Indirect Resource" },
  },
  { kind: "compare-interaction", interaction: "six-combine", branches: ["辰", "酉"], aPalace: "day", bPalace: "year" },
] as CompareFact[];

describe("People's wording", () => {
  it("is plain in every lead and card", () => {
    for (const lead of Object.values(PAIR_LEADS)) {
      assertPlain(`${lead.headline} ${lead.body} ${lead.action}`);
    }
    for (const [title, line] of Object.values(PAIR_INTERACTION_CARDS).flat()) {
      for (const suffix of Object.values(PAIR_AREA_SUFFIX)) {
        assertPlain(`${title} ${suffix}`);
      }
      assertPlain(line);
    }
  });
});

describe("pairReading", () => {
  it("reads a pair from how the day-masters relate", () => {
    const reading = pairReading(PAIR);
    expect(reading?.lead.headline).toBe("You tend to give more, and it mostly works.");
    expect(reading?.cards.map((card) => card.title)).toEqual(["Easy together at home", "What they bring out in you", "What you bring them"]);
    for (const card of reading?.cards ?? []) {
      assertPlain(`${card.title} ${card.line}`);
    }
    expect(pairReading(PAIR)).toEqual(reading);
  });

  it("returns null without the day-masters", () => {
    expect(pairReading(PAIR.slice(1))).toBeNull();
  });
});

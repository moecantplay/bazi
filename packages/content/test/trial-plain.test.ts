/**
 * TRIAL (2026-10-05 reshape trial build): the plain leads and cards for Ahead,
 * You, People and the Welcome sample name no system term (the same list as
 * Today's, M20-21 R10), every cell is filled, and the builders are
 * deterministic.
 */

import { describe, expect, it } from "vitest";
import type { CompareFact, ReadingFact } from "@daymaster/bazi-engine";
import { CAREER_LINES } from "../src/banks/elements.js";
import { PAIR_AREA_SUFFIX, PAIR_INTERACTION_CARDS, PAIR_LEADS } from "../src/banks/trial/pair.js";
import {
  PERIOD_ELEMENT_SENTENCES,
  PERIOD_INTERACTION_CARDS,
  PERIOD_LEADS,
  PERIOD_QUIET_LEADS,
  PERIOD_TEN_GOD_CARDS,
} from "../src/banks/trial/period.js";
import { OFFICER_DAY_HEADLINES } from "../src/banks/trial/welcome.js";
import { BALANCE_CARDS, FEEDS_YOU, STRENGTH_CARDS } from "../src/banks/trial/you.js";
import { pairReading, periodReading, youReading } from "../src/index.js";
import { ELEMENTS, INTERACTIONS, TEN_GODS } from "./collect.js";
import { assertPlain } from "./plain-terms.js";

const SPANS = ["month", "year", "decade"] as const;

function plainAcrossSpans(text: string): void {
  for (const span of SPANS) {
    const filled = text.replaceAll("{span}", `this ${span}`);
    expect(filled).not.toContain("{");
    assertPlain(filled);
  }
}

describe("trial banks use everyday words only", () => {
  it("period leads and cards", () => {
    for (const interaction of INTERACTIONS) {
      for (const lead of Object.values(PERIOD_LEADS[interaction])) {
        plainAcrossSpans(lead.headline);
        plainAcrossSpans(lead.body);
        plainAcrossSpans(lead.action);
      }
      for (const [title, line] of Object.values(PERIOD_INTERACTION_CARDS[interaction])) {
        plainAcrossSpans(title);
        plainAcrossSpans(line);
      }
    }
    for (const element of ELEMENTS) {
      plainAcrossSpans(PERIOD_ELEMENT_SENTENCES[element].suits);
      plainAcrossSpans(PERIOD_ELEMENT_SENTENCES[element].against);
    }
  });

  it("every period character has a lead and a card", () => {
    for (const god of TEN_GODS) {
      const lead = PERIOD_QUIET_LEADS[god];
      const card = PERIOD_TEN_GOD_CARDS[god];
      expect(lead, god).toBeDefined();
      expect(card, god).toBeDefined();
      plainAcrossSpans(`${lead!.headline} ${lead!.body} ${lead!.action}`);
      plainAcrossSpans(`${card![0]} ${card![1]}`);
    }
  });

  it("pair leads and cards", () => {
    for (const lead of Object.values(PAIR_LEADS)) {
      assertPlain(`${lead.headline} ${lead.body} ${lead.action}`);
    }
    for (const [title, line] of Object.values(PAIR_INTERACTION_CARDS)) {
      for (const suffix of Object.values(PAIR_AREA_SUFFIX)) {
        assertPlain(`${title} ${suffix}`);
      }
      assertPlain(line);
    }
  });

  it("You cards", () => {
    for (const [title, line] of [...Object.values(STRENGTH_CARDS), ...Object.values(BALANCE_CARDS)]) {
      assertPlain(`${title} ${line}`);
    }
    for (const element of ELEMENTS) {
      assertPlain(FEEDS_YOU[element]);
      assertPlain(CAREER_LINES[element].replace(/^Rooms you tend to do well in lean \w+: /, ""));
    }
  });

  it("Welcome headlines", () => {
    for (const headline of Object.values(OFFICER_DAY_HEADLINES)) {
      assertPlain(headline);
    }
  });
});

const PERIOD_FACTS: ReadingFact[] = [
  { kind: "ten-god-period", period: "monthly", god: "比肩", english: "Friend" },
  { kind: "element-period", period: "monthly", element: "earth", favorable: true },
  { kind: "transit-interaction", interaction: "trine", branches: ["子", "申", "辰"], natalPalaces: ["hour"], transitPalace: "monthly", transitBranch: "子" },
  { kind: "transit-interaction", interaction: "six-clash", branches: ["辰", "戌"], natalPalaces: ["day"], transitPalace: "monthly", transitBranch: "戌" },
] as ReadingFact[];

describe("trial builders", () => {
  it("leads a period with its strongest sign link and closes the body with its element", () => {
    const reading = periodReading(PERIOD_FACTS, "month");
    expect(reading.lead.topic).toBe("interaction:six-clash:day");
    expect(reading.lead.headline).toBe("Home asks for some give this month.");
    expect(reading.lead.body.endsWith("Steady, patient building suits you this month.")).toBe(true);
    expect(reading.cards.map((card) => card.topic)).toEqual(["interaction:trine:hour", "ten-god:Friend"]);
  });

  it("leads a quiet period with its character, with no character card", () => {
    const quiet = PERIOD_FACTS.filter((fact) => fact.kind !== "transit-interaction");
    const reading = periodReading(quiet, "year");
    expect(reading.lead.topic).toBe("ten-god:Friend");
    expect(reading.cards).toEqual([]);
  });

  it("is deterministic", () => {
    expect(periodReading(PERIOD_FACTS, "decade")).toEqual(periodReading(PERIOD_FACTS, "decade"));
  });

  it("reads a pair from how the day-masters relate", () => {
    const facts = [
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
    const reading = pairReading(facts);
    expect(reading?.lead.headline).toBe("You tend to give more, and it mostly works.");
    expect(reading?.cards.map((card) => card.title)).toEqual([
      "Easy together at home",
      "What they bring out in you",
      "What you bring them",
    ]);
  });

  it("leads You with the day-master portrait", () => {
    const facts = [
      { kind: "day-master", stem: "戊", element: "earth", polarity: "yang" },
      { kind: "strength", value: "weak", narrow: true, seasonal: false, rooted: true, backed: false },
      { kind: "element-balance", counts: { wood: 1, fire: 1, earth: 3, metal: 2, water: 1 }, dominant: "earth", missing: [] },
      { kind: "favorable", elements: ["fire", "earth"] },
    ] as ReadingFact[];
    const reading = youReading(facts, "seed");
    expect(reading?.lead.headline).toBe("You are the mountain: slow to move, impossible to ignore.");
    expect(reading?.cards.map((card) => card.title)).toEqual([
      "Better in good company",
      "Well rounded",
      "What feeds you",
      "Rooms you tend to do well in",
    ]);
    for (const card of reading?.cards ?? []) {
      assertPlain(`${card.title} ${card.line}`);
    }
  });
});

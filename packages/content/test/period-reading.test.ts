/**
 * M24-07: Ahead's plain period readings — every lead and card in everyday words
 * across month, year and decade (VOICE.md rule 11), every period character
 * covered, the strongest fact leading, and the same facts always reading the same.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import {
  PERIOD_ELEMENT_SENTENCES,
  PERIOD_INTERACTION_CARDS,
  PERIOD_LEADS,
  PERIOD_QUIET_LEADS,
  PERIOD_TEN_GOD_CARDS,
} from "../src/banks/ahead/period.js";
import { periodReading } from "../src/index.js";
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

const PERIOD_FACTS: ReadingFact[] = [
  { kind: "ten-god-period", period: "monthly", god: "比肩", english: "Friend" },
  { kind: "element-period", period: "monthly", element: "earth", favorable: true },
  { kind: "transit-interaction", interaction: "trine", branches: ["子", "申", "辰"], natalPalaces: ["hour"], transitPalace: "monthly", transitBranch: "子" },
  { kind: "transit-interaction", interaction: "six-clash", branches: ["辰", "戌"], natalPalaces: ["day"], transitPalace: "monthly", transitBranch: "戌" },
] as ReadingFact[];

describe("Ahead's wording", () => {
  it("is plain in every lead and card", () => {
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

  it("gives every period character a lead and a card", () => {
    for (const god of TEN_GODS) {
      const lead = PERIOD_QUIET_LEADS[god];
      const card = PERIOD_TEN_GOD_CARDS[god];
      expect(lead, god).toBeDefined();
      expect(card, god).toBeDefined();
      plainAcrossSpans(`${lead!.headline} ${lead!.body} ${lead!.action}`);
      plainAcrossSpans(`${card![0]} ${card![1]}`);
    }
  });
});

describe("periodReading", () => {
  it("leads with the strongest link and closes the body with the period's element", () => {
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
});

/**
 * M24-08: the You screen in plain words (VOICE.md rule 11) — the portrait lead
 * for every stem, the What shapes you cards, your elements and your colours —
 * deterministic, and split the way presentation hands it over.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact, Stem } from "@daymaster/bazi-engine";
import { CAREER_LINES } from "../src/banks/elements.js";
import { COLOURS_WHERE, ELEMENT_COLOURS, colourFixLine } from "../src/banks/colours.js";
import { BALANCE_CARDS, HELPS_YOU, STRENGTH_CARDS, WEARS_YOU, easeLine } from "../src/banks/you/you.js";
import { youColours, youElements, youReading } from "../src/index.js";
import { ELEMENTS, STEMS } from "./collect.js";
import { assertPlain } from "./plain-terms.js";

function factsFor(stem: Stem): ReadingFact[] {
  return [
    { kind: "day-master", stem, element: "earth", polarity: "yang" },
    { kind: "strength", value: "weak", narrow: true, seasonal: false, rooted: true, backed: false },
    { kind: "element-balance", counts: { wood: 1, fire: 1, earth: 3, metal: 2, water: 1 }, dominant: "earth", missing: [] },
    { kind: "favorable", elements: ["fire", "earth"] },
  ] as ReadingFact[];
}

describe("You's wording", () => {
  it("is plain in every bank", () => {
    for (const [title, line] of [...Object.values(STRENGTH_CARDS), ...Object.values(BALANCE_CARDS)]) {
      assertPlain(`${title} ${line}`);
    }
    for (const element of ELEMENTS) {
      assertPlain(HELPS_YOU[element]);
      assertPlain(WEARS_YOU[element]);
      assertPlain(easeLine(element));
      assertPlain(CAREER_LINES[element].replace(/^Rooms you tend to do well in lean \w+: /, ""));
      expect(ELEMENT_COLOURS[element].length).toBeLessThanOrEqual(3);
    }
    assertPlain(COLOURS_WHERE);
    assertPlain(colourFixLine("black", "red"));
  });

  it("leads with the portrait for every stem, in plain words", () => {
    for (const stem of STEMS) {
      const reading = youReading(factsFor(stem), "seed");
      expect(reading?.lead.headline).toMatch(/^You are /);
      expect(reading?.lead.body.length).toBeGreaterThan(0);
      expect(reading?.lead.action.length).toBeGreaterThan(0);
      for (const text of [reading!.lead.headline, reading!.lead.body, reading!.lead.action]) {
        assertPlain(text);
      }
    }
  });
});

describe("youReading", () => {
  it("reads the mountain as the trial did, with three plain cards", () => {
    const reading = youReading(factsFor("戊"), "seed");
    expect(reading?.lead.headline).toBe("You are the mountain: slow to move, impossible to ignore.");
    expect(reading?.cards.map((card) => card.title)).toEqual(["Better in good company", "Well rounded", "Rooms you tend to do well in"]);
    for (const card of reading?.cards ?? []) {
      assertPlain(`${card.title} ${card.line}`);
    }
    expect(youReading(factsFor("戊"), "seed")).toEqual(reading);
  });

  it("returns null without a day-master", () => {
    expect(youReading([], "seed")).toBeNull();
  });
});

describe("youElements and youColours", () => {
  it("split into what helps and what wears you down", () => {
    const elements = youElements(["fire", "earth"], ["wood", "metal", "water"]);
    expect(elements?.helps.map((entry) => entry.element)).toEqual(["fire", "earth"]);
    expect(elements?.wears.map((entry) => entry.element)).toEqual(["wood", "metal", "water"]);
    expect(elements?.helps[0]?.line).toBe("Being seen and sharing what you know");
    expect(elements?.ease).toBe("When it wears on you, turn back to being seen and sharing what you know.");
    expect(youElements([], ELEMENTS)).toBeNull();
  });

  it("give colours that follow the same split, the classical one first, with one fix", () => {
    const colours = youColours(["fire", "earth"], ["wood", "metal", "water"]);
    expect(colours?.suit).toEqual(["red", "orange", "pink", "yellow", "beige", "brown"]);
    expect(colours?.easyOn).toEqual(["green", "teal", "white", "grey", "gold", "black", "navy"]);
    expect(colours?.fix).toBe("If you live in black, add one red thing: a scarf, a bag, a mug.");
    expect(youColours(["water", "metal"], ["wood", "fire", "earth"])?.fix).toBe(
      "If you live in yellow, add one black thing: a scarf, a bag, a mug.",
    );
    expect(youColours([], ELEMENTS)).toBeNull();
  });
});

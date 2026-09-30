/**
 * Coverage: every fact kind and every enum value the content layer branches on
 * must yield a real line. Unknown patterns must fall back to a safe generic
 * line rather than nothing.
 */

import { describe, expect, it } from "vitest";
import type { InteractionType, Palace, ReadingFact } from "@daymaster/bazi-engine";
import { DOMINANT_LINES } from "../src/banks/elements.js";
import { dailyReading, natalReading } from "../src/index.js";
import {
  ELEMENTS,
  INTERACTIONS,
  NATAL_PALACES,
  STAGE_LABELS,
  STAR_KEYS,
  STEMS,
  TEN_GODS,
  dailyFactSet,
  natalWithInteractions,
} from "./collect.js";
import { lineFactTag, lineText, plainGloss } from "./token-utils.js";

const SEED = "coverage-seed";

function natalText(facts: ReadingFact[]): string {
  return natalReading(facts, SEED)
    .sections.flatMap((section) => section.lines)
    .map((line) => lineText(line))
    .join(" || ");
}

const DAILY_SEED = { chart: SEED, date: "2026-09-29" };

function dailyText(facts: ReadingFact[]): string {
  const reading = dailyReading(facts, DAILY_SEED);
  return [reading.headline, reading.body, reading.agency].map((line) => lineText(line)).join(" || ");
}

describe("coverage: natal", () => {
  it("every day-master stem yields a 3-line section", () => {
    for (const stem of STEMS) {
      const reading = natalReading(
        [{ kind: "day-master", stem, element: "water", polarity: "yang" }],
        SEED,
      );
      const section = reading.sections.find((current) => current.title === "Your day-master");
      expect(section, `stem ${stem}`).toBeDefined();
      expect(section?.lines).toHaveLength(3);
      for (const line of section!.lines) {
        expect(lineText(line).length).toBeGreaterThan(0);
      }
    }
  });

  it("every dominant element yields its own line", () => {
    for (const dominant of ELEMENTS) {
      // A lead of 2 is what makes an element dominant (M20-17).
      const counts = { wood: 1, fire: 1, earth: 1, metal: 1, water: 1, [dominant]: 3 };
      const text = natalText([{ kind: "element-balance", counts, dominant, missing: [] }]);
      expect(
        DOMINANT_LINES[dominant].some((line) => text.includes(line)),
        `dominant ${dominant}`,
      ).toBe(true);
    }
  });

  it("every missing element yields a line", () => {
    for (const missing of ELEMENTS) {
      const text = natalText([
        {
          kind: "element-balance",
          counts: { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 },
          dominant: "earth",
          missing: [missing],
        },
      ]);
      expect(text.length, `missing ${missing}`).toBeGreaterThan(0);
    }
  });

  it("a full chart (nothing missing) yields a balanced line", () => {
    const text = natalText([
      {
        kind: "element-balance",
        counts: { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 },
        dominant: "earth",
        missing: [],
      },
    ]);
    expect(text.length).toBeGreaterThan(0);
  });

  it("both strength values yield a line", () => {
    for (const value of ["strong", "weak"] as const) {
      const text = natalText([
        { kind: "strength", value, narrow: false, seasonal: value === "strong", rooted: true, backed: false },
      ]);
      expect(text.length, `strength ${value}`).toBeGreaterThan(0);
    }
  });

  it("every favorable element yields a suits + inclinations line", () => {
    for (const element of ELEMENTS) {
      const reading = natalReading([{ kind: "favorable", elements: [element] }], SEED);
      const section = reading.sections.find((current) => current.title === "What tends to suit you");
      expect(section, `favorable ${element}`).toBeDefined();
      // one favorable line + one career line
      expect(section!.lines.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every natal-interaction kind/variant yields a non-generic line", () => {
    const variants: ReadingFact[] = [
      { kind: "natal-interaction", interaction: "six-combine", branches: ["子", "丑"], palaces: ["year", "month"] },
      { kind: "natal-interaction", interaction: "six-clash", branches: ["子", "午"], palaces: ["month", "day"] },
      { kind: "natal-interaction", interaction: "trine", branches: ["申", "子", "辰"], palaces: ["year", "month", "day"], element: "water", completeness: "full" },
      { kind: "natal-interaction", interaction: "trine", branches: ["申", "子"], palaces: ["year", "month"], element: "water", completeness: "half" },
      { kind: "natal-interaction", interaction: "punishment", branches: ["寅", "巳", "申"], palaces: ["year", "month", "day"], punishmentKind: "mutual" },
      { kind: "natal-interaction", interaction: "punishment", branches: ["辰", "辰"], palaces: ["day", "day"], punishmentKind: "self" },
      { kind: "natal-interaction", interaction: "harm", branches: ["子", "未"], palaces: ["year", "day"] },
    ];
    for (const fact of variants) {
      const text = natalText([fact]);
      expect(text.length, JSON.stringify(fact)).toBeGreaterThan(0);
      expect(text, "must not be the generic fallback").not.toMatch(/one of your chart's textures/);
    }
  });

  it("an unknown natal interaction falls back to a safe generic line", () => {
    const bogus = {
      kind: "natal-interaction",
      interaction: "bogus" as InteractionType,
      branches: ["子", "午"],
      palaces: ["year", "month"] as Palace[],
    } satisfies ReadingFact;
    const text = natalText([bogus]);
    expect(text).toMatch(/one of your chart's textures/);
  });
});

describe("coverage: daily", () => {
  it("every interaction x natal palace yields a full first screen", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        const reading = dailyReading(dailyFactSet(interaction, palace, "daily"), DAILY_SEED);
        for (const line of [reading.headline, reading.body, reading.agency]) {
          expect(lineText(line).length, `${interaction}/${palace}`).toBeGreaterThan(0);
        }
        expect(reading.leadTopic).toBe(`interaction:${interaction}:${palace}`);
      }
    }
  });

  it("an unknown transit interaction falls back to the day's character", () => {
    const facts: ReadingFact[] = [
      {
        kind: "transit-interaction",
        interaction: "bogus" as InteractionType,
        branches: ["子", "午"],
        natalPalaces: ["month"],
        transitPalace: "daily",
        transitBranch: "午",
      },
      { kind: "ten-god-day", god: "正官", english: "Direct Officer" },
    ];
    const reading = dailyReading(facts, DAILY_SEED);
    expect(lineText(reading.body).length).toBeGreaterThan(0);
  });

  it("every ten-god english leads a quiet day with its own wording", () => {
    const bodies = new Set<string>();
    for (const english of TEN_GODS) {
      const text = dailyText([{ kind: "ten-god-day", god: "測試", english }]);
      expect(text.length).toBeGreaterThan(0);
      bodies.add(text);
    }
    expect(bodies.size).toBe(TEN_GODS.length);
  });

  it("an unknown ten-god english still reads", () => {
    const text = dailyText([{ kind: "ten-god-day", god: "??", english: "Nonsense God" }]);
    expect(text.length).toBeGreaterThan(0);
  });

  it("every element, star and stage gets a card with a plain title", () => {
    for (const element of ELEMENTS) {
      for (const favorable of [true, false]) {
        const reading = dailyReading([...dailyFactSet("six-clash", "month", "daily").filter((fact) => fact.kind !== "element-day"), { kind: "element-day", element, favorable }], DAILY_SEED);
        const shown = reading.modifierTopic === `element:${element}` || reading.cards.some((card) => card.topic === `element:${element}`);
        expect(shown, `${element}/${favorable}`).toBe(true);
      }
    }
    for (const star of STAR_KEYS) {
      const reading = dailyReading([{ kind: "star-day", star, chinese: "星", english: star, transitPalace: "daily" }], DAILY_SEED);
      const card = reading.cards.find((candidate) => candidate.topic === "stars");
      expect(card && plainGloss(card.titles[0]!), star).not.toBe("A small sign today");
    }
    for (const stage of STAGE_LABELS) {
      const reading = dailyReading([{ kind: "stage-day", stage: { chinese: "階", english: stage } }], DAILY_SEED);
      const card = reading.cards.find((candidate) => candidate.topic === `stage:${stage}`);
      expect(card && plainGloss(card.titles[0]!), stage).not.toBe("Your pace today");
    }
  });
});

describe("coverage: natal stars and strength why", () => {
  it("natal star facts produce a stars section capped at three lines", () => {
    const reading = natalReading(natalWithInteractions(), SEED);
    const stars = reading.sections.find((section) => section.key === "stars");
    expect(stars).toBeDefined();
    expect(stars!.lines.length).toBeGreaterThanOrEqual(1);
    expect(stars!.lines.length).toBeLessThanOrEqual(3);
  });

  it("the strength verdict is followed by its three-check explanation", () => {
    const reading = natalReading(natalWithInteractions(), SEED);
    const elements = reading.sections.find((section) => section.key === "elements");
    const why = elements?.lines.find((line) => lineFactTag(line) === "strength · three checks");
    expect(why).toBeDefined();
    expect(lineText(why!)).toContain("Three checks");
    expect(lineText(why!)).toContain("in season");
  });
});

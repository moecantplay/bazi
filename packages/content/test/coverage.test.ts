/**
 * Coverage: every fact kind and every enum value the content layer branches on
 * must yield a real line. Unknown patterns must fall back to a safe generic
 * line rather than nothing.
 */

import { describe, expect, it } from "vitest";
import type { InteractionType, Palace, ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading, natalReading, stripHanCharacters } from "../src/index.js";
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

const SEED = "coverage-seed";

function natalText(facts: ReadingFact[]): string {
  return natalReading(facts, SEED)
    .sections.flatMap((section) => section.lines)
    .map((line) => line.text)
    .join(" || ");
}

function dailyText(facts: ReadingFact[]): string {
  const reading = dailyReading(facts, SEED);
  return [...reading.lines, reading.agency].map((line) => line.text).join(" || ");
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
        expect(line.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("every dominant element yields a line", () => {
    for (const dominant of ELEMENTS) {
      const text = natalText([
        {
          kind: "element-balance",
          counts: { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 },
          dominant,
          missing: [],
        },
      ]);
      expect(text.length, `dominant ${dominant}`).toBeGreaterThan(0);
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
        { kind: "strength", value, seasonal: value === "strong", rooted: true, backed: false },
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
  it("every interaction x natal palace x transit palace yields lines", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        for (const transitPalace of ["daily", "annual"] as const) {
          const reading = dailyReading(dailyFactSet(interaction, palace, transitPalace), SEED);
          expect(reading.lines.length, `${interaction}/${palace}/${transitPalace}`).toBeGreaterThanOrEqual(2);
          expect(reading.lines.length).toBeLessThanOrEqual(6);
          expect(reading.agency.text.length).toBeGreaterThan(0);
          expect(reading.dos.length, "dos always present").toBeGreaterThanOrEqual(1);
          expect(reading.dos.length).toBeLessThanOrEqual(2);
          expect(reading.donts.length, "donts always present").toBeGreaterThanOrEqual(1);
          expect(reading.donts.length).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  it("inline branches carry their animal gloss and survive the Han strip", () => {
    // dailyFactSet's transit is 子午 with 午 brought by the day: the line must
    // gloss both glyphs (VOICE.md §10) so stripping keeps the sentence whole.
    for (const interaction of INTERACTIONS) {
      const reading = dailyReading(dailyFactSet(interaction, "month", "daily"), SEED);
      const transitLine = reading.lines[0]!.text;
      expect(transitLine, interaction).toContain("午 (horse)");
      const stripped = stripHanCharacters(transitLine);
      expect(stripped, interaction).toContain("horse");
      expect(stripped, interaction).not.toMatch(/[㐀-鿿]/);
    }
  });

  it("an unknown transit interaction falls back to a safe generic line", () => {
    const facts: ReadingFact[] = [
      {
        kind: "transit-interaction",
        interaction: "bogus" as InteractionType,
        branches: ["子", "午"],
        natalPalaces: ["month"],
        transitPalace: "daily",
        transitBranch: "午",
      },
    ];
    const reading = dailyReading(facts, SEED);
    expect(reading.lines[0]?.text).toMatch(/passing weather/);
  });

  it("every element-day (element x favorable) yields a line", () => {
    for (const element of ELEMENTS) {
      for (const favorable of [true, false]) {
        const text = dailyText([{ kind: "element-day", element, favorable }]);
        expect(text.length, `${element}/${favorable}`).toBeGreaterThan(0);
      }
    }
  });

  it("every ten-god english yields a specific (non-generic) line", () => {
    for (const english of TEN_GODS) {
      const text = dailyText([{ kind: "ten-god-day", god: "測試", english }]);
      expect(text, english).not.toMatch(/distinct ten-god note/);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it("an unknown ten-god english falls back to a safe generic line", () => {
    const text = dailyText([{ kind: "ten-god-day", god: "??", english: "Nonsense God" }]);
    expect(text).toMatch(/distinct ten-god note/);
  });

  it("a daily reading always has 2-4 body lines and an agency line", () => {
    // Minimal: only the two always-present day facts.
    const reading = dailyReading(
      [
        { kind: "element-day", element: "metal", favorable: false },
        { kind: "ten-god-day", god: "正官", english: "Direct Officer" },
      ],
      SEED,
    );
    expect(reading.lines.length).toBe(2);
    expect(reading.agency.text.length).toBeGreaterThan(0);
    expect(reading.agency.factTag).toBeNull();
  });

  it("a minimal reading still offers one do and one don't (generic fallback)", () => {
    const reading = dailyReading(
      [{ kind: "ten-god-day", god: "正官", english: "Direct Officer" }],
      SEED,
    );
    expect(reading.dos.length).toBe(1);
    expect(reading.donts.length).toBe(1);
    expect(reading.dos[0]?.factTag).toBeNull();
    expect(reading.donts[0]?.factTag).toBeNull();
  });

  it("every star key yields a star-day line naming the star", () => {
    for (const star of STAR_KEYS) {
      const text = dailyText([
        { kind: "star-day", star, chinese: "星", english: `Star ${star}`, transitPalace: "daily" },
      ]);
      expect(text, star).toContain(`Star ${star}`);
    }
  });

  it("every life-stage label yields a stage-day line naming the stage", () => {
    for (const label of STAGE_LABELS) {
      const text = dailyText([
        { kind: "stage-day", stage: { chinese: "段", english: label } },
      ]);
      expect(text, label).toContain(`'${label}' stage`);
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
    const why = elements?.lines.find((line) => line.factTag === "strength · three checks");
    expect(why).toBeDefined();
    expect(why!.text).toContain("Three checks");
    expect(why!.text).toContain("得令");
  });
});

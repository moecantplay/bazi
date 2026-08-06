/**
 * Voice compliance, automated against VOICE.md. Every line in the bank and
 * every line the public API can emit is checked for banned words, sentence
 * count, and third-person phrasing.
 */

import { describe, expect, it } from "vitest";
import {
  ACTIVITY_LABELS,
  DAY_MASTER_GLOSS,
  DISCLAIMER,
  INTERACTION_GLOSSES,
  LUCK_PILLAR_GLOSS,
  OFFICER_GLOSSES,
  TEN_GOD_GLOSSES,
  compareReading,
  dailyReading,
  luckTransitionLines,
  natalReading,
} from "../src/index.js";
import type { ReadingLine } from "../src/index.js";
import { DATE_WHY_CLAUSES, DAY_GUIDANCE_TEMPLATES } from "../src/banks/day-guidance.js";
import { HORIZON_TEMPLATES, TEN_GOD_PERIOD_THEMES } from "../src/banks/horizons.js";
import {
  INTERACTIONS,
  NATAL_PALACES,
  TEN_GODS,
  allBankLines,
  compareFactSet,
  dailyFactSet,
  natalFactSets,
  natalWithInteractions,
} from "./collect.js";
import { lineText } from "./token-utils.js";

/** Words VOICE.md bans outright, plus regulated-domain directives. */
const BANNED_PATTERNS: readonly RegExp[] = [
  /\benergy\b/i,
  /\bvibrations?\b/i,
  /\buniverse\b/i,
  /\bdestiny\b/i,
  /\bfate\b/i,
  /\bwill happen\b/i,
  /\byou will\b/i,
  /\byou can't\b/i,
  /\bmust\b/i,
  /\bshould\b/i,
  /the native/i,
];

/** Count sentence terminators (`. ! ?`), treating em-dashes/semicolons as inline. */
function countSentences(text: string): number {
  const matches = text.match(/[.!?]+(?=\s|$)/g);
  return matches ? matches.length : 0;
}

function assertVoiceCompliant(text: string): void {
  expect(text.length, `line must be non-empty: "${text}"`).toBeGreaterThan(0);
  for (const pattern of BANNED_PATTERNS) {
    expect(pattern.test(text), `banned by ${pattern} -> "${text}"`).toBe(false);
  }
  const sentences = countSentences(text);
  expect(sentences, `must be 1-2 sentences (found ${sentences}): "${text}"`).toBeLessThanOrEqual(2);
  expect(sentences, `must end with terminal punctuation: "${text}"`).toBeGreaterThanOrEqual(1);
}

/** Every line the public API produces across the enum space, plus its agency lines. */
function allEmittedLines(): ReadingLine[] {
  const lines: ReadingLine[] = [];
  const seeds = ["seed-a", "seed-b", "seed-c"];

  for (const seed of seeds) {
    for (const facts of natalFactSets()) {
      for (const section of natalReading(facts, seed).sections) {
        lines.push(...section.lines);
      }
    }
    for (const section of natalReading(natalWithInteractions(), seed).sections) {
      lines.push(...section.lines);
    }
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        for (const transitPalace of ["daily", "annual"] as const) {
          const reading = dailyReading(dailyFactSet(interaction, palace, transitPalace), seed);
          lines.push(reading.headline, ...reading.lines, reading.agency);
        }
      }
    }
    for (const english of TEN_GODS) {
      const reading = dailyReading(
        dailyFactSet("six-clash", "day", "daily", { english, god: "測試" }),
        seed,
      );
      lines.push(...reading.lines, reading.agency);
    }
    lines.push(...luckTransitionLines({ fromAge: 33, toAge: 43 }, seed));
    lines.push(...compareReading(compareFactSet(), seed).lines);
  }
  return lines;
}

describe("voice compliance", () => {
  it("every static bank line obeys VOICE.md", () => {
    const lines = allBankLines();
    expect(lines.length).toBeGreaterThan(150);
    for (const line of lines) {
      assertVoiceCompliant(line);
    }
  });

  it("every line the public API emits obeys VOICE.md", () => {
    for (const line of allEmittedLines()) {
      assertVoiceCompliant(lineText(line));
    }
  });

  it("the disclaimer is verbatim from VOICE.md", () => {
    expect(DISCLAIMER).toBe(
      "Daymaster is for reflection and entertainment, not advice. BaZi is a living tradition with many schools; this app implements one reading of it, with its assumptions documented. Nothing here predicts your future or diagnoses anything about you. You remain the author.",
    );
  });

  it("every system term has a voice-clean gloss (VOICE.md §11)", () => {
    for (const god of TEN_GODS) {
      expect(TEN_GOD_GLOSSES[god], `gloss for ${god}`).toBeDefined();
    }
    for (const interaction of INTERACTIONS) {
      expect(INTERACTION_GLOSSES[interaction], `gloss for ${interaction}`).toBeDefined();
    }
    for (const god of TEN_GODS) {
      expect(TEN_GOD_PERIOD_THEMES[god], `period theme for ${god}`).toBeDefined();
    }
    const glosses = [
      DAY_MASTER_GLOSS,
      LUCK_PILLAR_GLOSS,
      ...Object.values(INTERACTION_GLOSSES),
      ...Object.values(TEN_GOD_GLOSSES),
      ...Object.values(TEN_GOD_PERIOD_THEMES),
    ];
    for (const gloss of glosses) {
      expect(gloss.length, "gloss must be non-empty").toBeGreaterThan(0);
      for (const pattern of BANNED_PATTERNS) {
        expect(pattern.test(gloss), `banned by ${pattern} -> "${gloss}"`).toBe(false);
      }
    }
  });

  it("layered-guidance templates never verdict or prohibit (VOICE.md rule 12)", () => {
    // The chip/prose layer bans these outright; postponement replaces every one.
    const rule12Banned: readonly RegExp[] = [
      /\bavoid\b/i,
      /\binauspicious\b/i,
      /\bbad luck\b/i,
      /\bdon['’]t\b/i,
    ];
    const templates = [
      ...DAY_GUIDANCE_TEMPLATES,
      ...HORIZON_TEMPLATES,
      ...Object.values(DATE_WHY_CLAUSES),
    ];
    for (const template of templates) {
      for (const pattern of rule12Banned) {
        expect(pattern.test(template), `banned by ${pattern} -> "${template}"`).toBe(false);
      }
    }
  });

  it("every officer gloss, activity label, and why-clause is voice-clean", () => {
    const fragments = [
      ...Object.values(OFFICER_GLOSSES),
      ...Object.values(ACTIVITY_LABELS).map((label) => label.label),
      ...Object.values(DATE_WHY_CLAUSES),
    ];
    expect(Object.keys(OFFICER_GLOSSES)).toHaveLength(12);
    expect(Object.keys(ACTIVITY_LABELS)).toHaveLength(10);
    for (const fragment of fragments) {
      expect(fragment.length, "fragment must be non-empty").toBeGreaterThan(0);
      for (const pattern of BANNED_PATTERNS) {
        expect(pattern.test(fragment), `banned by ${pattern} -> "${fragment}"`).toBe(false);
      }
    }
  });

  it("unknown-time charts never reference the hour palace", () => {
    // Three-pillar facts: no palace is ever "hour".
    const facts = natalFactSets()[0]!;
    const reading = natalReading(facts, "seed-x");
    const text = reading.sections.flatMap((section) => section.lines).map((line) => lineText(line)).join(" ");
    expect(text).not.toMatch(/horizon/i);
    expect(text).not.toMatch(/hour palace/i);
    expect(text).not.toMatch(/four pillars/i);
  });
});

/**
 * Glossary: every entry is voice-clean and strip-safe, and every topic a
 * reading line carries resolves to an entry — a caption never links nowhere.
 */

import { describe, expect, it } from "vitest";
import {
  GLOSSARY,
  READING_TOPIC,
  WEEK_TOPIC,
  compareReading,
  dailyReading,
  glossaryEntry,
  horizonReading,
  luckTransitionLines,
  natalReading,
  stripHanCharacters,
} from "../src/index.js";
import type { ReadingLine } from "../src/index.js";
import {
  INTERACTIONS,
  NATAL_PALACES,
  TEN_GODS,
  compareFactSet,
  dailyFactSet,
  natalWithInteractions,
} from "./collect.js";

/** The same outright bans voice.test.ts applies to reading lines. */
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

function countSentences(text: string): number {
  const matches = text.match(/[.!?]+(?=\s|$)/g);
  return matches ? matches.length : 0;
}

/** Lines from every public reading builder, across the enum space. */
function emittedLines(): ReadingLine[] {
  const seed = "gloss-seed";
  const lines: ReadingLine[] = [];
  for (const interaction of INTERACTIONS) {
    for (const palace of NATAL_PALACES) {
      const reading = dailyReading(dailyFactSet(interaction, palace, "daily"), seed);
      lines.push(...reading.lines, ...reading.dos, ...reading.donts, reading.agency);
    }
  }
  for (const english of TEN_GODS) {
    const reading = horizonReading(
      {
        annualPillar: { stem: "丙", branch: "午" },
        monthlyPillar: { stem: "乙", branch: "卯" },
        annual: [{ kind: "ten-god-period", period: "annual", god: "測試", english }],
        monthly: [{ kind: "element-period", period: "monthly", element: "wood", favorable: false }],
      },
      seed,
    );
    lines.push(...reading.annual, ...reading.monthly);
  }
  for (const section of natalReading(natalWithInteractions(), seed).sections) {
    lines.push(...section.lines);
  }
  lines.push(...compareReading(compareFactSet(), seed).lines);
  lines.push(...luckTransitionLines({ fromAge: 33, toAge: 43 }, seed));
  return lines;
}

describe("glossary entries", () => {
  it("every entry has a title and short, voice-clean paragraphs", () => {
    const entries = Object.entries(GLOSSARY);
    expect(entries.length).toBeGreaterThan(40);
    for (const [topic, entry] of entries) {
      expect(entry.title.length, topic).toBeGreaterThan(0);
      expect(entry.body.length, topic).toBeGreaterThanOrEqual(2);
      for (const paragraph of entry.body) {
        for (const pattern of BANNED_PATTERNS) {
          expect(pattern.test(paragraph), `banned by ${pattern} -> "${paragraph}"`).toBe(false);
        }
        const sentences = countSentences(paragraph);
        expect(sentences, `1-2 sentences: "${paragraph}"`).toBeLessThanOrEqual(2);
        expect(sentences, `terminal punctuation: "${paragraph}"`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("every entry survives the Han strip with text intact", () => {
    for (const [topic, entry] of Object.entries(GLOSSARY)) {
      for (const text of [entry.title, ...entry.body]) {
        const stripped = stripHanCharacters(text);
        expect(stripped.length, `${topic}: "${text}"`).toBeGreaterThan(0);
        expect(stripped, topic).not.toMatch(/[㐀-鿿]/);
      }
    }
  });

  it("the read-more overview exists", () => {
    expect(glossaryEntry(READING_TOPIC)?.title).toBe("How this reading works");
  });

  it("the week-strip legend entry exists and names all three marks", () => {
    const entry = glossaryEntry(WEEK_TOPIC);
    expect(entry?.title).toBe("The week ahead");
    const text = entry!.body.join(" ");
    for (const mark of ["filled dot", "open ring", "dash"]) {
      expect(text).toContain(mark);
    }
  });

  it("every topic on an emitted line resolves to an entry", () => {
    let topicsSeen = 0;
    for (const line of emittedLines()) {
      if (line.topic === undefined) {
        continue;
      }
      topicsSeen += 1;
      expect(glossaryEntry(line.topic), `${line.topic} <- "${line.text}"`).toBeDefined();
    }
    expect(topicsSeen).toBeGreaterThan(50);
  });

  it("captioned daily body lines always carry a topic", () => {
    // Every body line on the Today screen cites a concept the glossary covers.
    const reading = dailyReading(dailyFactSet("trine", "month", "daily"), "seed");
    for (const line of reading.lines) {
      expect(line.topic, line.text).toBeDefined();
    }
    expect(reading.lines[0]!.topic).toBe("interaction:trine");
  });
});

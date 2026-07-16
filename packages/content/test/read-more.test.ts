/**
 * Read-more deep dives: voice-clean and strip-safe like every other user-facing
 * text, present for every interaction type, and never re-teaching the category
 * the glossary already covers.
 */

import { describe, expect, it } from "vitest";
import { GLOSSARY, READ_MORE, readMoreEntry, stripHanCharacters } from "../src/index.js";
import { INTERACTIONS } from "./collect.js";

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

describe("read-more deep dives", () => {
  it("every dive has a title, an essay, and working-with-it advice — all voice-clean", () => {
    const entries = Object.entries(READ_MORE);
    expect(entries.length).toBeGreaterThanOrEqual(5);
    for (const [topic, entry] of entries) {
      expect(entry.title.length, topic).toBeGreaterThan(0);
      expect(entry.body.length, topic).toBeGreaterThanOrEqual(3);
      expect(entry.advice.length, topic).toBeGreaterThanOrEqual(1);
      for (const paragraph of [...entry.body, ...entry.advice]) {
        for (const pattern of BANNED_PATTERNS) {
          expect(pattern.test(paragraph), `banned by ${pattern} -> "${paragraph}"`).toBe(false);
        }
        const sentences = countSentences(paragraph);
        expect(sentences, `1-2 sentences: "${paragraph}"`).toBeLessThanOrEqual(2);
        expect(sentences, `terminal punctuation: "${paragraph}"`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("every dive survives the Han strip with text intact", () => {
    for (const [topic, entry] of Object.entries(READ_MORE)) {
      for (const text of [entry.title, ...entry.body, ...entry.advice]) {
        const stripped = stripHanCharacters(text);
        expect(stripped.length, `${topic}: "${text}"`).toBeGreaterThan(0);
        expect(stripped, topic).not.toMatch(/[㐀-鿿]/);
      }
    }
  });

  it("every interaction type has a dive, on a topic the glossary also covers", () => {
    for (const interaction of INTERACTIONS) {
      const topic = `interaction:${interaction}`;
      expect(readMoreEntry(topic), topic).toBeDefined();
      expect(GLOSSARY[topic], topic).toBeDefined();
    }
  });

  it("a dive never repeats its category's glossary description", () => {
    for (const [topic, dive] of Object.entries(READ_MORE)) {
      const glossary = GLOSSARY[topic];
      if (!glossary) {
        continue;
      }
      for (const paragraph of dive.body) {
        expect(glossary.body, `${topic}: "${paragraph}"`).not.toContain(paragraph);
      }
    }
  });
});

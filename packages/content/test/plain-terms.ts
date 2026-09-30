/**
 * The plain-words check for Today (VOICE.md rules 11 and 13, M20-21 R10):
 * Today's headline, body, agency and topic cards name no system term. Old
 * names and sign mechanics belong on topic pages.
 */

import { expect } from "vitest";

const SYSTEM_TERMS: readonly RegExp[] = [
  /\b(rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig)s?\b/i,
  /\bpalaces?\b/i,
  /\broots\b/i,
  /\bhorizon\b/i,
  /\b(wood|fire|earth|metal|water)\b/i,
  /\b(clash|clashes|combine|combines|trine|trines|harm|harms|punishment|punishments)\b/i,
  /\b(Rob Wealth|Eating God|Hurting Officer|Indirect Wealth|Direct Wealth|Seven Killings|Direct Officer|Indirect Resource|Direct Resource)\b/,
  /\b(Nobleman|Peach Blossom|Canopy|Calamity|Mourning Gate|Flying Blade|Heavenly Joy|Monthly Virtue|Scholar Star|General Star|Goat Blade|Travel Horse)\b/,
  /\bold (calendars|books|almanacs?)\b/i,
  /\bchart\b/i,
  /\bten gods?\b/i,
];

/** Fails if a Today line names a system term. */
export function assertPlain(text: string): void {
  for (const pattern of SYSTEM_TERMS) {
    expect(pattern.test(text), `system term ${pattern} on Today: "${text}"`).toBe(false);
  }
}

/** Lower-cased word list, punctuation stripped, apostrophes kept. */
export function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'’ ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Every distinct 4-word phrase in a text, within sentences (never across a break). */
export function fourGrams(text: string): Set<string> {
  const grams = new Set<string>();
  for (const sentence of text.split(/[.!?;:]+/)) {
    const words = wordsOf(sentence);
    for (let index = 0; index + 4 <= words.length; index += 1) {
      grams.add(words.slice(index, index + 4).join(" "));
    }
  }
  return grams;
}

/** The 4-word phrases two texts share. */
export function sharedFourGrams(a: string, b: string): string[] {
  const other = fourGrams(b);
  return [...fourGrams(a)].filter((gram) => other.has(gram));
}

/** Sentence count: terminators followed by space or end. */
export function sentenceCount(text: string): number {
  return (text.match(/[.!?]+(?=\s|$)/g) ?? []).length;
}

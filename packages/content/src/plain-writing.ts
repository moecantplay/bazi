/**
 * VOICE.md "Plain writing" rules 1–4 (M24-11 R1), checkable on any line: the
 * bank walk in content's tests and every rendered screen in presentation's
 * tests use this one copy, so both count a break the same way. Each pattern
 * carries its reason.
 */

export type PlainRule = "em-dash" | "long-sentence" | "contrast" | "stock-phrase";

interface Banned {
  pattern: RegExp;
  reason: string;
}

const MAX_SENTENCE_WORDS = 25;

/** Rule 1: an em-dash; a dash made of hyphens or a spaced en-dash; an en-dash not followed by a number ("5–7 pm" and "11 pm–1 am" pass). */
const DASH = /—|\s-{1,2}\s|--|\s–\s|–(?!\d)/;

const CONTRAST: readonly Banned[] = [
  { pattern: /\b(?:is|are|was|it's|that's)\s+not\s+[^.;,]{1,30},?\s+but\b/i, reason: "\"It's not X, but Y\": the aphorism, not an ordinary \"do not rush, but do send\"" },
  { pattern: /(?:^|[.!?]\s+)not\s+[^.;,]{1,30},\s+it(?:'s|\s+is)\b/i, reason: "\"Not X, it's Y\" opening a sentence" },
  { pattern: /\b(\w+), [^;]+; un\1\b/i, reason: "\"Aimed, it cuts through; unaimed, it…\"" },
  { pattern: /\b(\w+); un\1\b/i, reason: "\"Planned; unplanned, it drifts\"" },
  { pattern: /\w, not\s/i, reason: "\"X, not Y\": \"a hinge, not a wound\" (owner, 2026-10-23)" },
];

const STOCK: readonly Banned[] = [
  { pattern: /^The day sits at your\b/i, reason: "fixed opener the old Today repeated daily (M20-13)" },
  { pattern: /\bverdicts?\b/i, reason: "reassurance by denial; hand over the wheel instead (VOICE.md rule 4)" },
  { pattern: /\btextures?\b/i, reason: "abstract stand-in; name the situation (rule 3)" },
  { pattern: /\bflavou?rs?\b/i, reason: "abstract stand-in; name the situation (rule 3)" },
  { pattern: /\bseasoning\b/i, reason: "abstract stand-in; say what it changes" },
  { pattern: /\bnever a prediction\b/i, reason: "repeated disclaimer; the topic page's closing line says it once" },
  { pattern: /\bnever sentence\b/i, reason: "repeated reassurance in every officer entry" },
  { pattern: /\bniggl(?:e|es|ing)\b/i, reason: "the owner dislikes the word (2026-10-27); name the snag, gripe or sore point" },
];

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/** Counted as presentation's M20-21 tests and the copy audit count words. */
function wordCount(text: string): number {
  return text.toLowerCase().replace(/[^a-z0-9'’ ]+/g, " ").split(/\s+/).filter(Boolean).length;
}

/** Which rules a line breaks. The dash rule checks every string; the others only prose (words with spaces between). */
export function brokenRules(text: string): PlainRule[] {
  const broken: PlainRule[] = [];
  if (DASH.test(text)) {
    broken.push("em-dash");
  }
  if (!/[a-z]/i.test(text) || !text.includes(" ")) {
    return broken;
  }
  if (sentencesOf(text).some((sentence) => wordCount(sentence) > MAX_SENTENCE_WORDS)) {
    broken.push("long-sentence");
  }
  if (CONTRAST.some(({ pattern }) => pattern.test(text))) {
    broken.push("contrast");
  }
  if (STOCK.some(({ pattern }) => pattern.test(text))) {
    broken.push("stock-phrase");
  }
  return broken;
}

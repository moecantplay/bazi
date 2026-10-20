/**
 * The plain-writing rules (VOICE.md "Plain writing", M24-11 R1) and the lines
 * they run over: every string reachable from every bank module and the
 * reference copy (vocab, glossary, marks, read-more), rendered with sample
 * values; every function those modules export; and the chart page's composed
 * lines. Bank files are found on disk, so a new bank is checked without anyone
 * remembering to add it, and a new function bank fails until it is called here.
 */

import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Element, Palace, Stem } from "@daymaster/bazi-engine";
import { colourFixLine, dayColourLine } from "../src/banks/colours.js";
import { dayTonePhrase } from "../src/banks/daily/day-tone.js";
import { firstWeekKicker } from "../src/banks/first-week.js";
import { natalStarLine } from "../src/banks/stars.js";
import { welcomeHeadline } from "../src/banks/welcome.js";
import { portraitLine, portraitRest } from "../src/banks/you/portrait.js";
import { easeLine } from "../src/banks/you/you.js";
import { natalReading } from "../src/index.js";
import { finalizeLine } from "../src/types.js";
import { ELEMENTS, NATAL_PALACES, STAR_KEYS, STEMS, natalFactSets, natalWithInteractions, render } from "./collect.js";
import { lineText } from "./token-utils.js";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "../src");

/** Reference copy outside src/banks that readers see (chart captions, marks legend, read-more cards). */
const EXTRA_MODULES = ["vocab.ts", "glossary.ts", "marks.ts", "read-more.ts"];

/** compare.ts: since M24-12 retired Compare, People reads only the compare facts, so these lines reach no screen. */
const EXCLUDED_MODULES = ["banks/compare.ts"];

/** Function exports called by `functionBankLines` or `natalReading` below. */
const CALLED_FUNCTIONS = [
  "colourFixLine", "dayColourLine", "dayTonePhrase", "easeLine", "firstWeekKicker", "natalInteractionLine",
  "natalStarLine", "portraitLine", "portraitRest", "welcomeHeadline",
];

/** Function exports that build no line: word and token helpers whose output lands inside checked lines, and lookups of walked data. */
const NON_LINE_FUNCTIONS = [
  "branchTokenRuns", "elementWord", "glossaryEntry", "hourWindowLabel", "interactionTagRuns", "interactionWord",
  "joinBranchRuns", "palacePhrase", "palaceWord", "readMoreEntry", "stemTokenRuns",
];

export type PlainRule = "em-dash" | "long-sentence" | "contrast" | "stock-phrase";

export interface PlainLine {
  module: string;
  text: string;
}

export interface PlainFailure extends PlainLine {
  rule: PlainRule;
}

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
];

const STOCK: readonly Banned[] = [
  { pattern: /^The day sits at your\b/i, reason: "fixed opener the old Today repeated daily (M20-13)" },
  { pattern: /\bverdicts?\b/i, reason: "reassurance by denial; hand over the wheel instead (VOICE.md rule 4)" },
  { pattern: /\btextures?\b/i, reason: "abstract stand-in; name the situation (rule 3)" },
  { pattern: /\bflavou?rs?\b/i, reason: "abstract stand-in; name the situation (rule 3)" },
  { pattern: /\bseasoning\b/i, reason: "abstract stand-in; say what it changes" },
  { pattern: /\bnever a prediction\b/i, reason: "repeated disclaimer; the topic page's closing line says it once" },
  { pattern: /\bnever sentence\b/i, reason: "repeated reassurance in every officer entry" },
];

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      return filesUnder(path);
    }
    return path.endsWith(".ts") ? [path] : [];
  });
}

function stringsIn(value: unknown, found: string[]): void {
  if (typeof value === "string") {
    found.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => stringsIn(item, found));
    return;
  }
  if (value !== null && typeof value === "object") {
    Object.values(value).forEach((item) => stringsIn(item, found));
  }
}

function functionBankLines(): string[] {
  const starLines = STAR_KEYS.flatMap((star) =>
    NATAL_PALACES.map((palace: Palace) => lineText(finalizeLine(natalStarLine({ star, chinese: "星", english: star }, palace)))),
  );
  return [
    ...STEMS.flatMap((stem: Stem) => [portraitLine(stem), portraitRest(stem)]),
    ...ELEMENTS.map((element: Element) => easeLine(element)),
    colourFixLine("red", "green"),
    dayColourLine("lean", "red"),
    dayColourLine("steady", "red"),
    ...(["favoured", "friction", "even"] as const).map((tone) => dayTonePhrase(tone)),
    firstWeekKicker(2),
    welcomeHeadline("unknown"),
    ...starLines,
  ];
}

/** The chart page's composed lines (strength tally, star and interaction lines), over every natal fact set. */
function natalReadingLines(): string[] {
  const sets = [...natalFactSets(), natalWithInteractions()];
  return ["seed-a", "seed-b", "seed-c"].flatMap((seed) =>
    sets.flatMap((facts) => natalReading(facts, seed).sections.flatMap((section) => section.lines.map(lineText))),
  );
}

/** Every line, tagged with where it came from, and the names of the functions the walked modules export. */
export async function plainWritingLines(): Promise<{ lines: PlainLine[]; functionExports: string[] }> {
  const paths = [...filesUnder(join(SRC, "banks")), ...EXTRA_MODULES.map((name) => join(SRC, name))];
  const lines: PlainLine[] = [];
  const functionExports: string[] = [];
  for (const path of paths.sort()) {
    const module = relative(SRC, path);
    if (EXCLUDED_MODULES.includes(module)) {
      continue;
    }
    const exports: Record<string, unknown> = await import(pathToFileURL(path).href);
    functionExports.push(...Object.entries(exports).filter(([, value]) => typeof value === "function").map(([name]) => name));
    const found: string[] = [];
    Object.values(exports).forEach((value) => stringsIn(value, found));
    lines.push(...[...new Set(found.map(render))].map((text) => ({ module, text })));
  }
  lines.push(...[...new Set(functionBankLines())].map((text) => ({ module: "function banks", text })));
  lines.push(...[...new Set(natalReadingLines())].map((text) => ({ module: "rendered: chart page", text })));
  return { lines, functionExports };
}

/** Function exports that are neither called nor listed as building no line. */
export function uncheckedFunctions(functionExports: readonly string[]): string[] {
  return functionExports.filter((name) => !CALLED_FUNCTIONS.includes(name) && !NON_LINE_FUNCTIONS.includes(name));
}

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

export function failureKey(failure: PlainFailure): string {
  return `${failure.rule} | ${failure.module} | ${failure.text}`;
}

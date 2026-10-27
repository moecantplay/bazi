/**
 * The lines VOICE.md's plain-writing rules (src/plain-writing.ts, M24-11 R1)
 * run over: every string reachable from every bank module and the
 * reference copy (vocab, glossary, marks, read-more), rendered with sample
 * values; every function those modules export; and the chart page's composed
 * lines. Bank files are found on disk, so a new bank is checked without anyone
 * remembering to add it, and a new function bank fails until it is called here.
 * A string with choice groups (R11) is checked in every wording.
 */

import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Element, Palace, Stem } from "@daymaster/bazi-engine";
import { colourFixLine } from "../src/banks/colours.js";
import { dayTonePhrase } from "../src/banks/daily/day-tone.js";
import { firstWeekKicker } from "../src/banks/first-week.js";
import { natalStarLine } from "../src/banks/stars.js";
import { welcomeHeadline } from "../src/banks/welcome.js";
import { portraitLine, portraitRest } from "../src/banks/you/portrait.js";
import { easeLine } from "../src/banks/you/you.js";
import { everyWording } from "../src/choices.js";
import { DISCLAIMER, natalReading } from "../src/index.js";
import type { PlainRule } from "../src/plain-writing.js";
import { finalizeLine } from "../src/types.js";
import { ELEMENTS, NATAL_PALACES, STAR_KEYS, STEMS, natalFactSets, natalWithInteractions, render } from "./collect.js";
import { lineText } from "./token-utils.js";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "../src");

/** Reference copy outside src/banks that readers see (chart captions, marks legend, read-more cards). */
const EXTRA_MODULES = ["vocab.ts", "glossary.ts", "marks.ts", "read-more.ts"];

/** compare.ts: since M24-12 retired Compare, People reads only the compare facts, so these lines reach no screen. */
const EXCLUDED_MODULES = ["banks/compare.ts"];

/** Lines the rules don't apply to, each with its reason. */
const ALLOWED_LINES: readonly { text: string; reason: string }[] = [
  { text: DISCLAIMER, reason: "VOICE.md's verbatim disclaimer: it changes only through VOICE.md, and voice.test.ts holds it word for word" },
];

/** Function exports called by `functionBankLines` or `natalReading` below. */
const CALLED_FUNCTIONS = [
  "colourFixLine", "dayTonePhrase", "easeLine", "firstWeekKicker", "natalInteractionLine",
  "natalStarLine", "portraitLine", "portraitRest", "welcomeHeadline",
];

/** Function exports that build no line: word and token helpers whose output lands inside checked lines, and lookups of walked data. */
const NON_LINE_FUNCTIONS = [
  "branchTokenRuns", "elementWord", "glossaryEntry", "hourWindowLabel", "interactionTagRuns", "interactionWord",
  "joinBranchRuns", "palacePhrase", "palaceWord", "readMoreEntry", "stemTokenRuns",
];

export interface PlainLine {
  module: string;
  text: string;
  /** The bank string this wording came from, groups and placeholders unresolved. */
  source: string;
}

export interface PlainFailure extends PlainLine {
  rule: PlainRule;
}

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
    for (const source of new Set(found)) {
      lines.push(...[...new Set(everyWording(source).map(render))].map((text) => ({ module, text, source })));
    }
  }
  lines.push(...[...new Set(functionBankLines())].map((text) => ({ module: "function banks", text, source: text })));
  lines.push(...[...new Set(natalReadingLines())].map((text) => ({ module: "rendered: chart page", text, source: text })));
  const allowed = new Set(ALLOWED_LINES.map((entry) => entry.text));
  return { lines: lines.filter((line) => !allowed.has(line.text)), functionExports };
}

/** Function exports that are neither called nor listed as building no line. */
export function uncheckedFunctions(functionExports: readonly string[]): string[] {
  return functionExports.filter((name) => !CALLED_FUNCTIONS.includes(name) && !NON_LINE_FUNCTIONS.includes(name));
}

export function failureKey(failure: PlainFailure): string {
  return `${failure.rule} | ${failure.module} | ${failure.text}`;
}

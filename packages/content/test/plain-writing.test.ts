/**
 * VOICE.md "Plain writing" rules 1–4 (M24-11 R2) over every bank line: every
 * string the banks and reference copy export, rendered; every function bank;
 * and the chart page's composed lines. Choice groups (R11) are checked in
 * every wording, and kept small enough to read.
 */

import { describe, expect, it } from "vitest";
import { choiceGroups } from "../src/choices.js";
import { brokenRules } from "../src/plain-writing.js";
import { failureKey, plainWritingLines, uncheckedFunctions, type PlainFailure } from "./plain-writing-rules.js";

const { lines, functionExports } = await plainWritingLines();
const failures: PlainFailure[] = lines.flatMap((line) => brokenRules(line.text).map((rule) => ({ ...line, rule })));

/** Banks every reader picks through the rotation picker, so their choice groups resolve (design, Phase 4). */
const PICKED_BANKS = /^banks\/(?:daily\/|ahead\/|colours\.ts$)/;

const MAX_GROUPS_PER_SENTENCE = 3;
const MAX_PARTS_PER_GROUP = 4;
const grouped = [...new Set(lines.map((line) => line.source))].filter((source) => source.includes("["));

/** What's wrong with a string's choice groups: too many in a sentence, too many parts, an empty part, a stray bracket or pipe. */
function groupProblems(source: string): string[] {
  const problems: string[] = [];
  for (const sentence of source.split(/(?<=[.!?])\s+/)) {
    const groups = choiceGroups(sentence);
    if (groups.length > MAX_GROUPS_PER_SENTENCE) {
      problems.push(`${groups.length} groups in "${sentence}"`);
    }
    for (const parts of groups) {
      if (parts.length < 2 || parts.length > MAX_PARTS_PER_GROUP || parts.some((part) => part.trim() === "")) {
        problems.push(`group [${parts.join("|")}] needs 2–${MAX_PARTS_PER_GROUP} non-empty parts`);
      }
    }
  }
  if (/[[\]|]/.test(source.replace(/\[[^[\]]*\]/g, ""))) {
    problems.push(`stray bracket or pipe in "${source}"`);
  }
  return problems;
}

/** "a" before a vowel sound, or "an" before a consonant one, in a wording a choice group built. */
const ARTICLE = /\b(?:a\s+(?!one\b|once\b|use|usu|uni|euro)[aeiou]|an\s+(?!hour|honest|honour|heir)[^aeiou\W])/i;

describe("plain writing (VOICE.md)", () => {
  it("reaches every bank", () => {
    expect(lines.length).toBeGreaterThan(1500);
  });

  it("calls every function bank, or says why it builds no line", () => {
    expect(uncheckedFunctions(functionExports), "add to CALLED_FUNCTIONS (and call it) or NON_LINE_FUNCTIONS").toEqual([]);
  });

  it("no line breaks a rule", () => {
    expect(failures.map(failureKey)).toEqual([]);
  });

  it("keeps every choice group small and whole", () => {
    expect(grouped.flatMap((source) => groupProblems(source).map((problem) => `${problem} | ${source}`))).toEqual([]);
  });

  it("uses \"a\" and \"an\" right in every wording a choice group builds", () => {
    const wrong = lines.filter((line) => line.source.includes("[") && ARTICLE.test(line.text)).map((line) => line.text);
    expect(wrong).toEqual([]);
  });

  it("keeps choice groups to the banks read through a picker", () => {
    const outside = lines.filter((line) => line.source.includes("[") && !PICKED_BANKS.test(line.module)).map((line) => `${line.module} | ${line.source}`);
    expect([...new Set(outside)]).toEqual([]);
  });

  it("finds choice-group problems", () => {
    expect(groupProblems("[A|B] [c|d] [e|f] [g|h] go.")).toHaveLength(1);
    expect(groupProblems("[a|b|c|d|e] go.")).toHaveLength(1);
    expect(groupProblems("[a|] go.")).toHaveLength(1);
    expect(groupProblems("[a|b go.")).toHaveLength(1);
    expect(groupProblems("[Ask|Check] first. [Then|After that] [go|move] [on|ahead] [now|today].")).toHaveLength(1);
    expect(ARTICLE.test("a early start")).toBe(true);
    expect(ARTICLE.test("an small step")).toBe(true);
    expect(ARTICLE.test("a usual day, an hour, a one-off, an early start")).toBe(false);
  });

  it("checks each rule", () => {
    expect(brokenRules("Rest a moment — then go.")).toEqual(["em-dash"]);
    expect(brokenRules("Easiest 5–7 pm, roughest 11 pm–1 am.")).toEqual([]);
    expect(brokenRules("Take it slow – then go.")).toEqual(["em-dash"]);
    expect(brokenRules("Monday–Friday")).toEqual(["em-dash"]);
    expect(brokenRules("steady—or not")).toEqual(["em-dash"]);
    expect(brokenRules("Slow down -- then go.")).toEqual(["em-dash"]);
    expect(brokenRules(`${"word ".repeat(26).trim()}.`)).toEqual(["long-sentence"]);
    expect(brokenRules("It's not luck, but timing.")).toEqual(["contrast"]);
    expect(brokenRules("Not luck, it's timing.")).toEqual(["contrast"]);
    expect(brokenRules("Do not rush the email, but do send it.")).toEqual([]);
    expect(brokenRules("If not today, it is fine tomorrow.")).toEqual([]);
    expect(brokenRules("Planned; unplanned, it drifts.")).toEqual(["contrast"]);
    expect(brokenRules("Aimed, it cuts through; unaimed, it cuts whatever's near.")).toEqual(["contrast"]);
    expect(brokenRules("A stage is a season, not a verdict.")).toEqual(["contrast", "stock-phrase"]);
    expect(brokenRules("Friction is movement: a hinge, not a wound.")).toEqual(["contrast"]);
    expect(brokenRules("Whether or not you go, rest first.")).toEqual([]);
  });
});

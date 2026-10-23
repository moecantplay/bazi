/**
 * VOICE.md "Plain writing" rules 1–4 (M24-11 R2) over every bank line: every
 * string the banks and reference copy export, rendered; every function bank;
 * and the chart page's composed lines.
 */

import { describe, expect, it } from "vitest";
import { brokenRules } from "../src/plain-writing.js";
import { failureKey, plainWritingLines, uncheckedFunctions, type PlainFailure } from "./plain-writing-rules.js";

const { lines, functionExports } = await plainWritingLines();
const failures: PlainFailure[] = lines.flatMap(({ module, text }) => brokenRules(text).map((rule) => ({ rule, module, text })));

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

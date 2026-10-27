/** M24-11 R11: choice groups let one bank entry read several ways, each comeback in its next combination. */

import { describe, expect, it } from "vitest";
import { choiceCount, choiceGroups, everyWording, resolveChoices } from "../src/choices.js";
import { pickerFor, steppedPicker } from "../src/rotation.js";

const LINE = "[Name it|Say it] once and it [loosens|eases|lets go].";

describe("choice groups", () => {
  it("counts every combination across the strings of an entry", () => {
    expect(choiceCount(LINE)).toBe(6);
    expect(choiceCount(["[A|B] title", LINE])).toBe(12);
    expect(choiceCount("No groups here.")).toBe(1);
  });

  it("lists each group's parts", () => {
    expect(choiceGroups(LINE)).toEqual([["Name it", "Say it"], ["loosens", "eases", "lets go"]]);
  });

  it("resolves one combination per index, every combination once over the count", () => {
    const wordings = Array.from({ length: 6 }, (_, index) => resolveChoices(LINE, index));
    expect(new Set(wordings).size).toBe(6);
    expect(wordings).toEqual(expect.arrayContaining(everyWording(LINE)));
    expect(wordings.every((text) => !/[[\]|]/.test(text))).toBe(true);
  });

  it("resolves inside tuples and objects, keeping their shape", () => {
    expect(resolveChoices(["[A|B] title", "Plain line."] as const, 1)).toEqual(["B title", "Plain line."]);
    expect(resolveChoices({ kind: "text", text: "[x|y]" }, 0)).toEqual({ kind: "text", text: "x" });
  });

  it("leaves placeholders for the fill after it", () => {
    expect(resolveChoices("[{window} suits you|Aim for {window}].", 1)).toBe("Aim for {window}.");
  });

  it("expands every wording of an entry", () => {
    expect(everyWording(LINE)).toHaveLength(6);
    expect(everyWording("Plain.")).toEqual(["Plain."]);
  });
});

describe("pickers resolve choice groups", () => {
  const POOL = [LINE, "[Ask|Check] first."] as const;
  const slot = "card:test";

  it("never lets a bracket through", () => {
    for (let visit = 0; visit < 20; visit += 1) {
      const text = pickerFor({ chart: "chart", date: "2026-10-27", visits: { [slot]: visit } })(POOL, slot);
      expect(text).not.toMatch(/[[\]|]/);
    }
  });

  it("brings a returning line back in its next combination, every one before a repeat", () => {
    const comebacks = Array.from({ length: 14 }, (_, visit) => pickerFor({ chart: "chart", date: "2026-10-27", visits: { [slot]: visit } })(POOL, slot))
      .filter((text) => !text.endsWith("first."));
    expect(comebacks).toHaveLength(7);
    expect(new Set(comebacks.slice(0, 6)).size).toBe(6);
    expect(comebacks[6]).toBe(comebacks[0]);
  });

  it("gives the same text for the same chart, slot and visit", () => {
    const seed = { chart: "chart", date: "2026-10-27", visits: { [slot]: 4 } };
    expect(pickerFor(seed)(POOL, slot)).toBe(pickerFor(seed)(POOL, slot));
  });

  it("starts each chart at its own combination", () => {
    const starts = ["a", "b", "c", "d", "e", "f", "g", "h"].map((chart) => pickerFor({ chart, date: "2026-10-27", visits: { [slot]: 0 } })([LINE], slot));
    expect(new Set(starts).size).toBeGreaterThan(1);
  });

  it("does the same for Ahead's stepped picker", () => {
    const steps = Array.from({ length: 6 }, (_, step) => steppedPicker("chart", step)([LINE], "lead"));
    expect(new Set(steps).size).toBe(6);
  });
});

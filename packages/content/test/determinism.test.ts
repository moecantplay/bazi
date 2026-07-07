/**
 * Determinism: same facts + same seedKey always produce byte-identical output;
 * different seedKeys vary the choices across a sample of fact sets.
 */

import { describe, expect, it } from "vitest";
import { dailyReading, luckTransitionLines, natalReading } from "../src/index.js";
import {
  INTERACTIONS,
  NATAL_PALACES,
  dailyFactSet,
  natalFactSets,
  natalWithInteractions,
} from "./collect.js";

describe("determinism", () => {
  it("natalReading is identical for the same facts and seedKey", () => {
    for (const facts of natalFactSets()) {
      const a = natalReading(facts, "same-seed");
      const b = natalReading(facts, "same-seed");
      expect(a).toEqual(b);
    }
    const withInteractions = natalWithInteractions();
    expect(natalReading(withInteractions, "s")).toEqual(natalReading(withInteractions, "s"));
  });

  it("dailyReading is identical for the same facts and seedKey", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        const facts = dailyFactSet(interaction, palace, "daily");
        expect(dailyReading(facts, "day-seed")).toEqual(dailyReading(facts, "day-seed"));
      }
    }
  });

  it("luckTransitionLines is identical for the same params and seedKey", () => {
    const params = { fromAge: 24, toAge: 34 };
    expect(luckTransitionLines(params, "luck-seed")).toEqual(luckTransitionLines(params, "luck-seed"));
  });

  it("different seedKeys vary natal output across a sample", () => {
    let differences = 0;
    for (const facts of natalFactSets()) {
      const a = JSON.stringify(natalReading(facts, "seed-one"));
      const b = JSON.stringify(natalReading(facts, "seed-two"));
      if (a !== b) {
        differences += 1;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });

  it("different seedKeys vary daily output across a sample", () => {
    let differences = 0;
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        const facts = dailyFactSet(interaction, palace, "daily");
        const a = JSON.stringify(dailyReading(facts, "alpha"));
        const b = JSON.stringify(dailyReading(facts, "beta"));
        if (a !== b) {
          differences += 1;
        }
      }
    }
    expect(differences).toBeGreaterThan(0);
  });

  it("different seedKeys vary luck output", () => {
    const params = { fromAge: 5, toAge: 15 };
    const a = JSON.stringify(luckTransitionLines(params, "one"));
    const b = JSON.stringify(luckTransitionLines(params, "two"));
    // Not guaranteed per single seed pair, so sample several.
    let differences = a !== b ? 1 : 0;
    for (let index = 0; index < 20; index += 1) {
      const left = JSON.stringify(luckTransitionLines(params, `L${index}`));
      const right = JSON.stringify(luckTransitionLines(params, `R${index}`));
      if (left !== right) {
        differences += 1;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });
});

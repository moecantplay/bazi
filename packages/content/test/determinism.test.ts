/**
 * Determinism: same facts + same seedKey always produce byte-identical output;
 * different seedKeys vary the choices across a sample of fact sets.
 */

import { describe, expect, it } from "vitest";
import { dailyReading, natalReading } from "../src/index.js";
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

  it("dailyReading is identical for the same facts and seed", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        const facts = dailyFactSet(interaction, palace, "daily");
        expect(dailyReading(facts, { chart: "day-seed", date: "2026-09-29" })).toEqual(dailyReading(facts, { chart: "day-seed", date: "2026-09-29" }));
      }
    }
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
        const a = JSON.stringify(dailyReading(facts, { chart: "alpha", date: "2026-09-29" }));
        const b = JSON.stringify(dailyReading(facts, { chart: "beta", date: "2026-09-29" }));
        if (a !== b) {
          differences += 1;
        }
      }
    }
    expect(differences).toBeGreaterThan(0);
  });
});

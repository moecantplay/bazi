/**
 * Two-chart comparison (M8). Cross-chart pair interactions only: a relation is
 * reported when one branch comes from each person, never for a pattern living
 * inside a single chart. Triple groups (trines, three-branch punishments) are
 * represented by their cross pairs.
 */

import { describe, expect, it } from "vitest";
import { ELEMENT_PRODUCTION_ORDER } from "../data/tables.js";
import type { PalacedBranch } from "../src/types.js";
import { compareFacts, compareInteractions } from "../src/compare.js";
import { computeChart } from "../src/chart.js";
import { DEFAULT_CONFIG } from "../src/types.js";

/** Fixture A (golden): 1994-12-08 16:30 Asia/Jakarta -> 甲戌 丙子 戊辰 庚申. */
const CHART_A = computeChart({
  instant: new Date("1994-12-08T09:30:00.000Z"),
  zone: "Asia/Jakarta",
  sex: "male",
  hourKnown: true,
  config: DEFAULT_CONFIG,
});

/** Day-pillar anchor date: 1949-10-01 12:00 UTC -> day 甲子, hour 午. */
const CHART_B = computeChart({
  instant: new Date("1949-10-01T12:00:00.000Z"),
  zone: "UTC",
  sex: "female",
  hourKnown: true,
  config: DEFAULT_CONFIG,
});

function entries(list: [PalacedBranch["branch"], PalacedBranch["palace"]][]): PalacedBranch[] {
  return list.map(([branch, palace]) => ({ branch, palace }));
}

describe("compareInteractions", () => {
  it("finds a cross combine with the palaces of each person", () => {
    const found = compareInteractions(entries([["子", "year"]]), entries([["丑", "day"]]));
    expect(found).toEqual([
      {
        type: "six-combine",
        branches: ["子", "丑"],
        aPalace: "year",
        bPalace: "day",
      },
    ]);
  });

  it("finds pairs regardless of table orientation (branches stay [yours, theirs])", () => {
    const found = compareInteractions(entries([["丑", "month"]]), entries([["子", "hour"]]));
    expect(found).toEqual([
      {
        type: "six-combine",
        branches: ["丑", "子"],
        aPalace: "month",
        bPalace: "hour",
      },
    ]);
  });

  it("never reports a pattern living inside one chart", () => {
    // 子午 clash inside person A; person B shares no pair with either branch.
    const found = compareInteractions(
      entries([
        ["子", "month"],
        ["午", "day"],
      ]),
      entries([["寅", "year"]]),
    );
    expect(found.filter((item) => item.type === "six-clash")).toEqual([]);
  });

  it("finds cross clashes and harms", () => {
    const clash = compareInteractions(entries([["子", "month"]]), entries([["午", "hour"]]));
    expect(clash[0]).toMatchObject({ type: "six-clash", branches: ["子", "午"] });

    const harm = compareInteractions(entries([["卯", "day"]]), entries([["辰", "year"]]));
    expect(harm[0]).toMatchObject({ type: "harm", branches: ["卯", "辰"] });
  });

  it("finds the two-branch mutual punishment and mirror self-punishments", () => {
    const mutual = compareInteractions(entries([["子", "day"]]), entries([["卯", "month"]]));
    expect(mutual.some((item) => item.type === "punishment" && item.punishmentKind === "mutual")).toBe(
      true,
    );

    const mirror = compareInteractions(entries([["辰", "day"]]), entries([["辰", "day"]]));
    expect(mirror).toEqual([
      {
        type: "punishment",
        punishmentKind: "self",
        branches: ["辰", "辰"],
        aPalace: "day",
        bPalace: "day",
      },
    ]);
  });

  it("does not report three-branch punishment groups as cross pairs", () => {
    // 丑戌 appear together only in the 丑戌未 triple.
    const found = compareInteractions(entries([["丑", "day"]]), entries([["戌", "year"]]));
    expect(found.filter((item) => item.type === "punishment")).toEqual([]);
  });

  it("reports two distinct members of a trine as a cross trine pair with its element", () => {
    const found = compareInteractions(entries([["申", "hour"]]), entries([["子", "day"]]));
    expect(found).toEqual([
      {
        type: "trine",
        element: "water",
        branches: ["申", "子"],
        aPalace: "hour",
        bPalace: "day",
      },
    ]);
  });

  it("does not call the same branch twice a trine pair", () => {
    const found = compareInteractions(entries([["子", "day"]]), entries([["子", "day"]]));
    expect(found.filter((item) => item.type === "trine")).toEqual([]);
  });
});

describe("compareFacts", () => {
  const facts = compareFacts(CHART_A, CHART_B);

  it("leads with the day-master pair, ten gods derived in both directions", () => {
    const fact = facts[0];
    expect(fact).toMatchObject({
      kind: "compare-day-masters",
      aStem: "戊",
      bStem: "甲",
      aElement: "earth",
      bElement: "wood",
      // 甲 (yang wood) controls 戊 (yang earth): officer relation, same polarity.
      aSeesB: { english: "Seven Killings" },
      // 戊 is what 甲 controls: wealth relation, same polarity.
      bSeesA: { english: "Indirect Wealth" },
    });
  });

  it("reports the known cross interactions between fixture A and the anchor chart", () => {
    const cross = facts.filter((fact) => fact.kind === "compare-interaction");
    // A: 戌(year) 子(month) 辰(day) 申(hour) x B: 丑(year) 酉(month) 子(day) 午(hour)
    expect(cross).toContainEqual({
      kind: "compare-interaction",
      interaction: "six-combine",
      branches: ["子", "丑"],
      aPalace: "month",
      bPalace: "year",
    });
    expect(cross).toContainEqual({
      kind: "compare-interaction",
      interaction: "six-combine",
      branches: ["辰", "酉"],
      aPalace: "day",
      bPalace: "month",
    });
    expect(cross).toContainEqual({
      kind: "compare-interaction",
      interaction: "six-clash",
      branches: ["子", "午"],
      aPalace: "month",
      bPalace: "hour",
    });
    expect(cross).toContainEqual({
      kind: "compare-interaction",
      interaction: "harm",
      branches: ["戌", "酉"],
      aPalace: "year",
      bPalace: "month",
    });
    expect(cross).toContainEqual({
      kind: "compare-interaction",
      interaction: "trine",
      element: "fire",
      branches: ["戌", "午"],
      aPalace: "year",
      bPalace: "hour",
    });
  });

  it("emits element support only when one chart runs rich in what suits the other", () => {
    const support = facts.filter((fact) => fact.kind === "compare-element-support");
    for (const fact of support) {
      expect(["a-to-b", "b-to-a"]).toContain(fact.direction);
    }
    // Wiring check against the charts themselves (same tie-break as facts.ts).
    const bDominant = ELEMENT_PRODUCTION_ORDER.reduce((best, element) =>
      CHART_B.fiveElementCounts[element] > CHART_B.fiveElementCounts[best] ? element : best,
    );
    const expected = CHART_A.favorableElements.includes(bDominant);
    expect(support.some((fact) => fact.direction === "b-to-a")).toBe(expected);
  });

  it("is deterministic", () => {
    expect(compareFacts(CHART_A, CHART_B)).toEqual(facts);
  });
});

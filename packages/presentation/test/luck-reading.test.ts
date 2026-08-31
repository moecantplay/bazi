import { describe, expect, it } from "vitest";
import { luckPillarReadingsFor } from "../src/luck-reading.js";
import { FIXTURE_A } from "./fixtures.js";

describe("luckPillarReadingsFor", () => {
  const readings = luckPillarReadingsFor(FIXTURE_A);

  it("returns one reading per luck pillar, in chart order", () => {
    expect(readings).toHaveLength(8);
    expect(`${readings[2]!.luck.pillar.stem}${readings[2]!.luck.pillar.branch}`).toBe("己卯");
  });

  it("every pillar gets at least a theme and an element line", () => {
    for (const reading of readings) {
      expect(reading.lines.length, `${reading.luck.pillar.stem}${reading.luck.pillar.branch}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("the current decade (己卯) reads This decade, not This year or This month", () => {
    const current = readings[2]!;
    for (const line of current.lines) {
      expect(line.factTagRuns?.some((run) => run.kind === "text" && run.text.includes("decade"))).toBe(true);
    }
  });

  it("is deterministic for the same profile", () => {
    expect(luckPillarReadingsFor(FIXTURE_A)).toEqual(readings);
  });
});

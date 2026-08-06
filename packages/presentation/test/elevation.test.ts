import { describe, expect, it } from "vitest";
import { ELEVATION_WEEK_LENGTH, elevationPath, elevationWeek } from "../src/elevation.js";
import { FIXTURE_A } from "./fixtures.js";

describe("elevationWeek", () => {
  it("returns ELEVATION_WEEK_LENGTH cells starting with today", () => {
    const cells = elevationWeek(FIXTURE_A, "2026-07-07");
    expect(cells).toHaveLength(ELEVATION_WEEK_LENGTH);
    expect(cells[0]?.iso).toBe("2026-07-07");
    expect(cells[6]?.iso).toBe("2026-07-13");
  });

  it("plots x evenly across the week and y from the tone", () => {
    const cells = elevationWeek(FIXTURE_A, "2026-07-07");
    for (const [index, cell] of cells.entries()) {
      expect(cell.x).toBeCloseTo(((index + 0.5) / ELEVATION_WEEK_LENGTH) * 100);
      expect(cell.y).toBeGreaterThan(0);
      expect(cell.y).toBeLessThan(100);
    }
  });

  it("is deterministic for the same profile and start date", () => {
    expect(elevationWeek(FIXTURE_A, "2026-07-07")).toEqual(elevationWeek(FIXTURE_A, "2026-07-07"));
  });
});

describe("elevationPath", () => {
  it("joins cells into an SVG path starting with M and continuing with L", () => {
    const cells = elevationWeek(FIXTURE_A, "2026-07-07");
    const path = elevationPath(cells);
    expect(path.startsWith("M")).toBe(true);
    expect(path.match(/L/g)?.length).toBe(cells.length - 1);
  });

  it("returns an empty string for no cells", () => {
    expect(elevationPath([])).toBe("");
  });
});

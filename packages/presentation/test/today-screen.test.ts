import { describe, expect, it } from "vitest";
import { plainGloss } from "@daymaster/content";
import { addDays } from "../src/dates.js";
import {
  clampOffsetToRange,
  headlineRuns,
  TODAY_RANGE_DAYS,
  todayScreenModel
} from "../src/today-screen.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

const TODAY = "2026-07-07";

describe("todayScreenModel", () => {
  it("assembles chart, pillars, reading, guidance, and tone for the date", () => {
    const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
    expect(model.pillars).toHaveLength(4);
    expect(model.dayPillar.stem.length).toBeGreaterThan(0);
    expect(plainGloss(model.reading.headline.runs).length).toBeGreaterThan(0);
    expect(["favoured", "friction", "even"]).toContain(model.tone);
    expect(Array.isArray(model.waypoints)).toBe(true);
  });

  it("derives stem/branch glosses from the day pillar", () => {
    const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
    expect(model.stem.gloss.length).toBeGreaterThan(0);
    expect(model.branch.gloss.length).toBeGreaterThan(0);
  });

  it("builds branchByArea from the chart's pillars plus the day's own branch", () => {
    const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
    expect(model.branchByArea.year).toBe(model.chart.year.branch);
    expect(model.branchByArea.month).toBe(model.chart.month.branch);
    expect(model.branchByArea.day).toBe(model.chart.day.branch);
    expect(model.branchByArea.hour).toBe(model.chart.hour?.branch);
    expect(model.branchByArea.overall).toBe(model.dayPillar.branch);
  });

  it("omits the hour key from branchByArea when birth time is unknown", () => {
    const model = todayScreenModel(FIXTURE_UNKNOWN_TIME, TODAY, TODAY);
    expect(model.chart.hour).toBeNull();
    expect("hour" in model.branchByArea).toBe(false);
  });

  it("picks the overall-area line as grainLine, falling back to the first line", () => {
    const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
    if (model.grainLine?.area) {
      expect(model.grainLine.area).toBe("overall");
    } else {
      expect(model.grainLine).toBe(model.reading.lines[0]);
    }
  });

  it("computes the headline as headlineRuns(reading.headline.text)", () => {
    const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
    expect(model.headline).toEqual(headlineRuns(plainGloss(model.reading.headline.runs)));
  });

  describe("dateRange", () => {
    it("centers min/max on todayISO, RANGE days out", () => {
      const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
      expect(model.dateRange.min).toBe(addDays(TODAY, -TODAY_RANGE_DAYS));
      expect(model.dateRange.max).toBe(addDays(TODAY, TODAY_RANGE_DAYS));
    });

    it("is not at a boundary for today itself", () => {
      const model = todayScreenModel(FIXTURE_A, TODAY, TODAY);
      expect(model.dateRange.atStart).toBe(false);
      expect(model.dateRange.atEnd).toBe(false);
      expect(model.dateRange.atBoundary).toBe(false);
    });

    it("flags atEnd/atBoundary at +RANGE days", () => {
      const dateISO = addDays(TODAY, TODAY_RANGE_DAYS);
      const model = todayScreenModel(FIXTURE_A, dateISO, TODAY);
      expect(model.dateRange.atEnd).toBe(true);
      expect(model.dateRange.atStart).toBe(false);
      expect(model.dateRange.atBoundary).toBe(true);
    });

    it("flags atStart/atBoundary at -RANGE days", () => {
      const dateISO = addDays(TODAY, -TODAY_RANGE_DAYS);
      const model = todayScreenModel(FIXTURE_A, dateISO, TODAY);
      expect(model.dateRange.atStart).toBe(true);
      expect(model.dateRange.atEnd).toBe(false);
      expect(model.dateRange.atBoundary).toBe(true);
    });
  });
});

describe("headlineRuns", () => {
  it("returns a single unemphasized run for short headlines", () => {
    expect(headlineRuns("Short and plain")).toEqual([{ text: "Short and plain", emphasized: false }]);
  });

  it("splits a longer headline into plain/emphasis/plain runs", () => {
    const runs = headlineRuns("The quick brown fox jumps over the lazy dog");
    expect(runs).toHaveLength(3);
    expect(runs[0]?.emphasized).toBe(false);
    expect(runs[1]?.emphasized).toBe(true);
    expect(runs[2]?.emphasized).toBe(false);
    expect(runs.map((run) => run.text).join("")).toBe(
      "The quick brown fox jumps over the lazy dog"
    );
  });
});

describe("clampOffsetToRange", () => {
  it("passes through offsets within range", () => {
    expect(clampOffsetToRange(5)).toBe(5);
    expect(clampOffsetToRange(-5)).toBe(-5);
  });

  it("clamps offsets beyond the default range", () => {
    expect(clampOffsetToRange(999)).toBe(TODAY_RANGE_DAYS);
    expect(clampOffsetToRange(-999)).toBe(-TODAY_RANGE_DAYS);
  });

  it("accepts a custom range", () => {
    expect(clampOffsetToRange(10, 7)).toBe(7);
    expect(clampOffsetToRange(-10, 7)).toBe(-7);
  });
});

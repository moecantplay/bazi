import { describe, expect, it } from "vitest";
import { plainGloss } from "@daymaster/content";
import {
  PRESENTATION_VERSION,
  chartFor,
  computePillars,
  dayTerrain,
  dayTone,
  describeStem,
  natalSeedKey,
  renderRun,
  streakLine,
  todayLabel,
  todayScreenModel
} from "../src/index.js";
import { FIXTURE_A } from "./fixtures.js";

describe("index barrel", () => {
  it("exposes a version string", () => {
    expect(typeof PRESENTATION_VERSION).toBe("string");
  });

  it("re-exports the package's view-model functions", () => {
    expect(typeof todayLabel()).toBe("string");
    expect(chartFor(FIXTURE_A).day.stem).toBe("戊");
    expect(computePillars(FIXTURE_A.birth, FIXTURE_A.config).day.stem).toBe("戊");
    expect(dayTerrain(FIXTURE_A, "2026-07-07")).toBeDefined();
    expect(["favoured", "friction", "even"]).toContain(dayTone(FIXTURE_A, "2026-07-07"));
    expect(describeStem("甲").gloss).toBe("yang wood");
    expect(natalSeedKey(FIXTURE_A)).toBe("1994-12-08|16:30|Asia/Jakarta|male");
    expect(streakLine(1, "2026-07-07").length).toBeGreaterThan(0);
  });

  it("re-exports the content-dependent view-models added in this phase", () => {
    const model = todayScreenModel(FIXTURE_A, "2026-07-07", "2026-07-07");
    expect(plainGloss(model.reading.headline.runs).length).toBeGreaterThan(0);
    expect(renderRun([{ kind: "text", text: "hi" }])).toEqual([{ kind: "text", text: "hi", key: 0 }]);
  });
});

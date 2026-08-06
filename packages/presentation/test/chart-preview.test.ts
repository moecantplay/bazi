import { describe, expect, it } from "vitest";
import { chartPreviewFor } from "../src/chart-preview.js";
import { FIXTURE_A } from "./fixtures.js";

describe("chartPreviewFor", () => {
  it("returns the computed pillars with no error for a valid birth", () => {
    const result = chartPreviewFor(FIXTURE_A.birth, FIXTURE_A.config);
    expect(result.error).toBe(false);
    expect(result.pillars?.day.stem).toBe("戊");
    expect(result.pillars?.day.branch).toBe("辰");
  });

  it("returns a null pillars result with error set for an out-of-range year", () => {
    const outOfRange = { ...FIXTURE_A.birth, date: "1850-01-01" };
    const result = chartPreviewFor(outOfRange, FIXTURE_A.config);
    expect(result.error).toBe(true);
    expect(result.pillars).toBeNull();
  });
});

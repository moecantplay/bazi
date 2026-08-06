import { describe, expect, it } from "vitest";
import { streakLine } from "../src/streak.js";

describe("streakLine", () => {
  it("includes the count in the rendered line", () => {
    expect(streakLine(5, "2026-07-07")).toContain("5");
  });

  it("is deterministic for the same day", () => {
    expect(streakLine(3, "2026-07-07")).toBe(streakLine(3, "2026-07-07"));
  });

  it("can vary wording across different calendar days", () => {
    const wordings = new Set<string>();
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-07-${String(day).padStart(2, "0")}`;
      wordings.add(streakLine(1, iso).replace(/\d+/, "N"));
    }
    expect(wordings.size).toBeGreaterThan(1);
  });
});

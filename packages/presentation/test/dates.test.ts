import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatLong, todayLabel } from "../src/dates.js";

describe("todayLabel", () => {
  it("formats a given Date as YYYY-MM-DD in local time", () => {
    expect(todayLabel(new Date(2026, 6, 7))).toBe("2026-07-07");
  });

  it("pads single-digit months and days", () => {
    expect(todayLabel(new Date(2026, 0, 3))).toBe("2026-01-03");
  });
});

describe("addDays", () => {
  it("adds positive days without drifting across a month boundary", () => {
    expect(addDays("2026-07-30", 3)).toBe("2026-08-02");
  });

  it("subtracts with a negative count", () => {
    expect(addDays("2026-08-02", -3)).toBe("2026-07-30");
  });

  it("crosses a year boundary", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("is a no-op for zero days", () => {
    expect(addDays("2026-07-07", 0)).toBe("2026-07-07");
  });
});

describe("daysBetween", () => {
  it("is positive when `to` is later", () => {
    expect(daysBetween("2026-07-01", "2026-07-08")).toBe(7);
  });

  it("is negative when `to` is earlier", () => {
    expect(daysBetween("2026-07-08", "2026-07-01")).toBe(-7);
  });

  it("is zero for the same date", () => {
    expect(daysBetween("2026-07-07", "2026-07-07")).toBe(0);
  });
});

describe("formatLong", () => {
  it("formats a civil date as a human string", () => {
    expect(formatLong("2026-07-07")).toContain("2026");
    expect(formatLong("2026-07-07")).toContain("Jul");
  });
});

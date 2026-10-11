/** M24-05: the Welcome sample is built from the date and zone alone, deterministically. */

import { describe, expect, it } from "vitest";
import { welcomeSample } from "../src/index.js";

describe("welcomeSample", () => {
  it("reads a day without a chart", () => {
    const sample = welcomeSample("2026-10-11", "Asia/Jakarta");
    expect(sample.headline.length).toBeGreaterThan(0);
    expect(sample.favors.every((label) => label.length > 0)).toBe(true);
    expect(sample.easiest).toMatch(/\d/);
    expect(sample.roughest).toMatch(/\d/);
    expect(welcomeSample("2026-10-11", "Asia/Jakarta")).toEqual(sample);
  });
});

/**
 * M24-11 R4, R5: every pool is big enough that no line comes back within its
 * window for any reading fixture or pool chart: 14 days on Today (over a
 * year), 12 consecutive months and a decade's years on Ahead.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { POOL_CHARTS, aheadPoolNeeds, todayPoolNeeds } from "./pool-minimums.js";

const profiles = [...READING_FIXTURES.map(([, profile]) => profile), ...POOL_CHARTS];
const today = todayPoolNeeds(profiles);
const ahead = aheadPoolNeeds(profiles);

describe("pool minimums", () => {
  it("covers every rotating slot on Today and Ahead", () => {
    for (const prefix of ["headline:", "body:", "agency:", "modifier:", "card:", "best-hour:", "colour-line:", "suits-heading:", "watch:"]) {
      expect(today.some((need) => need.slot.startsWith(prefix)), prefix).toBe(true);
    }
    for (const prefix of ["month:lead:", "month:element:", "month:card:", "year:lead:", "year:element:", "year:card:"]) {
      expect(ahead.some((need) => need.slot.startsWith(prefix)), prefix).toBe(true);
    }
  });

  it("no pool repeats a line within its window", () => {
    const short = [...today, ...ahead].filter((need) => need.repeats).map((need) => `${need.slot}: ${need.poolSize} of ${need.needed}`);
    expect(short, "pools too small").toEqual([]);
  });
});

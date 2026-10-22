/**
 * M24-11 R4, R5: every pool is big enough that no line comes back within its
 * window for any fixture or pool chart: 14 days on Today (over a year), 12 consecutive
 * months and a decade's years on Ahead. Pools written before the rotation sit
 * on a known list that may only shrink.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { KNOWN_SHORT_POOLS } from "./pool-minimums-known.js";
import { POOL_CHARTS, aheadPoolNeeds, todayPoolNeeds, type PoolNeed } from "./pool-minimums.js";

const profiles = [...READING_FIXTURES.map(([, profile]) => profile), ...POOL_CHARTS];
const today = todayPoolNeeds(profiles);
const ahead = aheadPoolNeeds(profiles);
const short: PoolNeed[] = [...today, ...ahead].filter((need) => need.repeats);
const known = new Set(KNOWN_SHORT_POOLS);

describe("pool minimums", () => {
  it("covers every rotating slot on Today and Ahead", () => {
    for (const prefix of ["headline:", "body:", "agency:", "modifier:", "card:", "best-hour:", "colour-line:", "suits-heading:", "watch:"]) {
      expect(today.some((need) => need.slot.startsWith(prefix)), prefix).toBe(true);
    }
    for (const prefix of ["month:lead:", "month:element:", "month:card:", "year:lead:", "year:element:", "year:card:"]) {
      expect(ahead.some((need) => need.slot.startsWith(prefix)), prefix).toBe(true);
    }
  });

  it("no pool repeats within its window unless it is on the known list", () => {
    const fresh = short.filter((need) => !known.has(need.slot)).map((need) => `${need.slot}: ${need.poolSize} of ${need.needed}`);
    expect(fresh, "pools too small").toEqual([]);
  });

  it("every listed pool still repeats (trim the list as pools grow)", () => {
    const grown = [...known].filter((slot) => !short.some((need) => need.slot === slot));
    expect(grown, "pools now big enough, still on the known list").toEqual([]);
  });
});

/**
 * M24-11 R6: over 90 days and every fixture, no sentence comes back on Today
 * within 14 days, no screen says a thing twice, and every rendered line keeps
 * VOICE.md's plain-writing rules. Counts written before the rewrite sit in a
 * ratchet that may only go down.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { KNOWN_SCREEN_COUNTS } from "./screen-repeats-known.js";
import { screenCounts } from "./screen-repeats.js";

const counts = screenCounts(READING_FIXTURES);

describe("rendered screens", () => {
  it("break nothing the ratchet doesn't already hold, and every lower count is written back", () => {
    // Equal, not at most: a count that went down is lowered in screen-repeats-known.ts, so it can't creep back.
    expect(counts).toEqual(KNOWN_SCREEN_COUNTS);
  });
});

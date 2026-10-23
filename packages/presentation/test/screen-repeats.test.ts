/**
 * M24-11 R6: over 90 days and every fixture, no sentence comes back on Today
 * within 14 days, no screen says a thing twice, and every rendered line keeps
 * VOICE.md's plain-writing rules.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { screenCounts } from "./screen-repeats.js";

const counts = screenCounts(READING_FIXTURES);

describe("rendered screens", () => {
  it("break nothing on any surface", () => {
    expect(counts).toEqual({ Today: {}, "Topic pages": {}, Ahead: {}, You: {}, "Your chart": {}, People: {} });
  });
});

/**
 * M20-24 R4: the day's tone in Today's header, where the day-pillar label was.
 * Plain words only (VOICE.md rule 11), one phrase per tone, matching the week
 * legend's vocabulary (DESIGN.md §Instrument: leans your way, take it slow, even).
 */

import { describe, expect, it } from "vitest";
import { dayTonePhrase } from "../src/index.js";
import { assertPlain } from "./plain-terms.js";

describe("dayTonePhrase", () => {
  it("names every tone in plain words", () => {
    expect(dayTonePhrase("favoured")).toBe("Leans your way");
    expect(dayTonePhrase("friction")).toBe("Take it slow");
    expect(dayTonePhrase("even")).toBe("An even day");
    for (const tone of ["favoured", "friction", "even"] as const) {
      assertPlain(dayTonePhrase(tone));
    }
  });
});

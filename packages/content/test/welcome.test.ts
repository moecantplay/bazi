/** M24-05: the Welcome screen's day headlines are plain (VOICE.md rule 11) and cover all twelve day officers. */

import { describe, expect, it } from "vitest";
import { OFFICER_DAY_HEADLINES, welcomeHeadline } from "../src/index.js";
import { assertPlain } from "./plain-terms.js";

describe("Welcome headlines", () => {
  it("cover every day officer in plain words", () => {
    expect(Object.keys(OFFICER_DAY_HEADLINES)).toHaveLength(12);
    for (const headline of Object.values(OFFICER_DAY_HEADLINES)) {
      assertPlain(headline);
    }
    expect(welcomeHeadline("kai")).toBe("A day of open doors and fresh starts.");
    expect(welcomeHeadline("unknown")).toBe("Today has its own grain.");
  });
});

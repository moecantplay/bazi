import { describe, expect, it } from "vitest";
import { stripHanCharacters } from "../src/strip-han.js";

describe("stripHanCharacters", () => {
  it("leaves text without Han characters untouched", () => {
    const line = "A grain that favors doing it together over going it alone.";
    expect(stripHanCharacters(line)).toBe(line);
  });

  it("drops a Han-only parenthetical and its leading space", () => {
    expect(stripHanCharacters("The Scholar Star (文昌) sits in your career palace.")).toBe(
      "The Scholar Star sits in your career palace.",
    );
  });

  it("keeps the English half of a mixed parenthetical", () => {
    expect(
      stripHanCharacters("were born in a season that feeds your element (得令 — in season)"),
    ).toBe("were born in a season that feeds your element (in season)");
  });

  it("turns a bare branch run into animal names", () => {
    expect(stripHanCharacters("子午 clash · career palace")).toBe(
      "rat–horse clash · career palace",
    );
  });

  it("handles a three-branch trine run", () => {
    expect(stripHanCharacters("寅午戌 trine · roots")).toBe("tiger–horse–dog trine · roots");
  });

  it("turns a stem+branch pillar pair into its plain name", () => {
    expect(stripHanCharacters("戊辰 day")).toBe("yang-earth dragon day");
  });

  it("handles a pillar pair inside a fact tag", () => {
    expect(stripHanCharacters("today 庚申 · your career palace")).toBe(
      "today yang-metal monkey · your career palace",
    );
  });

  it("drops an empty fact-tag segment left by a trailing Han term", () => {
    expect(stripHanCharacters("Direct Officer · 正官")).toBe("Direct Officer");
  });

  it("drops a leading Han term from a fact tag", () => {
    expect(stripHanCharacters("帝旺 Peak · today")).toBe("Peak · today");
  });

  it("removes Han inside prose without breaking spacing or punctuation", () => {
    expect(stripHanCharacters("The day carries a Friend note (比肩) — peers at your table.")).toBe(
      "The day carries a Friend note — peers at your table.",
    );
  });
});

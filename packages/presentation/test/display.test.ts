import { STEMS, BRANCHES } from "@daymaster/bazi-engine";
import { describe, expect, it } from "vitest";
import { describeBranch, describeStem, palaceWord } from "../src/display.js";

describe("describeStem", () => {
  it("returns pinyin, gloss, element and polarity for every stem", () => {
    for (const stem of STEMS) {
      const glyph = describeStem(stem);
      expect(glyph.pinyin.length).toBeGreaterThan(0);
      expect(glyph.gloss).toBe(`${glyph.polarity} ${glyph.element}`);
      expect(["yang", "yin"]).toContain(glyph.polarity);
    }
  });

  it("resolves 甲 to yang wood", () => {
    expect(describeStem("甲")).toEqual({
      pinyin: "jiǎ",
      gloss: "yang wood",
      element: "wood",
      polarity: "yang"
    });
  });
});

describe("describeBranch", () => {
  it("returns pinyin, an animal gloss and an element for every branch", () => {
    for (const branch of BRANCHES) {
      const glyph = describeBranch(branch);
      expect(glyph.pinyin.length).toBeGreaterThan(0);
      expect(glyph.gloss.length).toBeGreaterThan(0);
      expect(glyph.element).toBeDefined();
    }
  });

  it("resolves 子 to the rat", () => {
    expect(describeBranch("子").gloss).toBe("rat");
  });
});

describe("palaceWord", () => {
  it("names the four natal palaces", () => {
    expect(palaceWord("year")).toBe("roots");
    expect(palaceWord("month")).toBe("career");
    expect(palaceWord("day")).toBe("home");
    expect(palaceWord("hour")).toBe("horizon");
  });

  it("has no word for a transit-only palace", () => {
    expect(palaceWord("annual")).toBeNull();
  });
});

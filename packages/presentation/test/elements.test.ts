import { describe, expect, it } from "vitest";
import { ELEMENT_LABEL, ELEMENT_ORDER, ELEMENT_SWATCH_CLASS } from "../src/elements.js";

describe("element maps", () => {
  it("cover all five elements in the canonical production order", () => {
    expect(ELEMENT_ORDER).toEqual(["wood", "fire", "earth", "metal", "water"]);
  });

  it("has a swatch class and label for every element", () => {
    for (const element of ELEMENT_ORDER) {
      expect(ELEMENT_SWATCH_CLASS[element]).toBe(`bg-element-${element}`);
      expect(ELEMENT_LABEL[element]).toMatch(/^[A-Z]/);
    }
  });
});

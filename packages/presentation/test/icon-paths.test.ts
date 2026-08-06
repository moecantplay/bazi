import { describe, expect, it } from "vitest";
import { ANIMAL_ICON_PATHS } from "../src/animal-icon-paths.js";
import { ELEMENT_ICON_PATHS } from "../src/glyph-icon-paths.js";
import { ELEMENT_ORDER } from "../src/elements.js";

const ANIMALS = [
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "goat", "monkey", "rooster", "dog", "pig"
];

describe("ANIMAL_ICON_PATHS", () => {
  it("has all twelve zodiac animals with non-empty path data", () => {
    for (const animal of ANIMALS) {
      expect(ANIMAL_ICON_PATHS[animal]?.d.length).toBeGreaterThan(0);
    }
    expect(Object.keys(ANIMAL_ICON_PATHS).sort()).toEqual([...ANIMALS].sort());
  });

  it("gives dragon and rooster a large-size variant", () => {
    expect(ANIMAL_ICON_PATHS.dragon?.dLarge?.length).toBeGreaterThan(0);
    expect(ANIMAL_ICON_PATHS.rooster?.dLarge?.length).toBeGreaterThan(0);
  });
});

describe("ELEMENT_ICON_PATHS", () => {
  it("has a solid path and at least one line primitive for every element", () => {
    for (const element of ELEMENT_ORDER) {
      const paths = ELEMENT_ICON_PATHS[element];
      expect(paths.solid.length).toBeGreaterThan(0);
      expect(paths.line.length).toBeGreaterThan(0);
    }
  });
});

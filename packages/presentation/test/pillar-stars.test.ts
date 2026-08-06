import { describe, expect, it } from "vitest";
import type { ShenshaHit } from "@daymaster/bazi-engine";
import { starsForPalace } from "../src/pillar-stars.js";

const STARS: ShenshaHit[] = [
  { key: "wenchang-scholar", chinese: "文昌", english: "Scholar", palace: "year" },
  { key: "taohua-peach", chinese: "桃花", english: "Peach Blossom", palace: "day" },
  { key: "tianyi-noble", chinese: "天乙", english: "Noble", palace: "day" }
];

describe("starsForPalace", () => {
  it("returns only the hits landing on the given palace", () => {
    expect(starsForPalace(STARS, "day")).toEqual([STARS[1], STARS[2]]);
  });

  it("returns an empty array when no hits land on the palace", () => {
    expect(starsForPalace(STARS, "hour")).toEqual([]);
  });

  it("returns undefined when stars is undefined", () => {
    expect(starsForPalace(undefined, "day")).toBeUndefined();
  });
});

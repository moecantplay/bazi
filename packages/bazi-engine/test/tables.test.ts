import { describe, expect, it } from "vitest";
import {
  BRANCHES,
  BRANCH_ELEMENTS,
  FIVE_RATS,
  FIVE_TIGERS,
  STEMS,
  STEM_ELEMENTS,
  STEM_POLARITIES,
} from "../src/index.js";

describe("reference tables", () => {
  it("has 10 stems and 12 branches with aligned element tables", () => {
    expect(STEMS).toHaveLength(10);
    expect(STEM_ELEMENTS).toHaveLength(10);
    expect(STEM_POLARITIES).toHaveLength(10);
    expect(BRANCHES).toHaveLength(12);
    expect(BRANCH_ELEMENTS).toHaveLength(12);
  });

  it("maps 甲 to yang wood and 癸 to yin water", () => {
    expect(STEM_ELEMENTS[0]).toBe("wood");
    expect(STEM_POLARITIES[0]).toBe("yang");
    expect(STEM_ELEMENTS[9]).toBe("water");
    expect(STEM_POLARITIES[9]).toBe("yin");
  });

  it("maps 子 to water and 午 to fire", () => {
    expect(BRANCH_ELEMENTS[0]).toBe("water");
    expect(BRANCH_ELEMENTS[6]).toBe("fire");
  });

  it("encodes the Five Tigers rule for every year stem", () => {
    expect(FIVE_TIGERS).toMatchObject({
      甲: "丙",
      己: "丙",
      乙: "戊",
      庚: "戊",
      丙: "庚",
      辛: "庚",
      丁: "壬",
      壬: "壬",
      戊: "甲",
      癸: "甲",
    });
  });

  it("encodes the Five Rats rule for every day stem", () => {
    expect(FIVE_RATS).toMatchObject({
      甲: "甲",
      己: "甲",
      乙: "丙",
      庚: "丙",
      丙: "戊",
      辛: "戊",
      丁: "庚",
      壬: "庚",
      戊: "壬",
      癸: "壬",
    });
  });
});

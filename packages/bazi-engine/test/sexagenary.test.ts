import { describe, expect, it } from "vitest";
import {
  branchAt,
  branchIndex,
  pillarToSexagenaryIndex,
  sexagenaryPillar,
  stemAt,
  stemIndex,
} from "../src/index.js";

describe("sexagenaryPillar", () => {
  it("maps index 0 to 甲子", () => {
    expect(sexagenaryPillar(0)).toEqual({ stem: "甲", branch: "子" });
  });

  it("maps index 10 to 甲戌", () => {
    expect(sexagenaryPillar(10)).toEqual({ stem: "甲", branch: "戌" });
  });

  it("maps index 59 to 癸亥", () => {
    expect(sexagenaryPillar(59)).toEqual({ stem: "癸", branch: "亥" });
  });

  it("wraps every 60", () => {
    expect(sexagenaryPillar(60)).toEqual(sexagenaryPillar(0));
    expect(sexagenaryPillar(-1)).toEqual(sexagenaryPillar(59));
  });
});

describe("pillarToSexagenaryIndex", () => {
  it("is the inverse of sexagenaryPillar for all 60 positions", () => {
    for (let index = 0; index < 60; index += 1) {
      expect(pillarToSexagenaryIndex(sexagenaryPillar(index))).toBe(index);
    }
  });

  it("rejects an impossible stem/branch parity", () => {
    expect(() => pillarToSexagenaryIndex({ stem: "甲", branch: "丑" })).toThrow();
  });
});

describe("stem/branch helpers", () => {
  it("index round-trips through the cycle helpers", () => {
    expect(stemAt(stemIndex("庚"))).toBe("庚");
    expect(branchAt(branchIndex("酉"))).toBe("酉");
  });

  it("wraps negative indices without going negative", () => {
    expect(stemAt(-1)).toBe("癸");
    expect(branchAt(-1)).toBe("亥");
  });
});

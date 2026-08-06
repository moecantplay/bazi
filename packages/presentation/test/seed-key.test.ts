import { describe, expect, it } from "vitest";
import { natalSeedKey } from "../src/seed-key.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

describe("natalSeedKey", () => {
  it("follows the frozen convention: date|time|tz|sex", () => {
    expect(natalSeedKey(FIXTURE_A)).toBe("1994-12-08|16:30|Asia/Jakarta|male");
  });

  it("uses the literal string 'unknown' when the birth time is unset", () => {
    expect(natalSeedKey(FIXTURE_UNKNOWN_TIME)).toBe("1994-12-08|unknown|Asia/Jakarta|female");
  });

  it("is deterministic for the same profile", () => {
    expect(natalSeedKey(FIXTURE_A)).toBe(natalSeedKey(FIXTURE_A));
  });
});

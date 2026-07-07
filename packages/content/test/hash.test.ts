/**
 * The deterministic selection primitives: stable hashing and reproducible,
 * distinct picks.
 */

import { describe, expect, it } from "vitest";
import { fnv1a, pick, pickDistinct, pickInt } from "../src/hash.js";

describe("fnv1a", () => {
  it("is stable for the same input", () => {
    expect(fnv1a("daymaster")).toBe(fnv1a("daymaster"));
  });

  it("differs for different inputs", () => {
    expect(fnv1a("a")).not.toBe(fnv1a("b"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const value = fnv1a("anything at all");
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(value)).toBe(true);
  });
});

describe("pick", () => {
  const items = ["a", "b", "c", "d"];

  it("is deterministic for the same seed and salt", () => {
    expect(pick(items, "seed", "salt")).toBe(pick(items, "seed", "salt"));
  });

  it("throws on an empty list", () => {
    expect(() => pick([], "seed", "salt")).toThrow();
  });
});

describe("pickDistinct", () => {
  it("returns the requested count with no repeats", () => {
    const chosen = pickDistinct(["a", "b", "c", "d", "e"], 3, "seed", "salt");
    expect(chosen).toHaveLength(3);
    expect(new Set(chosen).size).toBe(3);
  });

  it("never returns more than the list holds", () => {
    const chosen = pickDistinct(["a", "b"], 5, "seed", "salt");
    expect(chosen).toHaveLength(2);
  });

  it("is deterministic", () => {
    const a = pickDistinct(["a", "b", "c", "d"], 2, "seed", "salt");
    const b = pickDistinct(["a", "b", "c", "d"], 2, "seed", "salt");
    expect(a).toEqual(b);
  });
});

describe("pickInt", () => {
  it("stays within the inclusive range", () => {
    for (let index = 0; index < 50; index += 1) {
      const value = pickInt(1, 2, "seed", `salt-${index}`);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(2);
    }
  });

  it("is deterministic", () => {
    expect(pickInt(1, 100, "seed", "salt")).toBe(pickInt(1, 100, "seed", "salt"));
  });
});

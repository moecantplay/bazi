import { describe, expect, it } from "vitest";
import { createSeededRandom, fnv1a } from "../src/hash.js";

describe("fnv1a", () => {
  it("is deterministic for the same input", () => {
    expect(fnv1a("daymaster")).toBe(fnv1a("daymaster"));
  });

  it("differs for different inputs", () => {
    expect(fnv1a("daymaster")).not.toBe(fnv1a("daymastr"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const hash = fnv1a("some seed string");
    expect(Number.isInteger(hash)).toBe(true);
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThanOrEqual(0xffffffff);
  });

  it("hashes the empty string to the FNV offset basis", () => {
    expect(fnv1a("")).toBe(0x811c9dc5);
  });
});

describe("createSeededRandom", () => {
  it("is deterministic for the same seed", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("produces values in [0, 1)", () => {
    const random = createSeededRandom(fnv1a("seal-seed"));
    for (let i = 0; i < 20; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("advances state between calls", () => {
    const random = createSeededRandom(1);
    const first = random();
    const second = random();
    expect(first).not.toBe(second);
  });
});

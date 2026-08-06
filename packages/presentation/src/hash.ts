/**
 * Deterministic hashing for seeded presentation choices (the cinnabar seal,
 * the streak line's wording pick, and anything else that needs a stable
 * pseudo-random choice derived from a string).
 *
 * Every seeded choice derives from a single FNV-1a hash of the input string,
 * expanded through a small counter-based PRNG.
 */

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/** FNV-1a hash over the UTF-16 code units of `input`, as an unsigned 32-bit int. */
export function fnv1a(input: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}

/**
 * A deterministic PRNG (mulberry32) seeded from a 32-bit value. Each call
 * returns the next float in [0, 1). Used to expand one hash into several
 * independent-looking but reproducible choices.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

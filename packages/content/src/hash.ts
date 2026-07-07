/**
 * Deterministic selection primitives.
 *
 * Every content choice in this package is driven by an FNV-1a hash of a seed
 * string, never by Math.random or Date.now. Same seed + same salt + same list
 * always yields the same pick, which is what makes readings reproducible.
 */

/** 32-bit FNV-1a hash of a string. */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministically pick one item from a non-empty list. */
export function pick<T>(items: readonly T[], seedKey: string, salt: string): T {
  if (items.length === 0) {
    throw new Error(`pick called with an empty list (salt "${salt}")`);
  }
  const index = fnv1a(`${seedKey}|${salt}`) % items.length;
  return items[index] as T;
}

/**
 * Deterministically pick up to `count` distinct items, in selection order.
 * Returns fewer than `count` only when the list is shorter than `count`.
 */
export function pickDistinct<T>(
  items: readonly T[],
  count: number,
  seedKey: string,
  salt: string,
): T[] {
  const pool = [...items];
  const chosen: T[] = [];
  for (let slot = 0; slot < count && pool.length > 0; slot += 1) {
    const index = fnv1a(`${seedKey}|${salt}|${slot}`) % pool.length;
    chosen.push(pool.splice(index, 1)[0] as T);
  }
  return chosen;
}

/** Deterministically choose an integer in the inclusive range [min, max]. */
export function pickInt(min: number, max: number, seedKey: string, salt: string): number {
  const span = max - min + 1;
  return min + (fnv1a(`${seedKey}|${salt}`) % span);
}

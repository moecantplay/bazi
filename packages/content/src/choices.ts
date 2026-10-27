/**
 * Choice groups (M24-11 R11): a bank entry may hold `[part|part|part]`, so
 * one entry reads several ways. The writer picks every part for its sentence;
 * nothing here swaps words on its own. An entry's groups, across all of its
 * strings (a [title, line] pair counts as one entry), number its combinations
 * like an odometer: index 0 takes every first part.
 */

const GROUP = /\[([^[\]]*)\]/g;

/** The parts of each group in a string, in order. */
export function choiceGroups(text: string): string[][] {
  return [...text.matchAll(GROUP)].map((match) => (match[1] ?? "").split("|"));
}

function stringsOf(entry: unknown): string[] {
  if (typeof entry === "string") {
    return [entry];
  }
  if (Array.isArray(entry)) {
    return entry.flatMap(stringsOf);
  }
  if (entry !== null && typeof entry === "object") {
    return Object.values(entry).flatMap(stringsOf);
  }
  return [];
}

/** How many wordings an entry has: the product of its groups' sizes, 1 with none. */
export function choiceCount(entry: unknown): number {
  return stringsOf(entry)
    .flatMap(choiceGroups)
    .reduce((count, parts) => count * parts.length, 1);
}

/** Rebuilds an entry with each group resolved, `place` carrying the odometer across strings. */
function resolveWith(entry: unknown, index: number, place: { value: number }): unknown {
  if (typeof entry === "string") {
    return entry.replace(GROUP, (_, body: string) => {
      const parts = body.split("|");
      const part = parts[Math.floor(index / place.value) % parts.length] ?? "";
      place.value *= parts.length;
      return part;
    });
  }
  if (Array.isArray(entry)) {
    return entry.map((item) => resolveWith(item, index, place));
  }
  if (entry !== null && typeof entry === "object") {
    return Object.fromEntries(Object.entries(entry).map(([key, value]) => [key, resolveWith(value, index, place)]));
  }
  return entry;
}

/** The entry's wording at `index` (taken modulo its count), same shape as the entry. */
export function resolveChoices<T>(entry: T, index: number): T {
  if (!stringsOf(entry).some((text) => text.includes("["))) {
    return entry;
  }
  return resolveWith(entry, index % choiceCount(entry), { value: 1 }) as T;
}

/** Every wording of an entry, for the tests that check each one. */
export function everyWording<T>(entry: T): T[] {
  return Array.from({ length: choiceCount(entry) }, (_, index) => resolveChoices(entry, index));
}

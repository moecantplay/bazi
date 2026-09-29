/**
 * Decodes the packed solar-term table (data/solar-terms.packed.ts) back into
 * the entries the engine reads. The browser bundle carries the packed form
 * instead of the ISO-string JSON (M19.8-08); the result is identical.
 */

import { FIRST_JIE_EPOCH_MS, JIE_CYCLE, JIE_GAPS_MS } from "../data/solar-terms.packed.js";
import type { SolarTermEntry } from "./types.js";

export function decodeSolarTerms(): SolarTermEntry[] {
  const entries: SolarTermEntry[] = [];
  let epoch = FIRST_JIE_EPOCH_MS;
  for (let index = 0; index <= JIE_GAPS_MS.length; index += 1) {
    if (index > 0) {
      epoch += JIE_GAPS_MS[index - 1]!;
    }
    const { name, longitude } = JIE_CYCLE[index % JIE_CYCLE.length]!;
    entries.push({ name, longitude, iso: new Date(epoch).toISOString() });
  }
  return entries;
}

/**
 * Rotating picks (M24-11 R3): a line that steps through a pool picks by its
 * slot's visit count, how many times that slot's situation has come up for
 * this chart before, which presentation counts with no stored history. A slot
 * with no count steps by the day number instead. The slot string names both
 * the line and its situation ("card:stage:Peak"), so it is also the key the
 * visits are counted under.
 *
 * A picked entry's choice groups (R11) step once per comeback: each time the
 * same entry returns, it reads in its next combination, every combination
 * before a repeat, starting where the chart's hash puts it.
 */

import { choiceCount, resolveChoices } from "./choices.js";
import { cyclePick, dayNumber, fnv1a } from "./hash.js";
import type { DailySeed } from "./types.js";

/** One rotating pick a reading makes: the slot it was made under and the size of its pool. */
export interface RotationSlot {
  slot: string;
  poolSize: number;
}

export type Picker = <T>(pool: readonly T[], slot: string) => T;

/** The pool entry at `step`, in the wording for its comeback number. */
function pickWording<T>(pool: readonly T[], chart: string, slot: string, step: number): T {
  const entry = cyclePick(pool, chart, slot, step);
  if (choiceCount(entry) === 1) {
    return entry;
  }
  const comeback = Math.floor(step / pool.length);
  return resolveChoices(entry, fnv1a(`${chart}|${slot}|wording`) + comeback);
}

/** A picker for one reading; with `record`, it also lists every slot it picks under. */
export function pickerFor(seed: DailySeed, record?: RotationSlot[]): Picker {
  return <T>(pool: readonly T[], slot: string): T => {
    record?.push({ slot, poolSize: pool.length });
    return pickWording(pool, seed.chart, slot, seed.visits?.[slot] ?? dayNumber(seed.date));
  };
}

/**
 * A picker that steps every slot by one number: Ahead's period number (months
 * since 1970, the year, the decade), so neighbouring periods read differently
 * without counting visits over every period on screen.
 */
export function steppedPicker(chart: string, step: number, record?: RotationSlot[]): Picker {
  return <T>(pool: readonly T[], slot: string): T => {
    record?.push({ slot, poolSize: pool.length });
    return pickWording(pool, chart, slot, step);
  };
}

/** The first pool entry not yet on the screen, so one screen never says a line twice while the pool has another. */
export function firstUnused<T>(pool: readonly T[], isUsed: (entry: T) => boolean): T {
  return pool.find((entry) => !isUsed(entry)) ?? (pool[0] as T);
}

/** Fills `{name}` placeholders in a pool entry. */
export function fillSlots(template: string, values: Readonly<Record<string, string>>): string {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

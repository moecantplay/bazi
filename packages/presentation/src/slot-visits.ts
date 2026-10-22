/**
 * How many times each rotating slot's situation has come up before for this
 * chart (M24-11 R3, generalising M20-21's lead visit), so each visit reads
 * differently from the last one.
 *
 * Every slot Today counts here depends only on the chart and the day pillar:
 * the lead and the cards on the day's facts, the colour line on the day's
 * element. The day pillar repeats every 60 days, so within any 60-day block a
 * slot comes up the same number of times, which makes
 * `block × times-per-block + rank-within-block` a running visit count with no
 * history to store. One scan of the block counts every slot at once, and is
 * kept for the next date in the same block (stepping days, opening a topic
 * page).
 */

import { dailyFacts, dailyPillar } from "@daymaster/bazi-engine";
import { dailySlots, dayColourSlot } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { addDays, daysBetween } from "./dates.js";
import { readingZoneOf } from "./reading-zone.js";
import { natalSeedKey } from "./seed-key.js";
import { colourModeFor } from "./today-colour.js";
import type { StoredProfile } from "./types.js";

const EPOCH = "1970-01-01";
const PILLAR_CYCLE_DAYS = 60;

export type Visits = Readonly<Record<string, number>>;

let cache: { key: string; slotsByOffset: string[][] } | null = null;

/** Every day's slots in one 60-day block, memoized (like chartFor) on the birth, config, zone and block. */
function blockSlots(profile: StoredProfile, block: number): string[][] {
  const zone = readingZoneOf(profile);
  const key = JSON.stringify({ birth: profile.birth, config: profile.config, zone, block });
  if (cache && cache.key === key) {
    return cache.slotsByOffset;
  }
  const chart = chartFor(profile);
  const chartSeed = natalSeedKey(profile);
  const blockStart = addDays(EPOCH, block * PILLAR_CYCLE_DAYS);
  const slotsByOffset = Array.from({ length: PILLAR_CYCLE_DAYS }, (_, offset) => {
    const iso = addDays(blockStart, offset);
    const mode = colourModeFor(profile, dailyPillar(iso, zone).stem);
    const slots = dailySlots(dailyFacts(chart, iso, zone), chartSeed).map((entry) => entry.slot);
    return mode === null ? slots : [...slots, dayColourSlot(mode)];
  });
  cache = { key, slotsByOffset };
  return slotsByOffset;
}

export function slotVisits(profile: StoredProfile, dateISO: string): Visits {
  const day = daysBetween(EPOCH, dateISO);
  const block = Math.floor(day / PILLAR_CYCLE_DAYS);
  const todayOffset = day - block * PILLAR_CYCLE_DAYS;
  const slotsByOffset = blockSlots(profile, block);

  const timesPerBlock = new Map<string, number>();
  const rank = new Map<string, number>();
  slotsByOffset.forEach((slots, offset) => {
    for (const slot of slots) {
      timesPerBlock.set(slot, (timesPerBlock.get(slot) ?? 0) + 1);
      if (offset < todayOffset) {
        rank.set(slot, (rank.get(slot) ?? 0) + 1);
      }
    }
  });
  const todaySlots = slotsByOffset[todayOffset] ?? [];
  return Object.fromEntries(todaySlots.map((slot) => [slot, block * (timesPerBlock.get(slot) ?? 0) + (rank.get(slot) ?? 0)]));
}

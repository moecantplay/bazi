/**
 * How many times a day's lead situation has come up before (M20-21 R3), so
 * each visit reads differently from the last one.
 *
 * A lead that pulls on the chart depends only on the day's animal sign, so
 * which days share a situation repeats every 12 days; a quiet day's lead also
 * depends on the day's stem, so it repeats every 60. Within any block of that
 * length the situation comes up the same number of times, which makes
 * `block × times-per-block + rank-within-block` a running visit count with no
 * history to store.
 */

import { dailyFacts, type Chart } from "@daymaster/bazi-engine";
import { leadCellOf } from "@daymaster/content";
import { addDays, daysBetween } from "./dates.js";

const EPOCH = "1970-01-01";
const SIGN_CYCLE_DAYS = 12;
const PILLAR_CYCLE_DAYS = 60;

export function leadVisit(chart: Chart, zone: string, dateISO: string, chartSeed: string): number {
  const cellOn = (iso: string): string => leadCellOf(dailyFacts(chart, iso, zone), chartSeed);
  const cell = cellOn(dateISO);
  const period = cell.startsWith("quiet:") ? PILLAR_CYCLE_DAYS : SIGN_CYCLE_DAYS;

  const day = daysBetween(EPOCH, dateISO);
  const block = Math.floor(day / period);
  const blockStart = addDays(EPOCH, block * period);

  let timesPerBlock = 0;
  let rank = 0;
  for (let offset = 0; offset < period; offset += 1) {
    if (cellOn(addDays(blockStart, offset)) !== cell) {
      continue;
    }
    timesPerBlock += 1;
    if (block * period + offset < day) {
      rank += 1;
    }
  }
  return block * timesPerBlock + rank;
}

/**
 * Today's colour, phrased (M24-06). Presentation picks the element (the day's
 * own when it helps the reader, else a helper that steadies it); this picks a
 * shade of it by seed, so the same birth and date always read the same, and
 * steps the line through its pool by visit (M24-11).
 */

import type { Element } from "@daymaster/bazi-engine";
import { DAY_COLOUR_LINES, ELEMENT_COLOURS, type Colour } from "../../banks/colours.js";
import { pick } from "../../hash.js";
import { fillSlots, pickerFor } from "../../rotation.js";
import type { DailySeed } from "../../types.js";

export type DayColourMode = "lean" | "steady";

export interface DayColour {
  colour: Colour;
  mode: DayColourMode;
  line: string;
}

/** The slot Today's colour line rotates under, for presentation's visit count. */
export function dayColourSlot(mode: DayColourMode): string {
  return `colour-line:${mode}`;
}

export function dayColour(element: Element, mode: DayColourMode, seed: DailySeed): DayColour {
  const colour = pick(ELEMENT_COLOURS[element], `${seed.chart}|${seed.date}`, "day-colour");
  const line = fillSlots(pickerFor(seed)(DAY_COLOUR_LINES[mode], dayColourSlot(mode)), { colour });
  return { colour, mode, line };
}

/**
 * TRIAL R17: Today's colour, phrased. Presentation picks the element (the
 * day's own when it helps you, else a helper that steadies it); this picks a
 * shade of it by seed, so the same birth and date always read the same.
 */

import type { Element } from "@daymaster/bazi-engine";
import { ELEMENT_COLOURS, dayColourLine, type Colour } from "../../banks/trial/colours.js";
import { pick } from "../../hash.js";

export type DayColourMode = "lean" | "steady";

export interface DayColour {
  colour: Colour;
  mode: DayColourMode;
  line: string;
}

export function dayColour(element: Element, mode: DayColourMode, seedKey: string): DayColour {
  const colour = pick(ELEMENT_COLOURS[element], seedKey, "day-colour");
  return { colour, mode, line: dayColourLine(mode, colour) };
}

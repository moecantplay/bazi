/**
 * TRIAL (2026-10-05 reshape trial build): the day-master portrait as one
 * sentence — the defining image that opens each archetype block in
 * DAY_MASTER_LINES ("You are the mountain: slow to move, impossible to
 * ignore."). Used by Today's first-day banner and the You screen's lead.
 */

import type { Stem } from "@daymaster/bazi-engine";
import { DAY_MASTER_LINES } from "../day-master.js";

/** The first sentence of the stem's defining image. */
export function portraitLine(stem: Stem): string {
  const image = DAY_MASTER_LINES[stem][0] ?? "";
  const end = image.indexOf(". ");
  return end === -1 ? image : image.slice(0, end + 1);
}

/** The rest of the defining image, after its first sentence. */
export function portraitRest(stem: Stem): string {
  const image = DAY_MASTER_LINES[stem][0] ?? "";
  const end = image.indexOf(". ");
  return end === -1 ? "" : image.slice(end + 2);
}

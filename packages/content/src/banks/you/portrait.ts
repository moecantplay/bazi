/**
 * The day-master portrait split for a lead: the first sentence of the defining
 * image that opens each block in DAY_MASTER_LINES ("You are the mountain: slow
 * to move, impossible to ignore.") is the headline, the rest is the body.
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

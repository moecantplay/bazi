/**
 * What the rendered screens break as they stand (M24-11 R6), per surface. A
 * ratchet: each count may only go down. M24-11 phase 3 lowers them to zero,
 * and the ratchet is deleted when every surface is empty.
 */

import type { ScreenCounts } from "./screen-repeats.js";

export const KNOWN_SCREEN_COUNTS: ScreenCounts = {
  "Today": { "window repeats": 2 },
  "Topic pages": { "phrase pairs": 877 },
  "Ahead": {},
  "You": { "phrase pairs": 5, "em-dash": 2, "contrast": 3 },
  "Your chart": { "phrase pairs": 12, "em-dash": 39, "long-sentence": 8, "contrast": 10, "stock-phrase": 3 },
  "People": {},
};

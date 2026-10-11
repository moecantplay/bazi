/**
 * A swatch fill for each named colour (M24-08, M24-06). These show the real
 * colour a reader would wear, so they are the same in both themes; the name
 * always sits beside the swatch, and a swatch is never a colour mass
 * (DESIGN.md §Shared surfaces, Colour swatches).
 */

import type { Colour } from "@daymaster/content";

export const COLOUR_SWATCH: Record<Colour, string> = {
  green: "#4E8A3E",
  teal: "#2F8C85",
  red: "#C0392B",
  orange: "#E07B2A",
  pink: "#E59AB0",
  yellow: "#E8C547",
  beige: "#D9C8A4",
  brown: "#7A5230",
  white: "#FFFFFF",
  grey: "#9A9A9A",
  gold: "#C9A227",
  black: "#111111",
  navy: "#1F2F55",
};

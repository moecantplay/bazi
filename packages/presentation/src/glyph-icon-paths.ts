/**
 * Hand-drawn 24×24 icon primitives for the five elements — the visual
 * anchors that stand beside every stem's wording (DESIGN.md §Glyph icons).
 * Drawn to match the orbit's fine-line art: 1.7 stroke, round caps and joins.
 *
 * Elements carry two variants: a solid fill (yang) and a line outline (yin).
 * The zodiac animal silhouettes live in lib/animal-icon-paths.ts. Rendered
 * by components/glyph-icon.tsx; the seal also carves the element marks.
 */

import type { Element } from "@daymaster/bazi-engine";

/** One drawing primitive. `dot` is filled even inside line icons (eyes). */
export type IconPrimitive =
  | { kind: "path"; d: string }
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "dot"; cx: number; cy: number; r: number };

export interface ElementIconPaths {
  line: IconPrimitive[];
  /** Single filled path for the solid (yang) variant. */
  solid: string;
  solidFillRule?: "evenodd";
}

export const ELEMENT_ICON_PATHS: Record<Element, ElementIconPaths> = {
  wood: {
    line: [
      { kind: "path", d: "M12 3.5 C7 6 4.5 12 7 19 C13.5 17.5 17.5 11.5 16.5 4.5 C15 4 13.5 3.6 12 3.5 Z" },
      { kind: "path", d: "M7 19 C9.5 13.5 12.5 9.5 15.5 6.5" }
    ],
    solid: "M12 3.5 C7 6 4.5 12 7 19 C13.5 17.5 17.5 11.5 16.5 4.5 C15 4 13.5 3.6 12 3.5 Z"
  },
  fire: {
    line: [
      { kind: "path", d: "M12 3 C12.5 6.5 16.5 8.5 16.5 13 A4.7 4.7 0 0 1 7.5 13 C7.5 10.7 8.8 9.4 9.7 7.6 C10.3 9.2 11.2 9.9 11.6 9.3 C12 8.6 12 5.5 12 3 Z" }
    ],
    solid: "M12 3 C12.5 6.5 16.5 8.5 16.5 13 A4.7 4.7 0 0 1 7.5 13 C7.5 10.7 8.8 9.4 9.7 7.6 C10.3 9.2 11.2 9.9 11.6 9.3 C12 8.6 12 5.5 12 3 Z"
  },
  earth: {
    line: [{ kind: "path", d: "M3.5 18.5 L9.5 8 L13 13.2 L15.2 10 L20.5 18.5 Z" }],
    solid: "M3.5 18.5 L9.5 8 L13 13.2 L15.2 10 L20.5 18.5 Z"
  },
  metal: {
    line: [
      { kind: "circle", cx: 12, cy: 12, r: 8.2 },
      { kind: "rect", x: 9.2, y: 9.2, width: 5.6, height: 5.6 }
    ],
    solid: "M12 3.8 A8.2 8.2 0 1 0 12 20.2 A8.2 8.2 0 1 0 12 3.8 Z M9.2 9.2 h5.6 v5.6 h-5.6 Z",
    solidFillRule: "evenodd"
  },
  water: {
    line: [
      { kind: "path", d: "M12 3.5 C12 3.5 6.2 10.5 6.2 14.6 A5.8 5.8 0 0 0 17.8 14.6 C17.8 10.5 12 3.5 12 3.5 Z" }
    ],
    solid: "M12 3.5 C12 3.5 6.2 10.5 6.2 14.6 A5.8 5.8 0 0 0 17.8 14.6 C17.8 10.5 12 3.5 12 3.5 Z"
  }
};


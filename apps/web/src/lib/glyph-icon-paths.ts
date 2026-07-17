/**
 * Hand-drawn 24×24 icon primitives for the five elements and twelve zodiac
 * animals — the English-first visual anchors that stand where Han glyphs
 * stand when Chinese characters are on (DESIGN.md §Glyph icons). Drawn to
 * match the orbit's fine-line art: 1.7 stroke, round caps and joins.
 *
 * Elements carry two variants: a solid fill (yang) and a line outline (yin).
 * Animals are always line icons; their color carries the branch's element.
 * Rendered by components/glyph-icon.tsx.
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

export const ANIMAL_ICON_PATHS: Record<string, IconPrimitive[]> = {
  rat: [
    { kind: "circle", cx: 9.5, cy: 7.5, r: 2.6 },
    { kind: "path", d: "M6 14.5 C6 11 9 9.5 12 9.8 C15 10.1 17.8 12 19.8 14.2 C18 16.2 15 17.2 12 17.2 C9 17.2 6 17.5 6 14.5 Z" },
    { kind: "path", d: "M6.2 15.5 C3.8 16.2 3.2 18.6 4.8 20" },
    { kind: "dot", cx: 15.5, cy: 12.8, r: 0.5 }
  ],
  ox: [
    { kind: "ellipse", cx: 12, cy: 13.2, rx: 4.9, ry: 5.6 },
    { kind: "path", d: "M8.6 9 C6.2 8.4 4.8 6.4 5 3.9" },
    { kind: "path", d: "M15.4 9 C17.8 8.4 19.2 6.4 19 3.9" },
    { kind: "dot", cx: 10.3, cy: 12, r: 0.5 },
    { kind: "dot", cx: 13.7, cy: 12, r: 0.5 },
    { kind: "dot", cx: 10.7, cy: 15.8, r: 0.5 },
    { kind: "dot", cx: 13.3, cy: 15.8, r: 0.5 }
  ],
  tiger: [
    { kind: "circle", cx: 12, cy: 12.5, r: 5.7 },
    { kind: "circle", cx: 7.6, cy: 7.4, r: 1.7 },
    { kind: "circle", cx: 16.4, cy: 7.4, r: 1.7 },
    { kind: "path", d: "M10.6 8.6 V10.2 M12 8.3 V10 M13.4 8.6 V10.2" },
    { kind: "dot", cx: 9.9, cy: 12.3, r: 0.5 },
    { kind: "dot", cx: 14.1, cy: 12.3, r: 0.5 },
    { kind: "path", d: "M11.2 14.8 C11.7 15.4 12.3 15.4 12.8 14.8" }
  ],
  rabbit: [
    { kind: "circle", cx: 12, cy: 14.8, r: 4.7 },
    { kind: "path", d: "M10.2 10.5 C8.4 6.5 8.7 3.4 10.4 3 C11.7 2.8 12.2 5.4 11.7 10" },
    { kind: "path", d: "M13.8 10.5 C15.6 6.5 15.3 3.4 13.6 3 C12.3 2.8 11.8 5.4 12.3 10" },
    { kind: "dot", cx: 10.2, cy: 14, r: 0.5 },
    { kind: "dot", cx: 13.8, cy: 14, r: 0.5 }
  ],
  dragon: [
    { kind: "path", d: "M21.6 9.6 L18.4 10 C17 8.4 15.1 7.3 12.6 7.3 C9.2 7.3 6.2 9.8 6.6 13.6 C6.8 15.6 8.9 15.4 11.2 15.5 C14 15.7 16.9 14.4 18.7 11.6 L20.9 12.9" },
    { kind: "path", d: "M9.9 7 C9.1 4.4 10.2 2.6 12.3 2.3 M9.5 4.8 C8.5 4.4 7.6 4.7 7 5.5" },
    { kind: "path", d: "M13.7 7 C14 4.5 15.6 3 17.7 3.2 M14.6 4.8 C15.6 4.1 16.5 4.2 17.3 4.8" },
    { kind: "path", d: "M7 10 C5.6 10.3 4.6 11.3 4.2 12.7" },
    { kind: "path", d: "M8.2 15.7 C7.4 17.1 7.6 18.7 8.8 19.7" },
    { kind: "dot", cx: 13.4, cy: 10, r: 0.5 }
  ],
  snake: [
    { kind: "path", d: "M8.6 6.8 C8.9 5.4 8 4.2 6.6 4.2 C5.2 4.2 4.3 5.4 4.6 6.7 C4.9 7.9 6.1 8.4 7.2 8.2 C10 7.8 12.8 9.4 13.4 12 C14 14.6 12.4 16.6 10 16.9 C8.2 17.1 6.8 16.2 6.4 14.8" },
    { kind: "path", d: "M13.4 12 C16.4 11.4 19.2 13 19.6 15.6 C20 18.2 18.2 20 15.8 20" },
    { kind: "path", d: "M4.7 5.4 L2.8 4.6 M2.8 4.6 L2 3.9 M2.8 4.6 L2.1 5.4" },
    { kind: "dot", cx: 6.3, cy: 5.6, r: 0.45 }
  ],
  horse: [
    { kind: "path", d: "M6.8 15.2 C6.8 10.8 9.4 8 12.8 7.6 C14.8 7.4 16.6 8.2 18 9.7 L20.4 11.5 C19.4 12.6 17.9 12.9 16.7 12.4 C16.1 15 13.9 16.7 11.3 16.7 C9.4 16.7 7.4 16.8 6.8 15.2 Z" },
    { kind: "path", d: "M11.2 7.6 L11.9 5 L13.3 7.4" },
    { kind: "path", d: "M7.6 9.3 C6.4 8.5 5.8 7 6.1 5.4" },
    { kind: "path", d: "M9.2 8.1 C8.4 7.1 8.2 5.6 8.8 4.2" },
    { kind: "dot", cx: 14.6, cy: 10.6, r: 0.5 },
    { kind: "dot", cx: 18.6, cy: 10.9, r: 0.45 }
  ],
  goat: [
    { kind: "circle", cx: 12, cy: 13.8, r: 4.8 },
    { kind: "path", d: "M9.6 9.6 C7 9.2 5.8 7 6.6 4.4" },
    { kind: "path", d: "M14.4 9.6 C17 9.2 18.2 7 17.4 4.4" },
    { kind: "path", d: "M12 18.6 L12 20.4" },
    { kind: "dot", cx: 10.2, cy: 13, r: 0.5 },
    { kind: "dot", cx: 13.8, cy: 13, r: 0.5 }
  ],
  monkey: [
    { kind: "circle", cx: 12, cy: 11.5, r: 5.4 },
    { kind: "circle", cx: 5.4, cy: 11.5, r: 2 },
    { kind: "circle", cx: 18.6, cy: 11.5, r: 2 },
    { kind: "path", d: "M8.8 14.5 C9.4 16.6 14.6 16.6 15.2 14.5" },
    { kind: "dot", cx: 10, cy: 10.3, r: 0.5 },
    { kind: "dot", cx: 14, cy: 10.3, r: 0.5 }
  ],
  rooster: [
    { kind: "path", d: "M9.4 8.4 C9 6.2 10.2 4.4 12.2 4.1 C12.4 5 13.1 5.6 14 5.6 C14.3 4.7 15.1 4.1 16.1 4.2" },
    { kind: "circle", cx: 12.6, cy: 10.9, r: 4.3 },
    { kind: "path", d: "M16.8 9.9 L19.8 10.7 L16.9 11.9" },
    { kind: "path", d: "M14.3 14.9 C14.4 16.3 13.7 17.3 12.4 17.5" },
    { kind: "dot", cx: 13.9, cy: 9.6, r: 0.5 }
  ],
  dog: [
    { kind: "circle", cx: 12, cy: 12.5, r: 5.6 },
    { kind: "path", d: "M7 8.5 C5 9.5 4.6 13 6.4 15.5" },
    { kind: "path", d: "M17 8.5 C19 9.5 19.4 13 17.6 15.5" },
    { kind: "dot", cx: 10, cy: 11.5, r: 0.5 },
    { kind: "dot", cx: 14, cy: 11.5, r: 0.5 },
    { kind: "path", d: "M11 15 C11.6 15.6 12.4 15.6 13 15 M12 15.3 L12 14" }
  ],
  pig: [
    { kind: "circle", cx: 12, cy: 12.5, r: 5.7 },
    { kind: "ellipse", cx: 12, cy: 14, rx: 2.7, ry: 1.9 },
    { kind: "dot", cx: 11, cy: 14, r: 0.4 },
    { kind: "dot", cx: 13, cy: 14, r: 0.4 },
    { kind: "path", d: "M7.6 8.6 C6.8 6.9 7.5 5.3 9.3 5 C9.8 6.2 9.6 7.5 8.9 8.4" },
    { kind: "path", d: "M16.4 8.6 C17.2 6.9 16.5 5.3 14.7 5 C14.2 6.2 14.4 7.5 15.1 8.4" },
    { kind: "dot", cx: 9.8, cy: 11.3, r: 0.5 },
    { kind: "dot", cx: 14.2, cy: 11.3, r: 0.5 }
  ]
};

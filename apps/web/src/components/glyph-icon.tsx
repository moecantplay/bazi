/**
 * The element and animal glyph icons (DESIGN.md §Glyph icons): the visual
 * anchors beside every stem's and branch's wording. Elements render solid
 * when yang, outline when yin — polarity you can see — and default to their
 * element hue; animals are filled silhouettes colored by their branch's
 * element. Every icon carries its name as an accessible label and a hover
 * tooltip; adjacent copy always names it in words too.
 *
 * ElementGlyphMark / AnimalGlyphMark are bare <g> versions for composing
 * inside another SVG (the Today orbit). The dragon swaps in a more detailed
 * path at 40px and up — its compact path is what stays readable small.
 */

import type { Element } from "@daymaster/bazi-engine";
import { ANIMAL_ICON_PATHS } from "@/lib/animal-icon-paths";
import { ELEMENT_ICON_PATHS, type IconPrimitive } from "@/lib/glyph-icon-paths";

/** Renders at or above this size use an animal's richer path when it has one. */
const DETAIL_SIZE = 40;

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;

function Primitive({ prim }: { prim: IconPrimitive }) {
  switch (prim.kind) {
    case "path":
      return <path {...STROKE} d={prim.d} />;
    case "circle":
      return <circle {...STROKE} cx={prim.cx} cy={prim.cy} r={prim.r} />;
    case "ellipse":
      return <ellipse {...STROKE} cx={prim.cx} cy={prim.cy} rx={prim.rx} ry={prim.ry} />;
    case "rect":
      return <rect {...STROKE} x={prim.x} y={prim.y} width={prim.width} height={prim.height} />;
    case "dot":
      return <circle fill="currentColor" cx={prim.cx} cy={prim.cy} r={prim.r} />;
  }
}

interface ElementMarkProps {
  element: Element;
  polarity: "yang" | "yin";
  transform?: string;
}

/** Bare primitives for one element, for composing inside an existing SVG. */
export function ElementGlyphMark({ element, polarity, transform }: ElementMarkProps) {
  const paths = ELEMENT_ICON_PATHS[element];
  return (
    <g transform={transform}>
      {polarity === "yang" ? (
        <path fill="currentColor" fillRule={paths.solidFillRule} d={paths.solid} />
      ) : (
        paths.line.map((prim, index) => <Primitive key={index} prim={prim} />)
      )}
    </g>
  );
}

interface AnimalMarkProps {
  animal: string;
  transform?: string;
  /** The size the mark effectively renders at, for the dragon's detail swap. */
  renderSize?: number;
}

/** The bare silhouette path for one animal, for composing inside an existing SVG. */
export function AnimalGlyphMark({ animal, transform, renderSize = 24 }: AnimalMarkProps) {
  const paths = ANIMAL_ICON_PATHS[animal];
  if (!paths) {
    return null;
  }
  const d = renderSize >= DETAIL_SIZE && paths.dLarge ? paths.dLarge : paths.d;
  return (
    <g transform={transform}>
      <path fill="currentColor" fillRule="evenodd" d={d} />
    </g>
  );
}

interface ElementIconProps {
  element: Element;
  polarity: "yang" | "yin";
  size?: number;
  /** "element" (default) colors by hue; "ink" for tinted surfaces like the hero. */
  tone?: "element" | "ink";
}

export function ElementIcon({ element, polarity, size = 24, tone = "element" }: ElementIconProps) {
  const label = `${polarity} ${element}`;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={tone === "element" ? { color: `var(--element-${element})` } : { color: "var(--ink)" }}
    >
      <title>{label}</title>
      <ElementGlyphMark element={element} polarity={polarity} />
    </svg>
  );
}

interface AnimalIconProps {
  animal: string;
  /** The branch's element — carries the icon's hue. */
  element: Element;
  size?: number;
  tone?: "element" | "ink";
}

export function AnimalIcon({ animal, element, size = 24, tone = "element" }: AnimalIconProps) {
  return (
    <svg
      role="img"
      aria-label={animal}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={tone === "element" ? { color: `var(--element-${element})` } : { color: "var(--ink)" }}
    >
      <title>{animal}</title>
      <AnimalGlyphMark animal={animal} renderSize={size} />
    </svg>
  );
}

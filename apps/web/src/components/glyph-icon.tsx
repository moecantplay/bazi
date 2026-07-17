/**
 * The element and animal glyph icons (DESIGN.md §Glyph icons): the visual
 * anchors that stand where Han characters stand when Chinese characters are
 * off. Elements render solid when yang, outline when yin — polarity you can
 * see — and default to their element hue; animals are line icons colored by
 * their branch's element. Every icon carries its name as an accessible label
 * and a hover tooltip; adjacent copy always names it in words too.
 *
 * ElementGlyphMark / AnimalGlyphMark are bare <g> versions for composing
 * inside another SVG (the Today orbit).
 */

import type { Element } from "@daymaster/bazi-engine";
import {
  ANIMAL_ICON_PATHS,
  ELEMENT_ICON_PATHS,
  type IconPrimitive
} from "@/lib/glyph-icon-paths";

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
}

/** Bare primitives for one animal, for composing inside an existing SVG. */
export function AnimalGlyphMark({ animal, transform }: AnimalMarkProps) {
  const paths = ANIMAL_ICON_PATHS[animal];
  if (!paths) {
    return null;
  }
  return (
    <g transform={transform}>
      {paths.map((prim, index) => (
        <Primitive key={index} prim={prim} />
      ))}
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
      <AnimalGlyphMark animal={animal} />
    </svg>
  );
}

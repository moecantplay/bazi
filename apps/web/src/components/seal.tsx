/**
 * The cinnabar mark — the app's one deterministic signature, redesigned as a
 * personal logo (owner decision 2026-07-17): the day-master's element icon
 * inside an orbit ring on the square cinnabar stamp. No characters.
 *
 * Still a pure function of the chart: identical pillars render an identical
 * SVG on every device. All variation seeds from one FNV-1a hash of the
 * concatenated stem+branch characters, expanded through mulberry32 (see
 * lib/hash.ts). The hash picks the ring weight (1 of 3), the orbit node's
 * position (1 of 8), a rotation jitter of +/-1.5 degrees, and which two or
 * three corners carry a hand-stamped notch. The element mark itself follows
 * the polarity rule: yang solid, yin outlined.
 *
 * Cinnabar appears here and nowhere else in the product. The share card
 * clones this SVG and resolves its CSS variables, so it must only use
 * --cinnabar, --seal-paper, and --paper.
 */

import type { Pillar } from "@daymaster/bazi-engine";
import { createSeededRandom, fnv1a } from "@/lib/hash";
import { describeStem } from "@/lib/display";
import { ELEMENT_ICON_PATHS, type IconPrimitive } from "@/lib/glyph-icon-paths";

type Corner = "tl" | "tr" | "br" | "bl";

interface Notch {
  corner: Corner;
  size: number;
}

interface SealGeometry {
  ringWeight: number;
  nodeAngle: number;
  rotation: number;
  notches: Notch[];
}

const RING_WEIGHTS = [3.5, 4.5, 5.5];
const NODE_ANGLES = [-135, -90, -45, 0, 45, 90, 135, 180];
const CORNERS: Corner[] = ["tl", "tr", "br", "bl"];
const RING_RADIUS = 36;

/** All pillars present, in chart order, dropping the hour when time is unknown. */
function orderedPillars(pillars: (Pillar | null)[]): Pillar[] {
  return pillars.filter((pillar): pillar is Pillar => pillar !== null);
}

function computeGeometry(pillars: Pillar[]): SealGeometry {
  const signature = pillars.map((pillar) => pillar.stem + pillar.branch).join("");
  const random = createSeededRandom(fnv1a(signature));

  const ringWeight = RING_WEIGHTS[Math.floor(random() * RING_WEIGHTS.length)] ?? 4.5;
  const nodeAngle = NODE_ANGLES[Math.floor(random() * NODE_ANGLES.length)] ?? -45;
  const rotation = (random() * 2 - 1) * 1.5;
  const notchCount = random() < 0.5 ? 2 : 3;

  const pool = [...CORNERS];
  const notches: Notch[] = [];
  for (let index = 0; index < notchCount && pool.length > 0; index += 1) {
    const pick = Math.floor(random() * pool.length);
    const [corner] = pool.splice(pick, 1);
    if (corner) {
      notches.push({ corner, size: 9 + random() * 7 });
    }
  }

  return { ringWeight, nodeAngle, rotation, notches };
}

/** A paper-colored triangle that chips the given corner of the 100x100 square. */
function notchPoints(notch: Notch): string {
  const { corner, size } = notch;
  const byCorner: Record<Corner, string> = {
    tl: `0,0 ${size},0 0,${size}`,
    tr: `100,0 ${100 - size},0 100,${size}`,
    br: `100,100 ${100 - size},100 100,${100 - size}`,
    bl: `0,100 ${size},100 0,${100 - size}`
  };
  return byCorner[corner];
}

/** One line primitive of the yin (outlined) element mark, in seal-paper. */
function LinePrimitive({ prim }: { prim: IconPrimitive }) {
  const stroke = {
    fill: "none",
    stroke: "var(--seal-paper)",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  } as const;
  switch (prim.kind) {
    case "path":
      return <path {...stroke} d={prim.d} />;
    case "circle":
      return <circle {...stroke} cx={prim.cx} cy={prim.cy} r={prim.r} />;
    case "ellipse":
      return <ellipse {...stroke} cx={prim.cx} cy={prim.cy} rx={prim.rx} ry={prim.ry} />;
    case "rect":
      return <rect {...stroke} x={prim.x} y={prim.y} width={prim.width} height={prim.height} />;
    case "dot":
      return <circle fill="var(--seal-paper)" cx={prim.cx} cy={prim.cy} r={prim.r} />;
  }
}

interface Props {
  pillars: (Pillar | null)[];
  /** Rendered pixel size of the square. */
  size?: number;
  className?: string;
}

export function Seal({ pillars, size = 132, className }: Props) {
  const present = orderedPillars(pillars);
  const geometry = computeGeometry(present);

  // The day pillar is third in chart order; with an unknown hour it is last.
  const day = pillars[2] ?? present[present.length - 1];
  const stem = day ? describeStem(day.stem) : null;
  const mark = stem ? ELEMENT_ICON_PATHS[stem.element] : null;

  const nodeRadians = (geometry.nodeAngle * Math.PI) / 180;
  const nodeX = 50 + RING_RADIUS * Math.cos(nodeRadians);
  const nodeY = 50 + RING_RADIUS * Math.sin(nodeRadians);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={stem ? `Your day-master mark: ${stem.polarity} ${stem.element}` : "Your mark"}
      className={className}
    >
      <rect x="0" y="0" width="100" height="100" rx="14" fill="var(--cinnabar)" />
      <g transform={`rotate(${geometry.rotation} 50 50)`}>
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--seal-paper)"
          strokeWidth={geometry.ringWeight}
        />
        <circle cx={nodeX} cy={nodeY} r="6" fill="var(--seal-paper)" />
        {mark && stem && (
          <g transform="translate(26.6 26.6) scale(1.95)">
            {stem.polarity === "yang" ? (
              <path
                fill="var(--seal-paper)"
                fillRule={mark.solidFillRule}
                d={mark.solid}
              />
            ) : (
              mark.line.map((prim, index) => <LinePrimitive key={index} prim={prim} />)
            )}
          </g>
        )}
      </g>
      {geometry.notches.map((notch, index) => (
        <polygon key={index} points={notchPoints(notch)} fill="var(--paper)" />
      ))}
    </svg>
  );
}

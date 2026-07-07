/**
 * The cinnabar seal — the app's one deterministic signature.
 *
 * Given a chart's pillars, the seal is a pure function: identical pillars render
 * an identical SVG on every device. All variation is seeded from a single
 * FNV-1a hash of the concatenated stem+branch characters, expanded through a
 * mulberry32 PRNG (see lib/hash.ts). The hash chooses the inner-border weight
 * (1 of 3), a grid rotation jitter of +/-1.5 degrees, and which two or three
 * corners carry a hand-stamped notch.
 *
 * Cinnabar appears here and nowhere else in the product.
 */

import type { Pillar } from "@daymaster/bazi-engine";
import { createSeededRandom, fnv1a } from "@/lib/hash";

type Corner = "tl" | "tr" | "br" | "bl";

interface Notch {
  corner: Corner;
  size: number;
}

interface SealGeometry {
  stems: string[];
  borderWeight: number;
  rotation: number;
  notches: Notch[];
}

const BORDER_WEIGHTS = [1.4, 2.2, 3];
const CORNERS: Corner[] = ["tl", "tr", "br", "bl"];

/** All pillars present, in chart order, dropping the hour when time is unknown. */
function orderedPillars(pillars: (Pillar | null)[]): Pillar[] {
  return pillars.filter((pillar): pillar is Pillar => pillar !== null);
}

function computeGeometry(pillars: Pillar[]): SealGeometry {
  const signature = pillars.map((pillar) => pillar.stem + pillar.branch).join("");
  const random = createSeededRandom(fnv1a(signature));

  const weightIndex = Math.floor(random() * BORDER_WEIGHTS.length);
  const borderWeight = BORDER_WEIGHTS[weightIndex] ?? 2.2;
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

  return {
    stems: pillars.map((pillar) => pillar.stem),
    borderWeight,
    rotation,
    notches
  };
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

interface StemPlacement {
  char: string;
  x: number;
  y: number;
}

/** Character positions: a 2x2 grid for four stems, a vertical stack for three. */
function placeStems(stems: string[]): { placements: StemPlacement[]; fontSize: number } {
  if (stems.length === 3) {
    const rows = [28, 50, 72];
    return {
      fontSize: 27,
      placements: stems.map((char, index) => ({ char, x: 50, y: rows[index] ?? 50 }))
    };
  }
  const columns = [33, 67];
  const rows = [34, 66];
  return {
    fontSize: 29,
    placements: stems.map((char, index) => ({
      char,
      x: columns[index % 2] ?? 50,
      y: rows[Math.floor(index / 2)] ?? 50
    }))
  };
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
  const { placements, fontSize } = placeStems(geometry.stems);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Your chart's seal"
      className={className}
    >
      <rect x="0" y="0" width="100" height="100" rx="8" fill="var(--cinnabar)" />
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="5"
        fill="none"
        stroke="var(--paper)"
        strokeWidth={geometry.borderWeight}
      />
      <g
        transform={`rotate(${geometry.rotation} 50 50)`}
        fill="var(--paper)"
        fontSize={fontSize}
        fontFamily='"Songti SC", "Noto Serif SC", serif'
        textAnchor="middle"
        dominantBaseline="central"
      >
        {placements.map((placement, index) => (
          <text key={index} x={placement.x} y={placement.y}>
            {placement.char}
          </text>
        ))}
      </g>
      {geometry.notches.map((notch, index) => (
        <polygon key={index} points={notchPoints(notch)} fill="var(--paper)" />
      ))}
    </svg>
  );
}

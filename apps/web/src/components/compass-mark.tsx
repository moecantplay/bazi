/**
 * A bare ring-and-orbit-node mark reused as the map hero's compass rose
 * (DESIGN.md §Surfaces "Map hero"): the same deterministic geometry as the
 * personal-logo seal (see seal.tsx's computeSealGeometry), rendered without
 * the cinnabar square, notches, or element mark — cinnabar stays reserved
 * for the seal alone. Purely decorative here, so it's aria-hidden; the
 * chart's identity mark is the Seal itself, shown elsewhere.
 */

import type { Pillar } from "@daymaster/bazi-engine";
import { SEAL_NODE_RADIUS, SEAL_RING_RADIUS, computeSealGeometry } from "@/components/seal";

interface Props {
  pillars: (Pillar | null)[];
  size?: number;
  className?: string;
  /** Set when nesting inside another <svg> (e.g. the map hero) instead of rendering standalone. */
  x?: number;
  y?: number;
}

export function CompassMark({ pillars, size = 26, className, x, y }: Props) {
  const present = pillars.filter((pillar): pillar is Pillar => pillar !== null);
  const geometry = computeSealGeometry(present);
  const nodeRadians = (geometry.nodeAngle * Math.PI) / 180;
  const nodeX = 50 + SEAL_RING_RADIUS * Math.cos(nodeRadians);
  const nodeY = 50 + SEAL_RING_RADIUS * Math.sin(nodeRadians);

  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 100 100" aria-hidden className={className}>
      <g transform={`rotate(${geometry.rotation} 50 50)`} stroke="currentColor" fill="none">
        <circle cx="50" cy="50" r={SEAL_RING_RADIUS} strokeWidth={geometry.ringWeight} />
        <circle cx={nodeX} cy={nodeY} r={SEAL_NODE_RADIUS} fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

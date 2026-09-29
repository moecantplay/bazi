/**
 * Explorer's fixed map artwork and route curve (DESIGN.md v5 §Explorer).
 * The contours never change (terrain recolours them); the route runs from
 * 6am at the left to 10pm at the right on the same 0–1 scale as
 * `dayProgress` and a timed waypoint's `progress`.
 */

export const ROUTE_WIDTH = 390;
export const ROUTE_HEIGHT = 250;
const START_X = 24;
const END_X = 366;

/** Height of the route at x: climbing left to right with a gentle wave. */
export function routeY(x: number): number {
  const t = (x - START_X) / (END_X - START_X);
  return 205 - t * 150 + 12 * Math.sin(t * Math.PI * 2.2);
}

/** x for a 0–1 position along the day (0 = MORNING, 1 = EVENING). */
export function routeX(progress: number): number {
  return START_X + progress * (END_X - START_X);
}

/** SVG path along the route between two x positions. */
export function routePath(fromX: number = START_X, toX: number = END_X): string {
  const points: string[] = [];
  for (let x = fromX; x < toX; x += 3) {
    points.push(`${x.toFixed(1)},${routeY(x).toFixed(1)}`);
  }
  points.push(`${toX.toFixed(1)},${routeY(toX).toFixed(1)}`);
  return `M${points.join("L")}`;
}

export const ROUTE_END = { x: END_X, y: routeY(END_X) };

function contour(cx: number, cy: number, radius: number, phase: number): string {
  const points: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const wobble = 1 + 0.13 * Math.sin(3 * angle + phase) + 0.07 * Math.sin(5 * angle + phase * 1.7);
    points.push(`${(cx + Math.cos(angle) * radius * wobble * 1.25).toFixed(1)},${(cy + Math.sin(angle) * radius * wobble).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

/** The contour lines behind the hero, in a 390×518 box. */
export const CONTOURS: { d: string; heavy: boolean }[] = [
  [320, 110, 9],
  [50, 470, 7],
  [210, 300, 4]
].flatMap(([cx = 0, cy = 0, rings = 0], set) =>
  Array.from({ length: rings }, (_, ring) => ({
    d: contour(cx, cy, 22 + ring * 24, set * 1.3 + ring * 0.45),
    heavy: ring % 4 === 3
  }))
);

/** Keep two timed marks at least `gap` apart on the route. */
export function spreadMarks(xs: number[], gap = 46): number[] {
  if (xs.length !== 2) {
    return xs;
  }
  const [first = 0, second = 0] = xs;
  const distance = Math.abs(second - first);
  if (distance >= gap) {
    return xs;
  }
  const push = (gap - distance) / 2;
  return first <= second ? [first - push, second + push] : [first + push, second - push];
}

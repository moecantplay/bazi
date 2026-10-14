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

/** Space Mono at 9.5px with the label letter-spacing: about 7px a character. */
const LABEL_CHAR_WIDTH = 7.1;

/**
 * Up and to the left of the mark, where the climbing route never is; a label
 * that would run off the left edge goes down and to the right instead, the
 * other side the route never occupies.
 */
export function labelPlacement(x: number, y: number, text: string): { x: number; y: number; anchor: "start" | "end" } {
  if (x - 24 - text.length * LABEL_CHAR_WIDTH >= 4) {
    return { x: x - 24, y: y - 12, anchor: "end" };
  }
  return { x: x + 24, y: y + 26, anchor: "start" };
}

/** A label's box: uppercase Space Mono sits about 8px above its baseline; 2px below covers the hairline under it. */
export function textBox(x: number, baseline: number, text: string, anchor: "start" | "end"): { x0: number; y0: number; x1: number; y1: number } {
  const width = text.length * LABEL_CHAR_WIDTH;
  const x0 = anchor === "end" ? x - width : x;
  return { x0, y0: baseline - 8, x1: x0 + width, y1: baseline + 2 };
}

/** The box a timed mark's label takes, wherever `labelPlacement` puts it. */
export function labelBox(x: number, y: number, text: string): { x0: number; y0: number; x1: number; y1: number } {
  const placed = labelPlacement(x, y, text);
  return textBox(placed.x, placed.y, text, placed.anchor);
}

/**
 * The NOW pill's fixed spot (M24-14): bottom right, the corner opposite
 * MORNING, its text level with MORNING's. The route runs high there and the
 * lowest a mark's label can reach is y ≈ 215, so nothing ever lands on it.
 */
export const NOW_PILL = { x: 282, y: 224, width: 88, height: 20 };

/** Whether a clock hour falls inside a two-hour block (blocks may wrap past midnight). */
export function inBlock(hour: number, start: number, end: number): boolean {
  return end > start ? hour >= start && hour < end : hour >= start || hour < end;
}

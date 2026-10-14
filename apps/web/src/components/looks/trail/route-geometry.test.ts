/**
 * M24-14: the NOW pill sits in a fixed spot that no label, MORNING or EVENING
 * can reach, wherever the day's marks fall and whatever they say.
 */

import { describe, expect, it } from "vitest";
import { hourWindowLabel } from "@daymaster/content";
import { NOW_PILL, ROUTE_HEIGHT, ROUTE_WIDTH, labelBox, routeX, routeY, textBox } from "./route-geometry";

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Clearance the pill keeps from every other piece of text. */
const MARGIN = 4;

function apart(a: Box, b: Box): boolean {
  return a.x1 + MARGIN <= b.x0 || b.x1 + MARGIN <= a.x0 || a.y1 + MARGIN <= b.y0 || b.y1 + MARGIN <= a.y0;
}

const pill: Box = { x0: NOW_PILL.x, y0: NOW_PILL.y, x1: NOW_PILL.x + NOW_PILL.width, y1: NOW_PILL.y + NOW_PILL.height };

/** Every label a timed mark can carry: each kind × each two-hour block. */
const LABELS = ["ROUGH", "EASY", "EASY · SUITS YOU", "SUITS YOU"].flatMap((kind) =>
  Array.from({ length: 12 }, (_, block) => {
    const start = (23 + block * 2) % 24;
    return `${kind} · ${hourWindowLabel(start, (start + 2) % 24).toUpperCase()}`;
  })
);

describe("the NOW pill's fixed spot", () => {
  it("sits inside the route's drawing", () => {
    expect(pill.x0).toBeGreaterThanOrEqual(0);
    expect(pill.y0).toBeGreaterThanOrEqual(0);
    expect(pill.x1).toBeLessThanOrEqual(ROUTE_WIDTH);
    expect(pill.y1).toBeLessThanOrEqual(ROUTE_HEIGHT);
  });

  it("keeps clear of every label at every mark position", () => {
    for (let step = 0; step <= 660; step += 1) {
      const x = routeX(0.2 + step / 1000);
      const y = routeY(x);
      for (const text of LABELS) {
        const box = labelBox(x, y, text);
        expect(apart(pill, box), `${text} at x ${x.toFixed(1)}`).toBe(true);
      }
    }
  });

  it("keeps clear of MORNING, EVENING and the route itself", () => {
    expect(apart(pill, textBox(20, 236, "MORNING", "start"))).toBe(true);
    expect(apart(pill, textBox(356, routeY(366) - 22, "EVENING", "end"))).toBe(true);
    for (let x = pill.x0; x <= pill.x1; x += 1) {
      expect(routeY(x) + MARGIN).toBeLessThan(pill.y0);
    }
  });
});

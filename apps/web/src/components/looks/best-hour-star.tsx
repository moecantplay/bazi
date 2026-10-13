/**
 * The reader's best hour badge (DESIGN.md §Explorer, §Instrument; M24-13): a
 * small four-point star in the hue of the hour's own element, set where the
 * rough hour carries its crossing X.
 */

import type { Element } from "@daymaster/bazi-engine";

interface Props {
  x: number;
  y: number;
  element: Element;
}

export function elementHue(element: Element): string {
  return `var(--element-${element})`;
}

export function elementFill(element: Element): string {
  return `var(--element-${element}-fill)`;
}

export function BestHourStar({ x, y, element }: Props) {
  return (
    <path
      data-best-hour-star
      d={`M${x} ${y - 6}L${x + 1.8} ${y - 1.8}L${x + 6} ${y}L${x + 1.8} ${y + 1.8}L${x} ${y + 6}L${x - 1.8} ${y + 1.8}L${x - 6} ${y}L${x - 1.8} ${y - 1.8}Z`}
      fill={elementHue(element)}
    />
  );
}

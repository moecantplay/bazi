/**
 * The day dial's clock face (DESIGN.md v5 §Instrument): 24 hours round a
 * circle with noon at the top, 6am on the left, 6pm on the right and
 * midnight at the bottom — the same left-to-right day as Explorer's route.
 */

export const DIAL_CENTRE = 170;
export const TRACK_RADIUS = 118;
export const RIM_RADIUS = 154;

/** The twelve two-hour blocks from 11pm, as the almanac counts the day; block i is centred on hour 2i. */
export const HOUR_ANIMALS = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"];

/** Angle in radians for an hour of the day (0–24). */
export function angleOf(hour: number): number {
  return ((hour - 12) / 24) * Math.PI * 2 - Math.PI / 2;
}

export function polar(hour: number, radius: number): [number, number] {
  return [DIAL_CENTRE + Math.cos(angleOf(hour)) * radius, DIAL_CENTRE + Math.sin(angleOf(hour)) * radius];
}

/** Clockwise arc from one hour to another, wrapping past midnight. */
export function arcPath(fromHour: number, toHour: number, radius: number): string {
  const [x1, y1] = polar(fromHour, radius);
  const [x2, y2] = polar(toHour, radius);
  const span = (toHour - fromHour + 24) % 24;
  return `M${x1.toFixed(2)},${y1.toFixed(2)}A${radius},${radius} 0 ${span > 12 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

/** Index into HOUR_ANIMALS of the block a clock hour falls in (23:00–00:59 is the rat). */
export function blockOfHour(hour: number): number {
  return Math.floor(((Math.floor(hour) + 1) % 24) / 2);
}

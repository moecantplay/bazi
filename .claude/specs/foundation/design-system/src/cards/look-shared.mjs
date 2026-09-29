/**
 * Pieces every look card shares: the base type ladder as the three looks use
 * it (DESIGN.md §Base · Type) and small SVG string helpers. The example day is
 * the approved M19.9-01 mockup day — Fixture A, Tue 29 Sep 2026, a yang-fire
 * horse day, now 10:40 — so the cards and the mockups can be compared 1:1.
 */

export const LOOK_BASE = `
  .pad { padding: 0 20px; display: flex; flex-direction: column; gap: 20px; }
  .mono { font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; }
  .mut { color: var(--mut); }
  .hl { margin: 0; font-family: "Bricolage", "Figtree", sans-serif; font-size: 35px; line-height: 1.07; font-weight: 800; letter-spacing: -.022em; text-wrap: balance; color: var(--ink); }
  .hl em { font-family: ui-serif, "New York", Georgia, serif; font-style: italic; font-weight: 500; letter-spacing: -.01em; }
  .lead { margin: 0; font-size: 16px; line-height: 1.6; color: var(--ink); max-width: 34ch; }
  .cite { font-family: "SpaceMono", ui-monospace, monospace; font-size: 11px; letter-spacing: .02em; color: var(--mut); }
  svg text { font-family: "SpaceMono", ui-monospace, monospace; font-weight: 700; }
`;

export const HEADLINE = 'Something has to move today; <em>better if you choose</em> which.';

export const LEAD =
  'The horse runs straight at the rat in your career palace. Two schedules are booked for the same hour. ' +
  'Something has to move, and you get to pick which.';

/** An animal from the sprite, centred on (x, y) at `size` px. */
export function animal(name, x, y, size, fill) {
  const scale = size / 24;
  return `<use href="#an-${name}" fill="${fill}" transform="translate(${x - size / 2} ${y - size / 2}) scale(${scale})"/>`;
}

/** An SVG mono label. */
export function label(text, x, y, { size = 9, fill = 'var(--mut)', anchor = 'start', spacing = 1.4 } = {}) {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${text}</text>`;
}

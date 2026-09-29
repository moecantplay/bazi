/**
 * Editorial (stored id `almanac`) — Look B, "Almanac page" (M19.9-01).
 * Each day is a printed page: day-of-year number, the day's animal at poster
 * scale on a grained field, and the headline set big. Almost no chrome.
 */

import { HEADLINE, LOOK_BASE } from './look-shared.mjs';

/** Film grain for the poster field, as a tiling data-URI texture. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0'/></filter>" +
  "<rect width='160' height='160' filter='url(%23n)'/></svg>\")";

/** The field takes the day element's fill hue; here the terrain stands in for the day. */
const FIELD_BY_TERRAIN = [
  ['wood', 'wd-f'],
  ['fire', 'fr-f'],
  ['earth', 'er-f'],
  ['metal', 'mt-f'],
  ['water', 'wt-f'],
]
  .map(([terrain, hue]) => `:root[data-terrain="${terrain}"] .field { --field: var(--${hue}); }`)
  .join('\n  ');

const posterField = {
  slug: 'poster-field',
  name: 'Poster field',
  group: 'Editorial',
  subtitle: 'Day number and the day’s animal at poster scale',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 440,
  note:
    'Editorial’s signature object. The field is the day element’s fill hue (never cinnabar; the seal keeps ' +
    'that), the animal is ink, and the grain is texture only: no text depends on it. Arrival: field fades in, ' +
    'the animal drifts in from the right.',
  css: `${LOOK_BASE}
  .field { --field: var(--fr-f); position: relative; margin: 0 16px; padding: 22px; background: var(--field); border-radius: 34px; overflow: hidden; height: 380px; display: flex; flex-direction: column; justify-content: space-between; }
  ${FIELD_BY_TERRAIN}
  .field::after { content: ""; position: absolute; inset: 0; background-image: ${GRAIN}; opacity: .22; mix-blend-mode: multiply; pointer-events: none; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .field::after { mix-blend-mode: overlay; opacity: .35; } }
  :root[data-theme="dark"] .field::after { mix-blend-mode: overlay; opacity: .35; }
  .mast { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: baseline; color: var(--ink); }
  .num { font-family: "Bricolage", "Figtree", sans-serif; font-size: 64px; line-height: .9; font-weight: 800; letter-spacing: -.04em; }
  .mast .mono { text-align: right; line-height: 1.7; }
  .horse { position: absolute; right: -54px; bottom: -18px; width: 360px; height: 360px; transform: scaleX(-1); }
  .foot { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; color: var(--ink); }
  `,
  markup: `
  <div class="field">
    <div class="mast"><span class="num">272</span><span class="mono">Tuesday<br>29 September</span></div>
    <svg class="horse" viewBox="0 0 24 24" aria-hidden="true"><use href="#an-horse" fill="var(--ink)"/></svg>
    <div class="foot"><span class="mono">Day 272 of the year</span><span class="mono">Yang fire · horse day</span></div>
  </div>`,
};

const pageChapters = {
  slug: 'page-and-chapters',
  name: 'Page headline & chapters',
  group: 'Editorial',
  subtitle: 'A big headline, one sentence, then the rest of the day as chapters',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 640,
  note: 'Chapters are a flat segment stack (base rule), not cards. The dashed rule is the look’s one divider.',
  css: `${LOOK_BASE}
  .hl { font-size: 42px; line-height: 1.02; }
  .rule { display: flex; gap: 8px; align-items: center; color: var(--mut); }
  .rule i { flex: 1; border-top: 2px dashed var(--line); }
  .stack { display: flex; flex-direction: column; gap: 2px; }
  .row { background: var(--card); padding: 15px 18px; min-height: 64px; display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; align-items: center; }
  .row:first-child { border-radius: 20px 20px 6px 6px; }
  .row:last-child { border-radius: 6px 6px 20px 20px; }
  .row .mono { color: var(--mut); }
  .row b { font-family: "Bricolage", "Figtree", sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -.01em; color: var(--ink); grid-column: 1; }
  .row .chev { grid-column: 2; grid-row: 1 / span 2; color: var(--mut); font-size: 20px; }
  `,
  markup: `
  <div class="pad" style="padding-top:8px">
    <h1 class="hl">${HEADLINE}</h1>
    <p class="lead">The horse runs straight at the rat in your career palace. Two schedules, one hour. You get to pick what gives.</p>
    <div class="rule mono"><span>The rest of the day</span><i></i></div>
    <div class="stack">
      <div class="row"><span class="mono">Roots</span><b>Support gathers at home</b><span class="chev">›</span></div>
      <div class="row"><span class="mono">The hours</span><b>Easy 1–3 pm, rough near midnight</b><span class="chev">›</span></div>
      <div class="row"><span class="mono">What the day suits</span><b>Clear trail and take it slow</b><span class="chev">›</span></div>
    </div>
    <span class="cite">Now · snake hour, 9–11 am</span>
  </div>`,
};

export const EDITORIAL_CARDS = [posterField, pageChapters];

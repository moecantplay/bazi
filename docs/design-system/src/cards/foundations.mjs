/**
 * Foundation cards — the parts of Trail that survive whatever happens to the
 * Today screen. If the direction loses, these four are the salvage.
 */

import { TERRAINS, TERRAIN_GROUND, HUES, SHAPE } from '../tokens.mjs';
import { report, AA_BODY, AA_LARGE } from '../contrast.mjs';

/**
 * A ratio readout that shows both themes at once, since only one is on screen.
 * `threshold` of null means informational — the hairline is a decorative
 * divider, not text and not a meaningful graphic, so WCAG 1.4.11 does not
 * apply to it and holding it to 3:1 only manufactured noise.
 */
function ratioCell(label, pairFor, threshold) {
  const light = report(...pairFor('light'));
  const dark = report(...pairFor('dark'));
  const bad = (value) => (threshold !== null && value < threshold ? ' ds-fail' : '');
  return `<div class="fx-row">
    <span class="fx-name">${label}</span>
    <span class="fx-val${bad(light)}">${light.toFixed(2)}</span>
    <span class="fx-val${bad(dark)}">${dark.toFixed(2)}</span>
  </div>`;
}

const PALETTE_CSS = `
  .terr { margin: 0 20px 10px; border-radius: var(--radius-card); overflow: hidden; box-shadow: var(--sh-card); background: var(--bg); }
  .terr .head { display: flex; align-items: baseline; gap: 8px; padding: 14px 16px 10px; }
  .terr .head b { font-family: "SpaceMono", ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--ink); }
  .terr .head span { font-size: 11.5px; color: var(--mut); }
  .chips { display: flex; gap: 6px; padding: 0 16px 14px; flex-wrap: wrap; }
  .chip { border-radius: 10px; overflow: hidden; width: 62px; }
  .chip .sw { height: 34px; border: 1px solid var(--line); border-radius: 8px; }
  .chip .nm { font-family: "SpaceMono", ui-monospace, monospace; font-size: 8px; letter-spacing: .06em; color: var(--mut); padding-top: 4px; display: block; text-transform: uppercase; }
  .anchor { margin: 0 16px 14px; background: var(--blk); color: var(--pale); border-radius: 12px; padding: 11px 13px; font-size: 12.5px; font-weight: 600; }
  .fx { margin: 0 16px 16px; }
  .fx-head { display: flex; font-family: "SpaceMono", ui-monospace, monospace; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); padding-bottom: 5px; border-bottom: 1px solid var(--line); }
  .fx-head .fx-name { flex: 1; }
  .fx-head span:not(.fx-name), .fx-val { width: 52px; text-align: right; }
  .fx-row { display: flex; align-items: center; padding: 5px 0; font-size: 11.5px; color: var(--ink); border-bottom: 1px solid color-mix(in srgb, var(--line) 45%, transparent); }
  .fx-row .fx-name { flex: 1; color: var(--mut); }
  .fx-val { font-family: "SpaceMono", ui-monospace, monospace; font-size: 11px; font-weight: 700; }
  /* The failure marker itself has to survive both grounds — a fixed red sank
     into the dark terrains. --fr is already tuned per theme. */
  .ds-fail { color: var(--fr); }
  .ds-fail::after { content: " ✕"; }
`;

function terrainBlock({ key, label, terrain }) {
  const g = (theme) => TERRAIN_GROUND[key][theme];
  const swatches = ['bg', 'card', 'ink', 'mut', 'blk']
    .map(
      (token) =>
        `<div class="chip"><div class="sw" style="background: var(--${token})"></div><span class="nm">${token}</span></div>`,
    )
    .join('');

  return `
  <section class="terr" data-terrain="${key}">
    <div class="head"><b>${label}</b><span>${terrain}</span></div>
    <div class="chips">${swatches}</div>
    <div class="anchor">Anchor mass — inverts in dark so it stays boldest, not darkest.</div>
    <div class="fx">
      <div class="fx-head"><span class="fx-name">Rendered pair</span><span>Light</span><span>Dark</span></div>
      ${ratioCell('ink on ground', (t) => [g(t).ink, g(t).bg], AA_BODY)}
      ${ratioCell('muted on ground', (t) => [g(t).mut, g(t).bg], AA_BODY)}
      ${ratioCell('ink on card', (t) => [g(t).ink, g(t).card], AA_BODY)}
      ${ratioCell('muted on card', (t) => [g(t).mut, g(t).card], AA_BODY)}
      ${ratioCell('anchor text', (t) => [g(t).pale, g(t).blk], AA_BODY)}
      ${ratioCell('hairline on ground (info)', (t) => [g(t).line, g(t).bg], null)}
      ${ratioCell('card lift off ground (info)', (t) => [g(t).card, g(t).bg], null)}
    </div>
  </section>`;
}

const terrainPalettes = {
  slug: 'terrain-palettes',
  name: 'Terrain palettes',
  group: 'Foundations',
  subtitle: 'Five grounds × light and dark, with measured ratios',
  fonts: ['figtree', 'spacemono'],
  height: 2600,
  note:
    'The ground is keyed to the day pillar\'s element — only paper and ink change. ' +
    'Data and signage hues never move, so a colour never changes meaning as the day rolls over. ' +
    'Ratios are computed on rendered pairs, not token maths. Two rows are informational: ' +
    'hairlines and card lift are decorative separation, not text. Watch the card-lift number — ' +
    'Trail separates cards by fill rather than shadow, and in dark that margin is thin.',
  css: PALETTE_CSS,
  markup: TERRAINS.map(terrainBlock).join('\n'),
};

const TYPE_CSS = `
  .ty { margin: 0 20px 22px; }
  .ty .spec { font-family: "SpaceMono", ui-monospace, monospace; font-size: 8.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--mut); display: block; margin-bottom: 8px; }
  .ty-display { font-family: "Bricolage", "Figtree", sans-serif; font-size: 35px; line-height: 1.07; font-weight: 800; letter-spacing: -.022em; margin: 0; text-wrap: balance; color: var(--ink); }
  .ty-display em { font-family: ui-serif, "New York", Georgia, serif; font-style: italic; font-weight: 500; letter-spacing: -.005em; }
  .ty-section { font-family: "Bricolage", "Figtree", sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -.012em; margin: 0; color: var(--ink); }
  .ty-body { font-size: 14px; line-height: 1.62; margin: 0; color: var(--ink); }
  .ty-kicker { font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; color: var(--mut); display: flex; align-items: center; gap: 9px; margin: 0; }
  .ty-kicker::before { content: ""; width: 16px; height: 2px; background: var(--mut); flex: none; }
  .ty-cite { font-family: "SpaceMono", ui-monospace, monospace; font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); margin: 0; }
  .ty-input { font-size: 16px; color: var(--ink); margin: 0; }
`;

const typeLadder = {
  slug: 'type-ladder',
  name: 'Type ladder',
  group: 'Foundations',
  subtitle: 'Bricolage display · serif italic · Space Mono labels · Figtree body',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 1150,
  note:
    'Three families doing three jobs: Bricolage carries display, Space Mono carries every label ' +
    'and citation (it is what makes the screen read as a map), Figtree carries prose. ' +
    'The serif italic is an accent inside display only — never a fourth register.',
  css: TYPE_CSS,
  markup: `
  <div class="ty">
    <span class="spec">Display · Bricolage 800 · 35px / 1.07 / −.022em</span>
    <p class="ty-display">A day that rewards <em>going slowly</em> over going first</p>
  </div>
  <div class="ty">
    <span class="spec">Section · Bricolage 800 · 19px / −.012em</span>
    <p class="ty-section">Where the trail crosses</p>
  </div>
  <div class="ty">
    <span class="spec">Kicker · Space Mono 700 · 10px / .17em / uppercase</span>
    <p class="ty-kicker">Today's terrain</p>
  </div>
  <div class="ty">
    <span class="spec">Body · Figtree 400 · 14px / 1.62</span>
    <p class="ty-body">The dog in today's ground runs crosswise to the dragon you were born under. Not a wall — a crossing, and crossings are worth slowing for.</p>
  </div>
  <div class="ty">
    <span class="spec">Citation · Space Mono 700 · 9px / .1em / uppercase</span>
    <p class="ty-cite">Day branch 戌 · your year branch 辰</p>
  </div>
  <div class="ty">
    <span class="spec">Input · Figtree 400 · 16px — the iOS-zoom exception, unchanged since M15</span>
    <p class="ty-input">15 March 1994</p>
  </div>`,
};

const SHAPE_CSS = `
  .sh { margin: 0 20px 10px; display: flex; align-items: center; gap: 14px; }
  .sh .box { width: 78px; height: 58px; background: var(--card); box-shadow: var(--sh-card); flex: none; }
  .sh .meta { font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: .1em; color: var(--mut); text-transform: uppercase; }
  .sh .meta b { display: block; color: var(--ink); font-size: 11px; margin-bottom: 3px; }
  .rail { margin: 20px 0 0 32px; border-left: var(--rail-width) dashed var(--line); padding: 2px 0 2px 28px; }
  .rail .wp { position: relative; padding: 12px 0; }
  .rail .node { position: absolute; left: -47px; top: 10px; width: var(--node-size); height: var(--node-size); border-radius: var(--radius-pill); background: var(--card); box-shadow: var(--sh-node); display: grid; place-items: center; }
  .rail .node i { width: 12px; height: 12px; border-radius: 999px; background: var(--wd); display: block; }
  .rail p { margin: 0; font-size: 13px; color: var(--ink); line-height: 1.55; }
  .elev { margin: 0 20px; display: flex; gap: 6px; align-items: flex-end; height: 60px; }
  .elev i { flex: 1; background: var(--wd-f); border-radius: 4px 4px 0 0; display: block; }
`;

const shapeScale = {
  slug: 'shape-and-rail',
  name: 'Shape, elevation & the rail',
  group: 'Foundations',
  subtitle: 'Radius scale, shadows, and the dashed trail motif',
  fonts: ['figtree', 'spacemono'],
  height: 980,
  note:
    'The dashed rail is the signature: it is what makes a scroll read as a route. ' +
    'Dark elevates by fill rather than shadow (M15 rule, still binding) — flip the theme and ' +
    'watch the shadows recede while the card fill does the separating.',
  css: SHAPE_CSS,
  markup: `
  ${[
    ['radius-hero', 'Hero / map', SHAPE['radius-hero']],
    ['radius-card', 'Card', SHAPE['radius-card']],
    ['radius-tile', 'Tile / sign', SHAPE['radius-tile']],
    ['radius-sheet', 'Sheet', SHAPE['radius-sheet']],
    ['radius-field', 'Field', SHAPE['radius-field']],
    ['radius-pill', 'Pill', SHAPE['radius-pill']],
  ]
    .map(
      ([token, label, value]) => `
  <div class="sh">
    <div class="box" style="border-radius: var(--${token})"></div>
    <div class="meta"><b>${label}</b>${value}</div>
  </div>`,
    )
    .join('')}
  <p class="ds-variant">Waypoint rail</p>
  <div class="rail">
    <div class="wp"><span class="node"><i></i></span><p>A waypoint hangs off the rail. The page itself is the trail.</p></div>
    <div class="wp"><span class="node"><i style="background: var(--am)"></i></span><p>Signage colour marks the crossing, not the ground.</p></div>
  </div>
  <p class="ds-variant">Elevation profile</p>
  <div class="elev">
    <i style="height: 40%"></i><i style="height: 62%"></i><i style="height: 55%"></i>
    <i style="height: 88%; background: var(--wd)"></i><i style="height: 47%"></i>
    <i style="height: 34%"></i><i style="height: 58%"></i>
  </div>`,
};

const HUE_CSS = `
  .hue { margin: 0 20px 8px; background: var(--card); border-radius: var(--radius-tile); padding: 13px 15px; box-shadow: var(--sh-card); }
  .hue .top { display: flex; align-items: center; gap: 10px; }
  .hue .dot { width: 26px; height: 26px; border-radius: 999px; flex: none; }
  .hue .nm { font-family: "SpaceMono", ui-monospace, monospace; font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; flex: 1; }
  .hue .fill { border-radius: 999px; padding: 4px 12px; font-size: 10px; font-weight: 800; font-family: "SpaceMono", ui-monospace, monospace; letter-spacing: .08em; }
  .hue .nums { display: flex; gap: 16px; margin-top: 9px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; color: var(--mut); }
  .hue .nums b { color: var(--ink); }
`;

function hueBlock(token, label, role) {
  const on = (theme) => report(HUES[theme][token], TERRAIN_GROUND.wood[theme].card);
  return `
  <div class="hue">
    <div class="top">
      <span class="dot" style="background: var(--${token})"></span>
      <span class="nm" style="color: var(--${token})">${label}</span>
      <span class="fill" style="background: var(--${token}-f); color: var(--${token})">${role}</span>
    </div>
    <div class="nums">
      <span>light <b>${on('light').toFixed(2)}</b></span>
      <span>dark <b>${on('dark').toFixed(2)}</b></span>
      <span>on card</span>
    </div>
  </div>`;
}

const hues = {
  slug: 'element-and-signage-hues',
  name: 'Element & signage hues',
  group: 'Foundations',
  subtitle: 'Five elements plus amber signage — fixed across all terrains',
  fonts: ['figtree', 'spacemono'],
  height: 900,
  note:
    'These do not change with the terrain. Amber is signage, not an element: it means ' +
    '"a crossing worth slowing for", and it is the only hue allowed to carry a warning. ' +
    'Cinnabar is absent by design — it stays reserved for the seal.',
  css: HUE_CSS,
  markup: [
    hueBlock('wd', 'Wood', 'growth'),
    hueBlock('fr', 'Fire', 'heat'),
    hueBlock('er', 'Earth', 'ground'),
    hueBlock('mt', 'Metal', 'edge'),
    hueBlock('wt', 'Water', 'depth'),
    hueBlock('am', 'Amber', 'signage'),
  ].join('\n'),
};

export const FOUNDATION_CARDS = [terrainPalettes, typeLadder, shapeScale, hues];

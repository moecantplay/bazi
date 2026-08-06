/**
 * Trail design tokens — single source of truth.
 *
 * Values are transcribed from the `.v6` rules in
 * docs/mockups-m18/today-three-treatments.html (round 5c, post-contrast-fix).
 * Do not hand-edit the generated CSS; edit here and re-run build.mjs.
 *
 * Two axes, deliberately independent (owner decision 2026-07-29, round 5b):
 *   - GROUND is keyed to the day pillar's element — 5 terrains, per theme.
 *     Only the paper and the ink change.
 *   - DATA + SIGNAGE hues are keyed to theme ONLY, never to terrain, so a
 *     colour never changes meaning as the day rolls over.
 */

/** Ground: paper, ink, the anchor mass, and the hairline. Per terrain, per theme. */
export const TERRAIN_GROUND = {
  wood: {
    light: { bg: '#F0EEE2', ink: '#232819', blk: '#181C10', mut: '#686C55', card: '#FAF9EF', line: 'rgba(78,82,55,.32)', pale: '#F0EEE2' },
    dark:  { bg: '#161911', ink: '#EAEADC', blk: '#EAEADC', mut: '#9A9D85', card: '#20241A', line: 'rgba(214,216,186,.26)', pale: '#161911' },
  },
  fire: {
    light: { bg: '#F6EBDC', ink: '#2C2118', blk: '#1D140C', mut: '#786655', card: '#FDF6EA', line: 'rgba(104,74,48,.30)', pale: '#F6EBDC' },
    dark:  { bg: '#1B1410', ink: '#F0E5DA', blk: '#F0E5DA', mut: '#A89283', card: '#271F18', line: 'rgba(230,206,186,.22)', pale: '#1B1410' },
  },
  earth: {
    light: { bg: '#F2ECD4', ink: '#2A2415', blk: '#1D180B', mut: '#72684D', card: '#FBF7E6', line: 'rgba(100,86,44,.30)', pale: '#F2ECD4' },
    dark:  { bg: '#191610', ink: '#EDE6D3', blk: '#EDE6D3', mut: '#A59A76', card: '#241F15', line: 'rgba(224,212,176,.22)', pale: '#191610' },
  },
  metal: {
    light: { bg: '#EEEFED', ink: '#24262B', blk: '#14161A', mut: '#676B72', card: '#F9FAFA', line: 'rgba(74,78,88,.26)', pale: '#EEEFED' },
    dark:  { bg: '#15171A', ink: '#E7EAED', blk: '#E7EAED', mut: '#949BA6', card: '#1F2226', line: 'rgba(204,210,220,.20)', pale: '#15171A' },
  },
  water: {
    light: { bg: '#E5EDF3', ink: '#1F2830', blk: '#101820', mut: '#5D6B75', card: '#F4F9FC', line: 'rgba(54,76,92,.28)', pale: '#E5EDF3' },
    dark:  { bg: '#121820', ink: '#E1EAF1', blk: '#E1EAF1', mut: '#8A9BA8', card: '#1B232C', line: 'rgba(190,212,228,.20)', pale: '#121820' },
  },
};

/**
 * Data + signage hues. Theme-keyed only — identical across all five terrains.
 * `-f` is the fill/tint partner for the hue of the same name.
 * `am` (amber) is signage, not an element: it marks "watch / take care".
 */
export const HUES = {
  light: {
    wd: '#46672F', 'wd-f': '#D5E1BE',
    fr: '#9A4323', 'fr-f': '#F5D2BF',
    er: '#785D1F', 'er-f': '#EDDFAC',
    mt: '#626458', 'mt-f': '#E5E3D3',
    wt: '#3A607C', 'wt-f': '#CBDBE7',
    am: '#835D13', 'am-f': '#F1E2BB',
  },
  dark: {
    wd: '#ADCB96', 'wd-f': '#2A3820',
    fr: '#EFA47C', 'fr-f': '#412718',
    er: '#DCC077', 'er-f': '#3A3017',
    mt: '#B7B5A6', 'mt-f': '#2B2B22',
    wt: '#A0BFD7', 'wt-f': '#1F2F3B',
    am: '#DDB35E', 'am-f': '#392D13',
  },
};

/** Terrain order for swatch rendering, and the element each one belongs to. */
export const TERRAINS = [
  { key: 'wood',  label: 'Wood',  terrain: 'forest',   hue: 'wd' },
  { key: 'fire',  label: 'Fire',  terrain: 'canyon',   hue: 'fr' },
  { key: 'earth', label: 'Earth', terrain: 'dune',     hue: 'er' },
  { key: 'metal', label: 'Metal', terrain: 'granite',  hue: 'mt' },
  { key: 'water', label: 'Water', terrain: 'nautical', hue: 'wt' },
];

/** Theme-independent scales. */
export const SHAPE = {
  'radius-hero': '24px',
  'radius-card': '20px',
  'radius-tile': '18px',
  'radius-sheet': '28px',
  'radius-field': '14px',
  'radius-pill': '999px',
  'rail-width': '2px',
  'node-size': '36px',
  'tap-min': '44px',
};

export const SHADOW = {
  light: {
    'sh-hero': '0 2px 8px rgba(48,50,28,.07), 0 12px 30px rgba(48,50,28,.09)',
    'sh-card': '0 1px 4px rgba(48,50,28,.06)',
    'sh-node': '0 1px 4px rgba(48,50,28,.15)',
    'sh-nav':  '0 8px 26px rgba(24,28,16,.3)',
  },
  // Dark elevates by fill, not by shadow (M15 decision, still binding).
  dark: {
    'sh-hero': '0 2px 10px rgba(0,0,0,.34)',
    'sh-card': '0 1px 4px rgba(0,0,0,.28)',
    'sh-node': '0 1px 4px rgba(0,0,0,.4)',
    'sh-nav':  '0 8px 26px rgba(0,0,0,.46)',
  },
};

/** Emit `--key: value;` declarations for one theme+terrain combination. */
function declarations(terrainKey, theme) {
  const ground = TERRAIN_GROUND[terrainKey][theme];
  const parts = Object.entries({ ...ground, ...HUES[theme], ...SHADOW[theme] });
  return parts.map(([k, v]) => `--${k}: ${v};`).join(' ');
}

/**
 * Generate the full token stylesheet.
 *
 * Every theme rule is emitted THREE times on purpose — once under the OS media
 * query and once under each of `[data-theme="light"]` / `[data-theme="dark"]`.
 * Round 5c found rules that existed only in the media query, which the app's
 * own appearance toggle could never reach. Generating all twins from one data
 * source is what stops that from recurring.
 */
export function buildTokenCss() {
  const shape = Object.entries(SHAPE).map(([k, v]) => `  --${k}: ${v};`).join('\n');
  const lines = [
    '/* GENERATED by build.mjs from tokens.mjs — do not edit by hand. */',
    '',
    ':root {',
    shape,
    '}',
    '',
    '/* --- Default ground: wood, light. Every terrain overrides it below. --- */',
    `:root, [data-terrain] { ${declarations('wood', 'light')} }`,
    '',
  ];

  // The terrain attribute sits on :root (so body and page chrome resolve the
  // tokens) but the palette card also pins one block per terrain in the page
  // body. Both selectors have to be written for every rule, on the same element
  // and as a descendant, or one of the two placements silently keeps wood.
  const scoped = (theme, key) =>
    [
      `:root[data-theme="${theme}"][data-terrain="${key}"]`,
      `:root[data-theme="${theme}"] [data-terrain="${key}"]`,
    ].join(',\n');

  for (const theme of ['light', 'dark']) {
    const rules = TERRAINS.map(
      ({ key }) => `  [data-terrain="${key}"] { ${declarations(key, theme)} }`,
    ).join('\n');

    lines.push(`@media (prefers-color-scheme: ${theme}) {`, rules, '}', '');

    // The [data-theme] twin — this is the one the appearance toggle reaches.
    lines.push(
      TERRAINS.map(
        ({ key }) => `${scoped(theme, key)} { ${declarations(key, theme)} }`,
      ).join('\n'),
      '',
    );
  }

  lines.push(
    'body { background: var(--bg); color: var(--ink); }',
    '',
  );
  return lines.join('\n');
}

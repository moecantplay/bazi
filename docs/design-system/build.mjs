/**
 * Builds the Trail design-system bundle into dist/ as self-contained preview
 * cards, one HTML file per component.
 *
 * Self-contained is a constraint, not a preference: the cards render inside the
 * Claude Design pane, so nothing may depend on a sibling file or an external
 * host. Fonts are inlined per card, and only the faces that card actually uses
 * — Bricolage alone is 100 KB, so body-only cards skip it.
 *
 * Usage: node docs/design-system/build.mjs
 */

import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTokenCss, TERRAINS, TERRAIN_GROUND } from './src/tokens.mjs';
import { HARNESS_CSS, HARNESS_JS, harnessMarkup } from './src/harness.mjs';
import { FOUNDATION_CARDS } from './src/cards/foundations.mjs';
import { TRAIL_CARDS } from './src/cards/trail.mjs';
import { APP_CARDS } from './src/cards/app.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, 'dist');

const GROUP_DIRS = {
  Foundations: 'foundations',
  Trail: 'trail',
  Components: 'components',
};

async function loadFonts() {
  const names = ['figtree', 'bricolage', 'spacemono'];
  const entries = await Promise.all(
    names.map(async (n) => [n, await readFile(join(HERE, 'src/fonts', `${n}.css`), 'utf8')]),
  );
  return Object.fromEntries(entries);
}

/** Terrain swatch data for the harness bar. */
const terrainChips = TERRAINS.map((t) => ({
  ...t,
  lightBg: TERRAIN_GROUND[t.key].light.bg,
}));

function renderCard(card, fonts, tokenCss, sprite) {
  const faces = card.fonts.map((f) => fonts[f]).join('\n');
  const note = card.note ? `<p class="ds-note">${card.note}</p>` : '';
  const dsCard = [
    `group="${card.group}"`,
    `name="${card.name}"`,
    card.subtitle ? `subtitle="${card.subtitle}"` : '',
    `width="390"`,
    `height="${card.height ?? 720}"`,
  ]
    .filter(Boolean)
    .join(' ');

  return `<!-- @dsCard ${dsCard} -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${card.name} — Daymaster Trail</title>
<script>document.documentElement.setAttribute("data-terrain", "wood");</script>
<style>
${faces}
${tokenCss}
${HARNESS_CSS}
${card.css}
</style>
${sprite}
${harnessMarkup(terrainChips)}
<div class="ds-stage">
  <div class="ds-frame">
    ${note}
    ${card.markup}
  </div>
</div>
<script>${HARNESS_JS}</script>
`;
}

async function main() {
  const fonts = await loadFonts();
  const tokenCss = buildTokenCss();
  // Element, orbit-mark and zodiac symbols, lifted verbatim from the mockup so
  // the cards show the shipped artwork rather than a redraw.
  const sprite = await readFile(join(HERE, 'src/sprite.html'), 'utf8');

  await rm(DIST, { recursive: true, force: true });

  const cards = [...FOUNDATION_CARDS, ...TRAIL_CARDS, ...APP_CARDS];
  const manifest = [];

  for (const card of cards) {
    const dir = GROUP_DIRS[card.group];
    if (!dir) throw new Error(`Card "${card.name}" has unknown group "${card.group}"`);

    const path = join(dir, `${card.slug}.html`);
    const absolute = join(DIST, path);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, renderCard(card, fonts, tokenCss, sprite), 'utf8');

    const bytes = Buffer.byteLength(await readFile(absolute, 'utf8'));
    if (bytes > 250 * 1024) {
      throw new Error(`${path} is ${(bytes / 1024).toFixed(0)} KB — over the 256 KB per-file cap`);
    }
    manifest.push({ path, group: card.group, name: card.name, kb: +(bytes / 1024).toFixed(0) });
  }

  await writeFile(join(DIST, 'index.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const total = manifest.reduce((sum, m) => sum + m.kb, 0);
  for (const m of manifest) {
    console.log(`  ${String(m.kb).padStart(4)} KB  ${m.group.padEnd(12)} ${m.path}`);
  }
  console.log(`\n${manifest.length} cards, ${(total / 1024).toFixed(1)} MB total`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

/**
 * Gate for the Trail bundle. Two checks, both of which exist because round 5c
 * found real bugs that eyeballing had missed:
 *
 *   1. CONTRAST on *rendered* text — every visible text node, measured against
 *      the background actually painted behind it, across both themes and all
 *      five terrains. Token-pair maths is not enough; light mode has been the
 *      failing side every single time.
 *   2. THEME PARITY — a forced [data-theme] must resolve identically to the
 *      matching OS scheme, or the app's own appearance toggle is lying.
 *
 * Usage: node docs/design-system/check.mjs [--shots]
 */

import { readFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, 'dist');
const SHOTS = join(HERE, 'shots');
const TERRAINS = ['wood', 'fire', 'earth', 'metal', 'water'];

const require = createRequire(import.meta.url);
const { chromium } = require(
  join(HERE, '../../node_modules/.pnpm/playwright@1.61.1/node_modules/playwright'),
);

/** Runs in the page. Returns every visible text run with its measured ratio. */
const MEASURE = () => {
  const parse = (c) => {
    if (!c || c === 'transparent' || c === 'none') return null;
    const m = c.match(/[\d.]+(?:e-?\d+)?/g);
    if (!m) return null;
    // color-mix() computes to `color(srgb 0.70 0.70 0.63 / 0.5)` — 0-1 floats,
    // not 0-255 channels. Reading those as bytes makes every mixed colour look
    // near-black, which is exactly how this checker first "found" 400 failures
    // that did not exist.
    const isPredefined = /^color\(/.test(c.trim());
    const scale = isPredefined ? 255 : 1;
    const nums = isPredefined ? m.slice(0) : m;
    return {
      r: +nums[0] * scale,
      g: +nums[1] * scale,
      b: +nums[2] * scale,
      a: nums.length > 3 ? +nums[3] : 1,
    };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const over = (top, bottom) =>
    top.a >= 1
      ? top
      : {
          r: top.r * top.a + bottom.r * (1 - top.a),
          g: top.g * top.a + bottom.g * (1 - top.a),
          b: top.b * top.a + bottom.b * (1 - top.a),
          a: 1,
        };

  /** Composite every ancestor background down to the page, bottom-up. */
  const backdrop = (el) => {
    const layers = [];
    for (let node = el; node; node = node.parentElement) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) layers.push(bg);
      if (bg && bg.a >= 1) break;
    }
    let base = layers.pop() || { r: 255, g: 255, b: 255, a: 1 };
    while (layers.length) base = over(layers.pop(), base);
    return base;
  };

  const results = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (el.closest('.ds-bar, .ds-note, .ds-variant')) return; // harness chrome, not the design
    const direct = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(' ');
    if (!direct) return;

    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || +style.opacity === 0) return;
    const box = el.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;

    const fg = parse(style.color);
    const bg = backdrop(el);
    if (!fg) return;
    const flat = over(fg, bg);
    const [hi, lo] = [lum(flat), lum(bg)].sort((a, b) => b - a);
    const ratio = (hi + 0.05) / (lo + 0.05);

    const size = parseFloat(style.fontSize);
    const weight = +style.fontWeight || 400;
    const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);

    results.push({
      text: direct.slice(0, 46),
      tag: el.tagName.toLowerCase(),
      cls: el.className && typeof el.className === 'string' ? el.className.slice(0, 28) : '',
      size,
      weight,
      isLarge,
      ratio: Math.floor(ratio * 100) / 100,
      required: isLarge ? 3 : 4.5,
    });
  });
  return results;
};

/** Snapshot every element's paint-relevant styles, for the parity diff. */
const FINGERPRINT = () =>
  Array.from(document.querySelectorAll('body *')).map((el) => {
    const s = getComputedStyle(el);
    return [s.color, s.backgroundColor, s.borderColor, s.outlineColor, s.boxShadow, s.fill, s.stroke].join('|');
  });

async function main() {
  const wantShots = process.argv.includes('--shots');
  const browser = await chromium.launch();
  const failures = [];
  const parityBreaks = [];
  let measured = 0;

  const groups = await readdir(DIST, { withFileTypes: true });
  const files = [];
  for (const g of groups) {
    if (!g.isDirectory()) continue;
    for (const f of await readdir(join(DIST, g.name))) {
      if (f.endsWith('.html')) files.push(join(g.name, f));
    }
  }

  for (const rel of files) {
    const url = pathToFileURL(join(DIST, rel)).href;

    for (const scheme of ['light', 'dark']) {
      const context = await browser.newContext({
        colorScheme: scheme,
        viewport: { width: 430, height: 900 },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);

      // Parity: OS scheme with no override vs the same scheme forced.
      const osPrint = await page.evaluate(FINGERPRINT);
      await page.evaluate((s) => document.documentElement.setAttribute('data-theme', s), scheme);
      const forcedPrint = await page.evaluate(FINGERPRINT);
      if (osPrint.join('\n') !== forcedPrint.join('\n')) {
        const first = osPrint.findIndex((v, i) => v !== forcedPrint[i]);
        parityBreaks.push(`${rel} [${scheme}] element #${first}`);
      }

      for (const terrain of TERRAINS) {
        await page.evaluate((t) => document.documentElement.setAttribute('data-terrain', t), terrain);

        const rows = await page.evaluate(MEASURE);
        measured += rows.length;
        for (const row of rows) {
          if (row.ratio < row.required) {
            failures.push({ card: rel, scheme, terrain, ...row });
          }
        }

        if (wantShots && terrain === 'wood') {
          await mkdir(SHOTS, { recursive: true });
          const name = `${rel.replace(/[/\\]/g, '-').replace('.html', '')}-${scheme}.png`;
          await page.screenshot({ path: join(SHOTS, name), fullPage: true });
        }
      }
      await context.close();
    }
  }

  await browser.close();

  console.log(`Measured ${measured} rendered text runs across ${files.length} cards × 2 themes × 5 terrains.`);

  if (parityBreaks.length) {
    console.log(`\nTHEME PARITY BREAKS (${parityBreaks.length}) — a forced theme differs from the OS scheme:`);
    parityBreaks.forEach((b) => console.log(`  ${b}`));
  } else {
    console.log('Theme parity: forced [data-theme] matches the OS scheme everywhere.');
  }

  if (!failures.length) {
    console.log('Contrast: all rendered text clears AA (4.5 body / 3.0 large).');
    return;
  }

  console.log(`\nCONTRAST FAILURES (${failures.length}):`);
  const worst = failures.sort((a, b) => a.ratio - b.ratio);
  for (const f of worst) {
    console.log(
      `  ${f.ratio.toFixed(2)} (need ${f.required})  ${f.scheme}/${f.terrain}  ` +
        `${f.size}px/${f.weight}  ${f.card}  "${f.text}"`,
    );
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

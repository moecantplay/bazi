/**
 * Rasterize public/icon.svg into the PNG app icons the manifest points at.
 *
 * Run from apps/web:  node scripts/generate-icons.mjs
 * Optionally set CHROME_PATH to a Chromium executable if the bundled one is
 * missing.
 *
 * Outputs: icon-192.png / icon-512.png (purpose "any"),
 * icon-maskable-512.png (artwork scaled to the ~80% safe zone so platform
 * masks can't crop it), and apple-touch-icon.png (180x180, opaque — iOS
 * flattens alpha to black).
 */

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "../public");
const svg = readFileSync(resolve(publicDir, "icon.svg"), "utf8");

/** The artwork at `size`, its content optionally shrunk toward center. */
function variant(size, contentScale) {
  let scaled = svg.replace(
    /<svg([^>]*?)width="512" height="512"/,
    `<svg$1width="${size}" height="${size}"`
  );
  if (contentScale !== 1) {
    // Wrap everything except the background rect in a centered scale.
    scaled = scaled
      .replace(
        /(<rect width="512" height="512"[^/]*\/>)/,
        `$1<g transform="translate(256 256) scale(${contentScale}) translate(-256 -256)">`
      )
      .replace("</svg>", "</g></svg>");
  }
  return scaled;
}

const TARGETS = [
  { file: "icon-192.png", size: 192, contentScale: 1 },
  { file: "icon-512.png", size: 512, contentScale: 1 },
  { file: "icon-maskable-512.png", size: 512, contentScale: 0.78 },
  { file: "apple-touch-icon.png", size: 180, contentScale: 1 }
];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();

for (const target of TARGETS) {
  await page.setViewportSize({ width: target.size, height: target.size });
  await page.setContent(variant(target.size, target.contentScale), {
    waitUntil: "networkidle"
  });
  await page.waitForTimeout(100); // let the CJK glyph paint
  await page.screenshot({
    path: resolve(publicDir, target.file),
    clip: { x: 0, y: 0, width: target.size, height: target.size }
  });
  console.log(`wrote ${target.file}`);
}

await browser.close();

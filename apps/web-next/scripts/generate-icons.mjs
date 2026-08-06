/**
 * Rasterize public/icon.svg into the PNG app icons the manifest points at.
 *
 * Run from apps/web-next:  node scripts/generate-icons.mjs
 * Optionally set CHROME_PATH to a Chromium executable if the bundled one is
 * missing.
 *
 * Outputs: icon-192.png / icon-512.png (purpose "any"),
 * icon-maskable-512.png (artwork scaled to the ~80% safe zone so platform
 * masks can't crop it), apple-touch-icon.png (180x180, opaque — iOS
 * flattens alpha to black), and favicon.ico (48x48 — browsers blind-request
 * /favicon.ico regardless of the declared icon links).
 */

import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
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

// favicon.ico: a single 48x48 PNG in an ICO container (PNG-in-ICO is
// supported by every browser that requests /favicon.ico).
const FAVICON_SIZE = 48;
await page.setViewportSize({ width: FAVICON_SIZE, height: FAVICON_SIZE });
await page.setContent(variant(FAVICON_SIZE, 1), { waitUntil: "networkidle" });
await page.waitForTimeout(100);
const png = await page.screenshot({
  clip: { x: 0, y: 0, width: FAVICON_SIZE, height: FAVICON_SIZE }
});
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(FAVICON_SIZE, 6); // width
header.writeUInt8(FAVICON_SIZE, 7); // height
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image data size
header.writeUInt32LE(22, 18); // image data offset
writeFileSync(resolve(publicDir, "favicon.ico"), Buffer.concat([header, png]));
console.log("wrote favicon.ico");

await browser.close();

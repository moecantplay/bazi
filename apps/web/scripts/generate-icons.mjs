/**
 * Rasterize public/icon.svg into the PNG app icons the manifest points at.
 *
 * Run from apps/web:  node scripts/generate-icons.mjs
 * Optionally set CHROME_PATH to a Chromium executable if the bundled one is
 * missing. The SVG is full-bleed cinnabar so the icons work as maskable too.
 */

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "../public");
const svg = readFileSync(resolve(publicDir, "icon.svg"), "utf8");
const sizes = [192, 512];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();

for (const size of sizes) {
  const scaled = svg.replace(
    /<svg([^>]*?)width="512" height="512"/,
    `<svg$1width="${size}" height="${size}"`
  );
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(scaled, { waitUntil: "networkidle" });
  await page.waitForTimeout(100); // let the CJK glyph paint
  await page.screenshot({
    path: resolve(publicDir, `icon-${size}.png`),
    clip: { x: 0, y: 0, width: size, height: size }
  });
  console.log(`wrote icon-${size}.png`);
}

await browser.close();

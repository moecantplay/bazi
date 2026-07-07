/**
 * Capture the /chart screen with fixture A at 420px width (portrait, full page)
 * and write it to the repo-root docs/screenshot-chart.png (referenced by
 * README.md). Serves the built static export from apps/web/out.
 *
 * Prereq: `pnpm --filter @daymaster/web build` (so out/ exists) and a Chromium
 * (managed, or point CHROME_PATH at one). Run from apps/web:
 *   node scripts/screenshot-chart.mjs
 */

import { chromium } from "@playwright/test";
import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../out");
const DOCS = resolve(here, "../../../docs"); // repo root /docs
const PORT = 3399;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function resolveFile(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  for (const f of [join(OUT, pathname), join(OUT, `${clean}.html`), join(OUT, pathname, "index.html")]) {
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return pathname === "/" ? join(OUT, "index.html") : null;
}

const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const file = resolveFile(pathname);
  if (!file) return res.writeHead(404).end("not found");
  res.setHeader("content-type", MIME[extname(file)] ?? "application/octet-stream");
  res.end(await readFile(file));
});
await new Promise((r) => server.listen(PORT, r));

const FIXTURE_A = JSON.stringify({
  birth: {
    date: "1994-12-08",
    time: "16:30",
    city: { name: "Jakarta", country: "Indonesia", lat: -6.2146, lng: 106.8451, tz: "Asia/Jakarta" },
    sex: "male"
  },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
});

await mkdir(DOCS, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
await context.addInitScript((json) => {
  window.localStorage.setItem("daymaster.profile.v1", json);
}, FIXTURE_A);

const page = await context.newPage();
await page.goto(`http://localhost:${PORT}/chart/`, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Chart", exact: true }).waitFor();
await page.getByText("Eating God").first().waitFor();
// Hide the fixed bottom nav: in a full-page capture it otherwise floats over
// the middle of the stitched image. It is chrome, not chart content.
await page.addStyleTag({ content: 'nav[aria-label="Primary"]{display:none !important}' });
await page.waitForTimeout(300); // let fonts settle

const target = join(DOCS, "screenshot-chart.png");
await page.screenshot({ path: target, fullPage: true });
console.log(`wrote ${target}`);

await browser.close();
server.close();

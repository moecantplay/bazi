/**
 * Capture the two manifest screenshots (richer Android install sheet) from the
 * built static export: Today and Chart with fixture A, 390x844 (form_factor
 * "narrow"). Run from apps/web after `pnpm build`:
 *
 *   node scripts/generate-manifest-screenshots.mjs
 */

import { chromium } from "@playwright/test";
import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../out");
const TARGET_DIR = resolve(here, "../public/screenshots");
const PORT = 3398;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain"
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

await mkdir(TARGET_DIR, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript((json) => {
  window.localStorage.setItem("daymaster.profile.v1", json);
}, FIXTURE_A);

const page = await context.newPage();

for (const shot of [
  { route: "/today/", wait: "Today", file: "today.png" },
  { route: "/chart/", wait: "Chart", file: "chart.png" }
]) {
  await page.goto(`http://localhost:${PORT}${shot.route}`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: shot.wait, exact: true }).waitFor();
  await page.waitForTimeout(300); // let fonts settle
  await page.screenshot({ path: join(TARGET_DIR, shot.file) });
  console.log(`wrote screenshots/${shot.file}`);
}

await browser.close();
server.close();

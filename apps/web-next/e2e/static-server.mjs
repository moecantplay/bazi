/**
 * Minimal static file server for the Next static export (apps/web-next/out).
 *
 * Playwright's webServer starts this to test the REAL exported build, not
 * `next dev`. With `trailingSlash: true` every route is a directory
 * (out/chart/index.html), so clean URLs like /chart and /chart/ both resolve to
 * that document — exactly as a bare static host would serve them.
 */

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../out");
const PORT = Number(process.env.E2E_PORT ?? 3211);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain",
  ".ico": "image/x-icon"
};

function resolveFile(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  const candidates = [
    join(ROOT, pathname),
    join(ROOT, `${clean}.html`),
    join(ROOT, pathname, "index.html")
  ];
  for (const file of candidates) {
    if (existsSync(file) && statSync(file).isFile()) {
      return file;
    }
  }
  if (pathname === "/" || pathname === "") {
    return join(ROOT, "index.html");
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const file = resolveFile(pathname);
  if (!file) {
    res.statusCode = 404;
    res.end("not found");
    return;
  }
  try {
    const body = await readFile(file);
    res.setHeader("content-type", MIME[extname(file)] ?? "application/octet-stream");
    res.end(body);
  } catch {
    res.statusCode = 500;
    res.end("error");
  }
});

server.listen(PORT, () => {
  console.log(`static export served at http://localhost:${PORT}`);
});

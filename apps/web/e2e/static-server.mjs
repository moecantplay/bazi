/**
 * Minimal static file server for the Next static export (apps/web/out).
 *
 * Playwright's webServer starts this to test the REAL exported build, not
 * `next dev`. With `trailingSlash: true` every route is a directory
 * (out/chart/index.html), so clean URLs like /chart and /chart/ both resolve to
 * that document — exactly as a bare static host would serve them.
 *
 * It also applies the response headers from out/vercel.json (written by
 * scripts/write-deploy-config.mjs), so the suite runs under production's CSP
 * (M19.8-05). Only the source patterns that script writes are understood;
 * anything else throws, so the two can't drift apart silently.
 */

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const E2E_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(E2E_DIR, "../out");
const PORT = Number(process.env.E2E_PORT ?? 3210);

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

/** A Vercel `source` we write ("/sw.js", "/_next/static/(.*)", "/(.*)") as a RegExp. */
function sourceToRegExp(source) {
  if (!/^[\w/.-]*(\(\.\*\))?$/.test(source)) {
    throw new Error(`static-server: unsupported vercel.json source ${source}`);
  }
  const wildcard = source.endsWith("(.*)");
  const prefix = wildcard ? source.slice(0, -"(.*)".length) : source;
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}${wildcard ? ".*" : ""}$`);
}

/** Headers out/vercel.json assigns to a path; read per request so a rebuild needs no restart. */
async function deployHeaders(pathname) {
  let config;
  try {
    config = JSON.parse(await readFile(join(ROOT, "vercel.json"), "utf8"));
  } catch {
    return [];
  }
  return (config.headers ?? [])
    .filter((rule) => sourceToRegExp(rule.source).test(pathname))
    .flatMap((rule) => rule.headers);
}

const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
  for (const { key, value } of await deployHeaders(pathname)) {
    res.setHeader(key, value);
  }
  // The E2E build's stand-in analytics tracker (M19.8-06); never part of out/.
  const file = pathname === "/__e2e/analytics.js" ? join(E2E_DIR, "fake-analytics.js") : resolveFile(pathname);
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

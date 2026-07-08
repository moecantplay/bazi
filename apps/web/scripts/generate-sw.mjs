/**
 * Post-build service-worker finalizer. Runs after `next build` (static export):
 *
 *   1. Walks apps/web/out/ and lists every exported file as a precache URL —
 *      route documents, RSC .txt payloads, _next/static chunks, fonts, icons.
 *   2. Hashes all listed content into the cache version, so every deploy that
 *      changes any byte ships a new cache name — no manual version bump.
 *   3. Rewrites out/sw.js, replacing the INJECT markers in the template
 *      (public/sw.js) with the real version and manifest.
 *
 * The template's fallback values keep the raw sw.js harmless if it is ever
 * served unprocessed.
 */

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");

/** Every file under out/, as repo-relative POSIX paths. */
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

const files = walk(outDir)
  .map((full) => relative(outDir, full).split(sep).join("/"))
  .filter((path) => path !== "sw.js")
  .sort();

const hash = createHash("sha256");
const urls = [];
for (const path of files) {
  hash.update(path);
  hash.update(readFileSync(join(outDir, path)));
  // Serve clean URLs: index.html -> its directory route (trailingSlash export).
  if (path === "index.html") {
    urls.push("/");
  } else if (path.endsWith("/index.html")) {
    urls.push(`/${path.slice(0, -"index.html".length)}`);
  } else {
    urls.push(`/${path}`);
  }
}

const version = `daymaster-${hash.digest("hex").slice(0, 12)}`;

const swPath = join(outDir, "sw.js");
const template = readFileSync(swPath, "utf8");
const finalized = template
  .replace(/^.*__INJECT_CACHE_VERSION__.*$/m, `const CACHE_VERSION = ${JSON.stringify(version)};`)
  .replace(/^.*__INJECT_PRECACHE__.*$/m, `const PRECACHE = ${JSON.stringify(urls)};`);

if (finalized === template) {
  throw new Error("sw.js template markers not found; precache injection failed");
}

writeFileSync(swPath, finalized);
console.log(`sw.js finalized: ${version}, ${urls.length} precached files`);

/**
 * Post-build: writes out/vercel.json, the response headers production serves
 * (M19.8-05). Runs after generate-sw.mjs so the service worker never lists
 * it. The deploy is a CLI upload of out/, so the config has to live there,
 * and out/ is rebuilt every time — hence generated, not committed.
 *
 * The CSP admits exactly one outside origin family: the analytics script and
 * its event endpoint, and only when a build is configured for them
 * (M19.8-06). Next's own env files are read the way `next build` reads them,
 * so the headers always match what the build baked in.
 *
 * e2e/static-server.mjs applies the same file, so the E2E suite runs under
 * these exact headers.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(appDir, "out");

/** Next's production precedence: the first file to define a key wins; the real environment beats all. */
function loadBuildEnv() {
  const env = {};
  for (const name of [".env.production.local", ".env.local", ".env.production", ".env"]) {
    const file = join(appDir, name);
    if (!existsSync(file)) {
      continue;
    }
    for (const [key, value] of Object.entries(parseEnv(readFileSync(file, "utf8")))) {
      env[key] ??= value;
    }
  }
  return { ...env, ...process.env };
}

/** The origin of an absolute URL, or null for a relative or missing one. */
function originOf(url) {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const env = loadBuildEnv();
const analyticsOrigins = [
  ...new Set(
    [env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL, env.NEXT_PUBLIC_ANALYTICS_HOST_URL]
      .map(originOf)
      .filter((origin) => origin !== null)
  )
];
const extra = analyticsOrigins.length > 0 ? ` ${analyticsOrigins.join(" ")}` : "";

// 'unsafe-inline' for scripts: a static export can't issue per-request nonces,
// and Next's inline hydration scripts differ per page. Everything else is locked.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${extra}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${extra}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join("; ");

const config = {
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" }
      ]
    },
    {
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    },
    {
      source: "/sw.js",
      headers: [{ key: "Cache-Control", value: "no-cache" }]
    }
  ]
};

writeFileSync(join(outDir, "vercel.json"), `${JSON.stringify(config, null, 2)}\n`);
console.log(
  `vercel.json written${analyticsOrigins.length > 0 ? ` (analytics: ${analyticsOrigins.join(", ")})` : ""}`
);

/*
 * Daymaster service worker — offline-safe app shell.
 *
 * install:  precache the full static export (documents, RSC payloads, chunks,
 *           fonts, icons) as listed by scripts/generate-sw.mjs at build time.
 * fetch:    cache-first for same-origin GETs, filling the cache on a miss;
 *           navigations fall back to the cached Today screen when offline.
 * activate: drop caches from older versions and take control of open pages.
 * update:   a new deploy installs alongside the old one and WAITS; the page
 *           shows a refresh prompt and posts SKIP_WAITING when the user opts
 *           in, so running clients are never yanked to a half-updated state.
 *
 * No cross-origin requests are ever made — only same-origin asset fetches.
 * The two INJECT lines are rewritten in out/sw.js on every build; the values
 * here are dev-safe fallbacks.
 */

const CACHE_VERSION = "daymaster-dev"; // __INJECT_CACHE_VERSION__
const PRECACHE = ["/"]; // __INJECT_PRECACHE__

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      // All-or-nothing: the new version only ever activates complete.
      await cache.addAll(PRECACHE);
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        if (request.mode === "navigate") {
          // Offline navigation to something unprecached: land on Today (its
          // ProfileGate routes onward), never on the blank redirect shell.
          const fallback = (await cache.match("/today/")) ?? (await cache.match("/"));
          if (fallback) {
            return fallback;
          }
        }
        throw error;
      }
    })()
  );
});

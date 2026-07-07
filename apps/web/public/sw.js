/*
 * Daymaster service worker — offline-safe app shell.
 *
 * install:  precache the core shell and best-effort the route documents.
 * fetch:    cache-first for same-origin GETs, filling the cache on a miss;
 *           navigations fall back to the cached start page when offline.
 * activate: drop caches from older versions and take control immediately.
 *
 * No cross-origin requests are ever made — only same-origin asset fetches.
 */

// RELEASE CHECKLIST: bump this on every deploy. HTML is served cache-first, so
// installed clients keep the old shell until the version changes.
const CACHE_VERSION = "daymaster-v2";

// Always resolvable, so addAll (all-or-nothing) is safe here.
const CORE = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/icon.svg"];

// Route documents (trailingSlash export emits /route/index.html); precached
// best-effort so one 404 can't abort install.
const ROUTES = ["/onboarding/", "/today/", "/chart/", "/cycles/", "/compare/", "/settings/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      await cache.addAll(CORE);
      await Promise.allSettled(ROUTES.map((route) => cache.add(route)));
      await self.skipWaiting();
    })()
  );
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
          const fallback = await cache.match("/");
          if (fallback) {
            return fallback;
          }
        }
        throw error;
      }
    })()
  );
});

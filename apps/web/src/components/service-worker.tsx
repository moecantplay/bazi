/**
 * Registers the service worker once, in the browser, in production builds only.
 * Dev keeps live reloading uncached; the static export registers /sw.js so the
 * app installs and works offline.
 */

"use client";

import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failures must never break the app; offline is a bonus.
    });
  }, []);

  return null;
}

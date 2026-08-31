/**
 * Whether the OS-level "reduce motion" preference is on — read via
 * matchMedia since ScrollCarousel decides `scrollIntoView`'s `behavior`
 * ("smooth" vs "instant") in JS, a decision the app's existing CSS-only
 * `@media (prefers-reduced-motion: no-preference)` gating (globals.css)
 * can't reach. SSR-safe default of false; a mount effect corrects it before
 * paint on the client and a change listener keeps it live.
 */

"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    function onChange(event: MediaQueryListEvent) {
      setReduced(event.matches);
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

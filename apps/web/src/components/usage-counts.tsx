/**
 * Mounted once in the root layout: starts anonymous usage counts when the
 * build and the reader allow them, and reports each route as a page view
 * (M19.8-06). Renders nothing.
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startUsageCounts, trackPageview } from "@/lib/analytics";

export function UsageCounts() {
  const pathname = usePathname();

  useEffect(() => {
    startUsageCounts();
  }, []);

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return null;
}

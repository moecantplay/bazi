/**
 * The active look, read from `data-look` on <html> — the attribute the
 * pre-paint script and `applyLookPreference` stamp (M19.9-03). Reading the
 * DOM rather than the store means every subscriber follows a Settings change
 * at once, with no reload. The server snapshot is DEFAULT_LOOK, matching the
 * server HTML's `data-look`, so hydration never mismatches.
 */

"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LOOK } from "@/lib/store";
import { parseLookPreference, type LookPreference } from "@/lib/store-types";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-look"] });
  return () => observer.disconnect();
}

function currentLook(): LookPreference {
  return parseLookPreference(document.documentElement.dataset.look) ?? DEFAULT_LOOK;
}

export function useLook(): LookPreference {
  return useSyncExternalStore(subscribe, currentLook, () => DEFAULT_LOOK);
}

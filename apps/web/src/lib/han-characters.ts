/**
 * The single gateway to the persisted "Show Chinese characters" preference
 * (`daymaster.han.v1`). Characters are shown by default; storage holds only
 * the opt-out ("hide") and showing is simply the key's absence — mirroring
 * how lib/theme.ts stores its preference.
 */

export const HAN_STORAGE_KEY = "daymaster.han.v1";

/** Whether Han characters should be shown: true unless the user opted out. */
export function loadHanCharactersPreference(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    return window.localStorage.getItem(HAN_STORAGE_KEY) !== "hide";
  } catch {
    // Storage access denied: behave as if no preference exists.
    return true;
  }
}

/** Persist the preference; showing (the default) clears the key. */
export function saveHanCharactersPreference(show: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (show) {
      window.localStorage.removeItem(HAN_STORAGE_KEY);
    } else {
      window.localStorage.setItem(HAN_STORAGE_KEY, "hide");
    }
  } catch {
    // Storage denied: the choice still applies for this visit.
  }
}

/** Remove the stored preference and fall back to showing characters. */
export function clearHanCharactersPreference(): void {
  saveHanCharactersPreference(true);
}

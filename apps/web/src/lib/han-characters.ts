/**
 * The single gateway to the persisted "Show Chinese characters" preference
 * (`daymaster.han.v1`). The app is English-first: glosses are the primary
 * wording and characters are the opt-in ("show"). The key's absence means
 * the default (hidden) — mirroring how lib/theme.ts stores its preference.
 * The legacy opt-out value "hide" (from the characters-by-default era) reads
 * the same as absence, so older devices land on the new default too.
 */

export const HAN_STORAGE_KEY = "daymaster.han.v1";

/** Whether Han characters should be shown: false unless the user opted in. */
export function loadHanCharactersPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(HAN_STORAGE_KEY) === "show";
  } catch {
    // Storage access denied: behave as if no preference exists.
    return false;
  }
}

/** Persist the preference; hiding (the default) clears the key. */
export function saveHanCharactersPreference(show: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (show) {
      window.localStorage.setItem(HAN_STORAGE_KEY, "show");
    } else {
      window.localStorage.removeItem(HAN_STORAGE_KEY);
    }
  } catch {
    // Storage denied: the choice still applies for this visit.
  }
}

/** Remove the stored preference and fall back to English-first. */
export function clearHanCharactersPreference(): void {
  saveHanCharactersPreference(false);
}

/**
 * The single gateway to the persisted theme preference (`daymaster.theme.v1`).
 *
 * "system" follows the OS via the prefers-color-scheme media query in
 * globals.css; "light" and "dark" pin the theme by stamping data-theme on
 * <html>. The same stamping logic runs as an inline script in layout.tsx
 * before first paint, so a pinned theme never flashes. Storage holds the raw
 * string ("light" | "dark") and "system" is simply the key's absence.
 */

export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "daymaster.theme.v1";

/** The stored preference, or "system" when unset or unreadable. */
export function loadThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : "system";
  } catch {
    // Storage access denied: behave as if no preference exists.
    return "system";
  }
}

/** Stamp (or clear) data-theme on <html> so the CSS tokens switch. */
export function applyThemePreference(preference: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }
  if (preference === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
}

/** Persist the preference and apply it immediately. */
export function saveThemePreference(preference: ThemePreference): void {
  if (typeof window !== "undefined") {
    try {
      if (preference === "system") {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    } catch {
      // Storage denied: the theme still applies for this visit.
    }
  }
  applyThemePreference(preference);
}

/** Remove the stored preference and fall back to the system theme. */
export function clearThemePreference(): void {
  saveThemePreference("system");
}

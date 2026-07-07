/**
 * The single gateway to the persisted comparison companion — the second
 * person's birth details (`daymaster.compare.v1`). One companion at a time;
 * saving replaces the previous one. Corrupt or foreign data reads as absent,
 * mirroring lib/profile.ts.
 */

import { isStoredBirth, type StoredBirth } from "./profile";

const COMPARE_KEY = "daymaster.compare.v1";

/** The stored companion birth, or `null` if none / unreadable. */
export function loadCompanion(): StoredBirth | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(COMPARE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isStoredBirth(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Persist the companion, replacing any existing one. */
export function saveCompanion(birth: StoredBirth): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(COMPARE_KEY, JSON.stringify(birth));
}

/** Remove the stored companion. */
export function clearCompanion(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(COMPARE_KEY);
}

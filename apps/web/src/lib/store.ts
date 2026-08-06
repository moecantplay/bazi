/**
 * The single gateway to the persisted app document (`daymaster.store.v2`):
 * profile, saved people, the active comparison person, and the theme
 * preference, all in one versioned JSON blob — the shape M20's sync payload
 * will eventually mirror. Replaces the six separate `daymaster.*.v1` keys
 * apps/web used (profile.ts, people.ts, theme.ts).
 *
 * `loadStore` is the single read path every screen goes through, and it is
 * also where the one-time legacy migration (store-migration.ts) is invoked:
 * the first read of the store IS "app boot" for a client-rendered app with no
 * server round trip, so there is no separate init step to wire up or forget.
 * Once `daymaster.store.v2` exists, migration is skipped on every later call.
 *
 * The reading streak (`daymaster.streak.v1`, see streak.ts once ported) is a
 * deliberate carve-out and never joins this document — see the M19 plan's
 * decision C. `deleteAllData` below still clears it as one user action.
 */

import { migrateLegacyStore } from "./store-migration";
import type { StoredBirth, StoredPerson, StoredProfile, ThemePreference } from "./store-types";

export const STORE_KEY = "daymaster.store.v2";
const STREAK_KEY = "daymaster.streak.v1";
const ONBOARDING_DRAFT_KEY = "daymaster.onboarding.v1";
/** Session-scoped stash for a birth that arrived via a `?share=` link — see share-link.ts. */
export const SHARE_INCOMING_KEY = "daymaster.share-incoming.v1";

export interface DaymasterStore {
  app: "daymaster";
  version: 2;
  updatedAt: string; // ISO
  profile: StoredProfile | null;
  people: StoredPerson[];
  activePersonId: string | null;
  theme: ThemePreference;
}

export function emptyStore(): DaymasterStore {
  return {
    app: "daymaster",
    version: 2,
    updatedAt: new Date().toISOString(),
    profile: null,
    people: [],
    activePersonId: null,
    theme: "system"
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Structural check for a v2 document read back from storage. */
export function isDaymasterStore(value: unknown): value is DaymasterStore {
  if (!isObject(value)) {
    return false;
  }
  return value.app === "daymaster" && value.version === 2 && typeof value.updatedAt === "string";
}

/** The stored document, migrating legacy keys into it on first read. Never null — an absent store reads as `emptyStore()`. */
export function loadStore(): DaymasterStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (isDaymasterStore(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Malformed JSON or storage access denied: fall through to migration/empty.
  }
  return migrateLegacyStore();
}

/** Persist the whole document, replacing any existing one. Returns false when storage refuses the write. */
export function saveStore(store: DaymasterStore): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ ...store, updatedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

/** Writes a profile into the store, leaving people/theme/activePersonId untouched. The onboarding reveal step's save path. */
export function saveProfile(profile: StoredProfile): boolean {
  return saveStore({ ...loadStore(), profile });
}

function newPersonId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `person-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

/** The saved comparison people, in the order they were added. */
export function loadPeople(): StoredPerson[] {
  return loadStore().people;
}

/** Adds a new saved person and returns it, or null when storage refuses the write. */
export function addPerson(name: string, birth: StoredBirth): StoredPerson | null {
  const person: StoredPerson = { id: newPersonId(), name, birth };
  const store = loadStore();
  const ok = saveStore({ ...store, people: [...store.people, person] });
  return ok ? person : null;
}

/** Removes a saved person, clearing the active selection if it pointed at them. */
export function removePerson(id: string): void {
  const store = loadStore();
  saveStore({
    ...store,
    people: store.people.filter((person) => person.id !== id),
    activePersonId: store.activePersonId === id ? null : store.activePersonId
  });
}

/** The saved person currently selected for Compare, or null when none is. */
export function loadActivePersonId(): string | null {
  return loadStore().activePersonId;
}

export function setActivePersonId(id: string | null): void {
  saveStore({ ...loadStore(), activePersonId: id });
}

/** The user's Appearance choice (Settings). Defaults to "system". */
export function loadThemePreference(): ThemePreference {
  return loadStore().theme;
}

/** Stamp (or clear) data-theme on <html> so the CSS tokens switch immediately. */
export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }
  if (theme === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

/** Persist the preference and apply it immediately, matching the pre-paint init script's read shape. */
export function saveThemePreference(theme: ThemePreference): void {
  saveStore({ ...loadStore(), theme });
  applyThemePreference(theme);
}

/** Clears the store, the streak, and this-device transient onboarding/share-link state. Leaves nothing else behind. */
export function deleteAllData(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORE_KEY);
    window.localStorage.removeItem(STREAK_KEY);
  } catch {
    // Nothing to clean up if storage is unreachable.
  }
  try {
    window.sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
    window.sessionStorage.removeItem(SHARE_INCOMING_KEY);
  } catch {
    // Nothing to clean up if storage is unreachable.
  }
}

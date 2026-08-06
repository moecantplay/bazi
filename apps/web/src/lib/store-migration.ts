/**
 * One-time migration from apps/web's six `daymaster.*.v1` keys into the
 * single `daymaster.store.v2` document. Called by `loadStore` (store.ts)
 * whenever no v2 document exists yet; safe to call more than once — if a v2
 * document is already present, it's returned unchanged and no legacy key is
 * touched again.
 *
 * Ingestion order (oldest legacy shape first), matching apps/web's own
 * layering (people.ts's `migrateLegacyCompanion`, backup.ts):
 *   1. `daymaster.compare.v1` — a raw StoredBirth predating saved people at
 *      all; becomes a person named "Them" and the active selection.
 *   2. `daymaster.people.v1` / `daymaster.people-active.v1`
 *   3. `daymaster.profile.v1`
 *   4. `daymaster.theme.v1`
 * Every legacy value is rebuilt field-by-field from its validated shape
 * (`toStoredProfile`/`toStoredPerson` in store-types.ts) rather than spread
 * as-is, so any stray field an old export carried — e.g. the retired
 * Han-toggle preference — is silently dropped instead of crashing or leaking
 * into the new document. `daymaster.streak.v1` is never read or removed here
 * (decision C: a permanent, separate carve-out).
 */

import { emptyStore, isDaymasterStore, saveStore, STORE_KEY, type DaymasterStore } from "./store";
import {
  isStoredBirth,
  isStoredPerson,
  isStoredProfile,
  toStoredPerson,
  toStoredProfile,
  type StoredPerson,
  type ThemePreference
} from "./store-types";

const LEGACY_COMPANION_KEY = "daymaster.compare.v1";
const LEGACY_PEOPLE_KEY = "daymaster.people.v1";
const LEGACY_PEOPLE_ACTIVE_KEY = "daymaster.people-active.v1";
const LEGACY_PROFILE_KEY = "daymaster.profile.v1";
const LEGACY_THEME_KEY = "daymaster.theme.v1";

function readExistingStore(): DaymasterStore | null {
  const parsed = readJson(STORE_KEY);
  return isDaymasterStore(parsed) ? parsed : null;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `person-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function readLegacyPeople(): StoredPerson[] {
  const parsed = readJson(LEGACY_PEOPLE_KEY);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter(isStoredPerson).map(toStoredPerson);
}

function readLegacyActivePersonId(): string | null {
  try {
    return window.localStorage.getItem(LEGACY_PEOPLE_ACTIVE_KEY);
  } catch {
    return null;
  }
}

function readLegacyTheme(): ThemePreference {
  try {
    const raw = window.localStorage.getItem(LEGACY_THEME_KEY);
    return raw === "light" || raw === "dark" ? raw : "system";
  } catch {
    return "system";
  }
}

function removeLegacyKeys(): void {
  for (const key of [
    LEGACY_COMPANION_KEY,
    LEGACY_PEOPLE_KEY,
    LEGACY_PEOPLE_ACTIVE_KEY,
    LEGACY_PROFILE_KEY,
    LEGACY_THEME_KEY
  ]) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to clean up if storage is unreachable.
    }
  }
}

/** Runs the one-time legacy migration and returns the resulting v2 document. Safe to call even when there is nothing to migrate — yields `emptyStore()`. */
export function migrateLegacyStore(): DaymasterStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }

  const existing = readExistingStore();
  if (existing !== null) {
    return existing;
  }

  let people = readLegacyPeople();
  let activePersonId = readLegacyActivePersonId();

  const legacyCompanion = readJson(LEGACY_COMPANION_KEY);
  if (isStoredBirth(legacyCompanion)) {
    const them: StoredPerson = { id: newId(), name: "Them", birth: legacyCompanion };
    people = [...people, them];
    activePersonId = them.id;
  }

  const legacyProfile = readJson(LEGACY_PROFILE_KEY);
  const profile = isStoredProfile(legacyProfile) ? toStoredProfile(legacyProfile) : null;

  const theme = readLegacyTheme();

  const store: DaymasterStore = {
    ...emptyStore(),
    profile,
    people,
    activePersonId,
    theme
  };

  saveStore(store);
  removeLegacyKeys();
  return store;
}

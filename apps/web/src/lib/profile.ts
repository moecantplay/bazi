/**
 * The single gateway to the persisted user profile. Every screen reads and
 * writes the birth chart through this module so the localStorage schema
 * (`daymaster.profile.v1`) lives in exactly one place.
 *
 * Corrupt or foreign data is treated as absent rather than throwing: a bad
 * value should route the user to onboarding, never crash the app.
 */

const STORAGE_KEY = "daymaster.profile.v1";

export type Sex = "male" | "female";
export type LateZiHour = "midnight" | "shift-day";

export interface StoredCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
}

export interface StoredBirth {
  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm, null = unknown
  city: StoredCity;
  sex: Sex;
}

export interface StoredConfig {
  lateZiHour: LateZiHour;
  trueSolarTime: boolean;
}

export interface StoredProfile {
  birth: StoredBirth;
  config: StoredConfig;
  createdAt: string; // ISO
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCity(value: unknown): value is StoredCity {
  if (!isObject(value)) {
    return false;
  }
  return (
    typeof value.name === "string" &&
    typeof value.country === "string" &&
    typeof value.lat === "number" &&
    typeof value.lng === "number" &&
    typeof value.tz === "string"
  );
}

/** Validates a stored birth block; also used by the compare companion store. */
export function isStoredBirth(value: unknown): value is StoredBirth {
  if (!isObject(value)) {
    return false;
  }
  const timeOk = value.time === null || typeof value.time === "string";
  const sexOk = value.sex === "male" || value.sex === "female";
  return (
    typeof value.date === "string" &&
    timeOk &&
    sexOk &&
    isCity(value.city)
  );
}

function isConfig(value: unknown): value is StoredConfig {
  if (!isObject(value)) {
    return false;
  }
  const lateZiOk =
    value.lateZiHour === "midnight" || value.lateZiHour === "shift-day";
  return lateZiOk && typeof value.trueSolarTime === "boolean";
}

function isProfile(value: unknown): value is StoredProfile {
  if (!isObject(value)) {
    return false;
  }
  return (
    isStoredBirth(value.birth) &&
    isConfig(value.config) &&
    typeof value.createdAt === "string"
  );
}

/** The stored profile, or `null` if there is none / it is unreadable. */
export function loadProfile(): StoredProfile | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isProfile(parsed) ? parsed : null;
  } catch {
    // Malformed JSON or storage access denied: behave as if no profile exists.
    return null;
  }
}

/**
 * Persist the profile, replacing any existing one. Returns false when storage
 * refuses the write (private browsing, quota) so callers can tell the user
 * instead of crashing mid-onboarding.
 */
export function saveProfile(profile: StoredProfile): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/** Update only the config block of the stored profile, leaving birth intact. */
export function saveConfig(config: StoredConfig): StoredProfile | null {
  const existing = loadProfile();
  if (existing === null) {
    return null;
  }
  const updated: StoredProfile = { ...existing, config };
  saveProfile(updated);
  return updated;
}

/** Remove the stored profile entirely. */
export function clearProfile(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

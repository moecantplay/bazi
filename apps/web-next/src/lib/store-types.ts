/**
 * Shapes shared by the store, its migration, and the backup envelope.
 *
 * The stored-profile shapes themselves (Sex/StoredCity/StoredBirth/
 * StoredConfig/StoredProfile/StoredPerson) live in packages/presentation —
 * it's the canonical, pure-layer home for them (Phase 1). This file only
 * adds what's genuinely app-local: ThemePreference, and the localStorage
 * validators/sanitizers, which are I/O-adjacent and stay here per decision B
 * (presentation is framework/IO-free).
 */

import type {
  Sex,
  StoredCity,
  StoredBirth,
  StoredConfig,
  StoredProfile,
  StoredPerson
} from "@daymaster/presentation";

export type { Sex, StoredCity, StoredBirth, StoredConfig, StoredProfile, StoredPerson };
export type ThemePreference = "system" | "light" | "dark";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Structural check only — extra fields (e.g. a retired legacy `han` flag) are ignored, not rejected. */
export function isStoredCity(value: unknown): value is StoredCity {
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

export function isStoredBirth(value: unknown): value is StoredBirth {
  if (!isObject(value)) {
    return false;
  }
  const timeOk = value.time === null || typeof value.time === "string";
  const sexOk = value.sex === "male" || value.sex === "female";
  return typeof value.date === "string" && timeOk && sexOk && isStoredCity(value.city);
}

export function isStoredConfig(value: unknown): value is StoredConfig {
  if (!isObject(value)) {
    return false;
  }
  const lateZiOk = value.lateZiHour === "midnight" || value.lateZiHour === "shift-day";
  return lateZiOk && typeof value.trueSolarTime === "boolean";
}

export function isStoredProfile(value: unknown): value is StoredProfile {
  if (!isObject(value)) {
    return false;
  }
  return isStoredBirth(value.birth) && isStoredConfig(value.config) && typeof value.createdAt === "string";
}

export function isStoredPerson(value: unknown): value is StoredPerson {
  if (!isObject(value)) {
    return false;
  }
  return typeof value.id === "string" && typeof value.name === "string" && isStoredBirth(value.birth);
}

/** Rebuilds a person from only its known fields, dropping anything else the raw value carried. */
export function toStoredPerson(value: StoredPerson): StoredPerson {
  return { id: value.id, name: value.name, birth: toStoredBirth(value.birth) };
}

function toStoredBirth(value: StoredBirth): StoredBirth {
  return {
    date: value.date,
    time: value.time,
    sex: value.sex,
    city: {
      name: value.city.name,
      country: value.city.country,
      lat: value.city.lat,
      lng: value.city.lng,
      tz: value.city.tz
    }
  };
}

/** Rebuilds a profile from only its known fields, dropping anything else the raw value carried (e.g. a stray legacy `han` flag). */
export function toStoredProfile(value: StoredProfile): StoredProfile {
  return {
    birth: toStoredBirth(value.birth),
    config: { lateZiHour: value.config.lateZiHour, trueSolarTime: value.config.trueSolarTime },
    createdAt: value.createdAt
  };
}

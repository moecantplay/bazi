/**
 * The single gateway to saved comparison people (`daymaster.people.v1`) and
 * which of them is currently being read (`daymaster.people-active.v1`).
 * Replaces the single anonymous companion of `daymaster.compare.v1`; a legacy
 * companion found there is migrated to a person named "Them" on first load.
 * Corrupt or foreign data reads as absent, mirroring lib/profile.ts.
 */

import { isStoredBirth, type StoredBirth } from "./profile";

export interface StoredPerson {
  id: string;
  name: string;
  birth: StoredBirth;
}

const PEOPLE_KEY = "daymaster.people.v1";
const ACTIVE_KEY = "daymaster.people-active.v1";
const LEGACY_COMPANION_KEY = "daymaster.compare.v1";

function isPerson(value: unknown): value is StoredPerson {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const person = value as Record<string, unknown>;
  return (
    typeof person.id === "string" &&
    typeof person.name === "string" &&
    isStoredBirth(person.birth)
  );
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `person-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function writePeople(people: StoredPerson[]): boolean {
  try {
    window.localStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
    return true;
  } catch {
    return false;
  }
}

/** Move a pre-people companion into the list, once, and make it active. */
function migrateLegacyCompanion(people: StoredPerson[]): StoredPerson[] {
  try {
    const raw = window.localStorage.getItem(LEGACY_COMPANION_KEY);
    if (raw === null) {
      return people;
    }
    window.localStorage.removeItem(LEGACY_COMPANION_KEY);
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredBirth(parsed)) {
      return people;
    }
    const migrated: StoredPerson = { id: newId(), name: "Them", birth: parsed };
    const next = [...people, migrated];
    writePeople(next);
    setActivePersonId(migrated.id);
    return next;
  } catch {
    return people;
  }
}

/** Every saved person, oldest first. Runs the legacy migration as it reads. */
export function loadPeople(): StoredPerson[] {
  if (typeof window === "undefined") {
    return [];
  }
  let people: StoredPerson[] = [];
  try {
    const raw = window.localStorage.getItem(PEOPLE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isPerson)) {
        people = parsed;
      }
    }
  } catch {
    people = [];
  }
  return migrateLegacyCompanion(people);
}

/** Replace the whole list (used by the backup importer). */
export function savePeople(people: StoredPerson[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return writePeople(people);
}

/** Add a person and return them, or null when storage refuses the write. */
export function addPerson(name: string, birth: StoredBirth): StoredPerson | null {
  if (typeof window === "undefined") {
    return null;
  }
  const person: StoredPerson = { id: newId(), name, birth };
  return writePeople([...loadPeople(), person]) ? person : null;
}

/** Remove a person; the active selection is cleared if it pointed at them. */
export function removePerson(id: string): void {
  if (typeof window === "undefined") {
    return;
  }
  writePeople(loadPeople().filter((person) => person.id !== id));
  if (loadActivePersonId() === id) {
    setActivePersonId(null);
  }
}

/** The id of the person currently being read, or null. */
export function loadActivePersonId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

/** Point Compare at a person (null returns to the picker). */
export function setActivePersonId(id: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_KEY);
    } else {
      window.localStorage.setItem(ACTIVE_KEY, id);
    }
  } catch {
    // Storage denied: the selection just won't survive a reload.
  }
}

/** Remove every saved person, the selection, and any legacy companion. */
export function clearPeople(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(PEOPLE_KEY);
    window.localStorage.removeItem(ACTIVE_KEY);
    window.localStorage.removeItem(LEGACY_COMPANION_KEY);
  } catch {
    // Nothing to clean up if storage is unreachable.
  }
}

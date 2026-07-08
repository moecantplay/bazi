/**
 * Backup and restore of everything the app stores on-device: the profile, the
 * comparison companion, and the appearance/character preferences. This is the
 * local-only substitute for an account — a JSON file the user owns. The
 * envelope is versioned so a future schema can still read old files.
 */

import {
  loadHanCharactersPreference,
  saveHanCharactersPreference
} from "./han-characters";
import { loadPeople, savePeople, type StoredPerson } from "./people";
import {
  isStoredBirth,
  isStoredProfile,
  loadProfile,
  saveProfile,
  type StoredProfile
} from "./profile";
import { loadThemePreference, saveThemePreference } from "./theme";

export interface BackupFile {
  app: "daymaster";
  version: 1;
  exportedAt: string; // ISO
  profile: StoredProfile;
  people: StoredPerson[];
  theme: "system" | "light" | "dark";
  showHanCharacters: boolean;
}

export const BACKUP_FILENAME = "daymaster-backup.json";

/** Everything currently stored, as pretty-printed JSON — null without a profile. */
export function serializeBackup(): string | null {
  const profile = loadProfile();
  if (profile === null) {
    return null;
  }
  const backup: BackupFile = {
    app: "daymaster",
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    people: loadPeople(),
    theme: loadThemePreference(),
    showHanCharacters: loadHanCharactersPreference()
  };
  return JSON.stringify(backup, null, 2);
}

export type ImportResult = "ok" | "invalid" | "storage";

function isPersonEntry(value: unknown): value is StoredPerson {
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

function isBackup(value: unknown): value is BackupFile {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const backup = value as Record<string, unknown>;
  const peopleOk = Array.isArray(backup.people) && backup.people.every(isPersonEntry);
  const themeOk =
    backup.theme === "system" || backup.theme === "light" || backup.theme === "dark";
  return (
    backup.app === "daymaster" &&
    backup.version === 1 &&
    isStoredProfile(backup.profile) &&
    peopleOk &&
    themeOk &&
    typeof backup.showHanCharacters === "boolean"
  );
}

/** Validate a backup file's text and, when sound, restore every store. */
export function importBackup(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "invalid";
  }
  if (!isBackup(parsed)) {
    return "invalid";
  }
  if (!saveProfile(parsed.profile)) {
    return "storage";
  }
  if (parsed.people.length > 0) {
    savePeople(parsed.people);
  }
  saveThemePreference(parsed.theme);
  saveHanCharactersPreference(parsed.showHanCharacters);
  return "ok";
}

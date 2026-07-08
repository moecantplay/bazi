/**
 * Backup and restore of everything the app stores on-device: the profile, the
 * comparison companion, and the appearance/character preferences. This is the
 * local-only substitute for an account — a JSON file the user owns. The
 * envelope is versioned so a future schema can still read old files.
 */

import { loadCompanion, saveCompanion } from "./compare-profile";
import {
  loadHanCharactersPreference,
  saveHanCharactersPreference
} from "./han-characters";
import {
  isStoredBirth,
  isStoredProfile,
  loadProfile,
  saveProfile,
  type StoredBirth,
  type StoredProfile
} from "./profile";
import { loadThemePreference, saveThemePreference } from "./theme";

export interface BackupFile {
  app: "daymaster";
  version: 1;
  exportedAt: string; // ISO
  profile: StoredProfile;
  companion: StoredBirth | null;
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
    companion: loadCompanion(),
    theme: loadThemePreference(),
    showHanCharacters: loadHanCharactersPreference()
  };
  return JSON.stringify(backup, null, 2);
}

export type ImportResult = "ok" | "invalid" | "storage";

function isBackup(value: unknown): value is BackupFile {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const backup = value as Record<string, unknown>;
  const companionOk = backup.companion === null || isStoredBirth(backup.companion);
  const themeOk =
    backup.theme === "system" || backup.theme === "light" || backup.theme === "dark";
  return (
    backup.app === "daymaster" &&
    backup.version === 1 &&
    isStoredProfile(backup.profile) &&
    companionOk &&
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
  if (parsed.companion !== null) {
    saveCompanion(parsed.companion);
  }
  saveThemePreference(parsed.theme);
  saveHanCharactersPreference(parsed.showHanCharacters);
  return "ok";
}

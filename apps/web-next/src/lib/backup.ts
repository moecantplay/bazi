/**
 * Backup and restore of the whole app document. Version 2 of the envelope
 * mirrors `daymaster.store.v2` directly (`BackupFile.store` is that same
 * shape), so `serializeBackup`/`importBackup` are thin load/save wrappers —
 * the local-only substitute for an account, still a JSON file the user owns.
 */

import { isDaymasterStore, loadStore, saveStore, type DaymasterStore } from "./store";

export interface BackupFile {
  app: "daymaster";
  version: 2;
  exportedAt: string; // ISO
  store: DaymasterStore;
}

export const BACKUP_FILENAME = "daymaster-backup.json";

/** Everything currently stored, as pretty-printed JSON — null when there is no profile to back up. */
export function serializeBackup(): string | null {
  const store = loadStore();
  if (store.profile === null) {
    return null;
  }
  const backup: BackupFile = {
    app: "daymaster",
    version: 2,
    exportedAt: new Date().toISOString(),
    store
  };
  return JSON.stringify(backup, null, 2);
}

export type ImportResult = "ok" | "invalid" | "storage";

function isBackup(value: unknown): value is BackupFile {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const backup = value as Record<string, unknown>;
  return backup.app === "daymaster" && backup.version === 2 && isDaymasterStore(backup.store);
}

/** Validate a backup file's text and, when sound, restore the whole document. */
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
  return saveStore(parsed.store) ? "ok" : "storage";
}

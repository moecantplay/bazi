/**
 * Ask the browser to keep this site's storage through storage-pressure
 * eviction (M19.8-02). Advisory: Chrome and Safari decide silently, Firefox
 * may ask once and remembers the answer, so calling it on every load of a
 * gated screen never nags. It does not lift Safari's 7-day cap on sites used
 * in a browser tab — installing to the home screen, or M21 sync, does.
 */

/** The two StorageManager methods this needs — injectable for tests. */
export interface PersistableStorage {
  persisted?: () => Promise<boolean>;
  persist?: () => Promise<boolean>;
}

/** Resolves true when storage is (now) persistent; never rejects. */
export async function requestPersistentStorage(
  manager: PersistableStorage | undefined = typeof navigator === "undefined" ? undefined : navigator.storage
): Promise<boolean> {
  if (manager?.persisted === undefined || manager.persist === undefined) {
    return false;
  }
  try {
    if (await manager.persisted()) {
      return true;
    }
    return await manager.persist();
  } catch {
    // A refusal is an answer, not an error: the data simply stays best-effort.
    return false;
  }
}

import { beforeEach, describe, expect, it } from "vitest";
import {
  JOURNAL_NOTE_MAX,
  STORE_KEY,
  emptyStore,
  loadJournalEntry,
  loadStore,
  removeJournalEntry,
  saveJournalEntry
} from "./store";

/** Same minimal in-memory Storage store-migration.test.ts uses. */
class FakeStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

let localStorage: FakeStorage;

beforeEach(() => {
  localStorage = new FakeStorage();
  Object.assign(globalThis, { window: { localStorage, sessionStorage: new FakeStorage() } });
});

describe("journal in the v2 store", () => {
  it("a v2 document written before the journal existed reads with an empty journal", () => {
    const legacy: Record<string, unknown> = { ...emptyStore() };
    delete legacy.journal;
    localStorage.setItem(STORE_KEY, JSON.stringify(legacy));
    expect(loadStore().journal).toEqual({});
  });

  it("saves, reads back, replaces, and removes a day's mark", () => {
    expect(saveJournalEntry("2026-09-10", "rang-true", "Signed the small thing.")).toBe(true);
    expect(loadJournalEntry("2026-09-10")).toMatchObject({ mark: "rang-true", note: "Signed the small thing." });

    saveJournalEntry("2026-09-10", "did-not-fit", "");
    expect(loadJournalEntry("2026-09-10")?.mark).toBe("did-not-fit");

    removeJournalEntry("2026-09-10");
    expect(loadJournalEntry("2026-09-10")).toBeNull();
  });

  it("trims a note to the maximum length", () => {
    saveJournalEntry("2026-09-10", "rang-true", "x".repeat(JOURNAL_NOTE_MAX + 40));
    expect(loadJournalEntry("2026-09-10")?.note).toHaveLength(JOURNAL_NOTE_MAX);
  });

  it("drops malformed entries and non-date keys on read instead of throwing", () => {
    const store = emptyStore();
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        ...store,
        journal: {
          "2026-09-10": { mark: "rang-true", note: "ok", updatedAt: "2026-09-10T00:00:00Z" },
          "not-a-date": { mark: "rang-true", note: "x", updatedAt: "2026-09-10T00:00:00Z" },
          "2026-09-11": { mark: "shrug", note: "x", updatedAt: "2026-09-10T00:00:00Z" },
          "2026-09-12": "garbage"
        }
      })
    );
    expect(Object.keys(loadStore().journal)).toEqual(["2026-09-10"]);
  });
});

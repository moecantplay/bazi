import { beforeEach, describe, expect, it } from "vitest";
import { importBackup } from "./backup";
import { DEFAULT_LOOK, STORE_KEY, emptyStore, loadLookPreference, loadStore, saveLookPreference } from "./store";
import { parseLookPreference } from "./store-types";

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

describe("look preference in the v2 store", () => {
  it("defaults to the trail look", () => {
    expect(DEFAULT_LOOK).toBe("trail");
    expect(emptyStore().look).toBe("trail");
    expect(loadLookPreference()).toBe("trail");
  });

  it("a v2 document written before looks existed reads with the default look", () => {
    const older: Record<string, unknown> = { ...emptyStore() };
    delete older.look;
    localStorage.setItem(STORE_KEY, JSON.stringify(older));

    expect(loadStore().look).toBe("trail");
  });

  it("an unknown stored look falls back to the default instead of throwing", () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...emptyStore(), look: "neon" }));

    expect(loadLookPreference()).toBe("trail");
  });

  it("saving a look persists it and leaves the rest of the document alone", () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...emptyStore(), theme: "dark" }));

    saveLookPreference("dial");

    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(stored.look).toBe("dial");
    expect(stored.theme).toBe("dark");
    expect(loadLookPreference()).toBe("dial");
  });

  it("a backup made before looks existed restores with the default look", () => {
    const store: Record<string, unknown> = { ...emptyStore() };
    delete store.look;
    const backup = { app: "daymaster", version: 2, exportedAt: new Date().toISOString(), store };

    expect(importBackup(JSON.stringify(backup))).toBe("ok");
    expect(loadLookPreference()).toBe("trail");
  });
});

describe("parseLookPreference", () => {
  it("accepts the three looks and rejects anything else", () => {
    expect(parseLookPreference("trail")).toBe("trail");
    expect(parseLookPreference("almanac")).toBe("almanac");
    expect(parseLookPreference("dial")).toBe("dial");
    expect(parseLookPreference("a")).toBeNull();
    expect(parseLookPreference(undefined)).toBeNull();
  });
});

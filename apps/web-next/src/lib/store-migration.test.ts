import { beforeEach, describe, expect, it } from "vitest";
import { STORE_KEY } from "./store";
import { migrateLegacyStore } from "./store-migration";
import type { StoredBirth, StoredProfile } from "./store-types";

/**
 * A minimal in-memory Storage so this test can run under plain Node (no
 * jsdom dependency) — store.ts and store-migration.ts only ever touch
 * `window.localStorage`/`window.sessionStorage`'s getItem/setItem/removeItem.
 */
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
let sessionStorage: FakeStorage;

beforeEach(() => {
  localStorage = new FakeStorage();
  sessionStorage = new FakeStorage();
  Object.assign(globalThis, { window: { localStorage, sessionStorage } });
});

const CITY = { name: "Singapore", country: "SG", lat: 1.29, lng: 103.85, tz: "Asia/Singapore" };

const OWNER_BIRTH: StoredBirth = { date: "1990-06-15", time: "08:30", city: CITY, sex: "male" };
const COMPANION_BIRTH: StoredBirth = { date: "1992-02-02", time: null, city: CITY, sex: "female" };

function seedProfile(withStrayHan: boolean): void {
  const profile: StoredProfile & { han?: string } = {
    birth: OWNER_BIRTH,
    config: { lateZiHour: "midnight", trueSolarTime: true },
    createdAt: "2026-01-01T00:00:00.000Z"
  };
  if (withStrayHan) {
    profile.han = "hide";
  }
  localStorage.setItem("daymaster.profile.v1", JSON.stringify(profile));
}

describe("migrateLegacyStore", () => {
  it("ingests every legacy key into one v2 document and deletes the legacy keys", () => {
    seedProfile(false);
    localStorage.setItem(
      "daymaster.people.v1",
      JSON.stringify([{ id: "p1", name: "Friend", birth: COMPANION_BIRTH }])
    );
    localStorage.setItem("daymaster.people-active.v1", "p1");
    localStorage.setItem("daymaster.theme.v1", "dark");

    const store = migrateLegacyStore();

    expect(store.app).toBe("daymaster");
    expect(store.version).toBe(2);
    expect(store.profile?.birth).toEqual(OWNER_BIRTH);
    expect(store.people).toEqual([{ id: "p1", name: "Friend", birth: COMPANION_BIRTH }]);
    expect(store.activePersonId).toBe("p1");
    expect(store.theme).toBe("dark");

    expect(localStorage.getItem("daymaster.profile.v1")).toBeNull();
    expect(localStorage.getItem("daymaster.people.v1")).toBeNull();
    expect(localStorage.getItem("daymaster.people-active.v1")).toBeNull();
    expect(localStorage.getItem("daymaster.theme.v1")).toBeNull();

    const persisted = localStorage.getItem(STORE_KEY);
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted!).profile.birth).toEqual(OWNER_BIRTH);
  });

  it("migrates a legacy compare.v1 companion into a person named Them and makes them active", () => {
    localStorage.setItem("daymaster.compare.v1", JSON.stringify(COMPANION_BIRTH));

    const store = migrateLegacyStore();

    expect(store.people).toHaveLength(1);
    expect(store.people[0]?.name).toBe("Them");
    expect(store.people[0]?.birth).toEqual(COMPANION_BIRTH);
    expect(store.activePersonId).toBe(store.people[0]?.id);
    expect(localStorage.getItem("daymaster.compare.v1")).toBeNull();
  });

  it("appends a migrated compare.v1 companion after any already-saved people", () => {
    localStorage.setItem(
      "daymaster.people.v1",
      JSON.stringify([{ id: "p1", name: "Friend", birth: COMPANION_BIRTH }])
    );
    localStorage.setItem("daymaster.compare.v1", JSON.stringify(OWNER_BIRTH));

    const store = migrateLegacyStore();

    expect(store.people).toHaveLength(2);
    expect(store.people[0]?.id).toBe("p1");
    expect(store.people[1]?.name).toBe("Them");
    expect(store.activePersonId).toBe(store.people[1]?.id);
  });

  it("silently drops a stray han field instead of crashing", () => {
    seedProfile(true);

    const store = migrateLegacyStore();

    expect(store.profile?.birth).toEqual(OWNER_BIRTH);
    expect(store.profile).not.toHaveProperty("han");
  });

  it("defaults to an empty document when no legacy key is present", () => {
    const store = migrateLegacyStore();

    expect(store.profile).toBeNull();
    expect(store.people).toEqual([]);
    expect(store.activePersonId).toBeNull();
    expect(store.theme).toBe("system");
  });

  it("never touches daymaster.streak.v1", () => {
    localStorage.setItem("daymaster.streak.v1", JSON.stringify({ count: 4, lastOpen: "2026-08-04" }));
    seedProfile(false);

    migrateLegacyStore();

    expect(localStorage.getItem("daymaster.streak.v1")).toBe(JSON.stringify({ count: 4, lastOpen: "2026-08-04" }));
  });

  it("is idempotent: a second call with an already-migrated store leaves it unchanged", () => {
    seedProfile(false);
    const first = migrateLegacyStore();

    localStorage.setItem("daymaster.profile.v1", JSON.stringify({ shouldNot: "be re-read" }));
    const second = migrateLegacyStore();

    expect(second).toEqual(first);
  });
});

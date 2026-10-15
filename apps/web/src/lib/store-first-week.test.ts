import { beforeEach, describe, expect, it } from "vitest";
import { importBackup, serializeBackup } from "./backup";
import { DEFAULT_LOOK, STORE_KEY, emptyStore, loadFirstWeek, loadStore, saveOnboardingResult, saveProfile, setFirstWeek } from "./store";
import type { StoredProfile } from "./store-types";
import { FakeStorage } from "./testing/fake-storage";

let localStorage: FakeStorage;

beforeEach(() => {
  localStorage = new FakeStorage();
  Object.assign(globalThis, { window: { localStorage, sessionStorage: new FakeStorage() } });
});

const PROFILE: StoredProfile = {
  birth: {
    date: "1994-12-08",
    time: "16:30",
    sex: "male",
    city: { name: "Jakarta", country: "Indonesia", lat: -6.2146, lng: 106.8451, tz: "Asia/Jakarta" }
  },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-10-15T01:00:00.000Z"
};

function writeRaw(firstWeek: unknown): void {
  localStorage.setItem(STORE_KEY, JSON.stringify({ ...emptyStore(), profile: PROFILE, firstWeek }));
}

describe("the first week in the v2 store (M24-10)", () => {
  it("a document written before the first week existed reads as finished", () => {
    const older: Record<string, unknown> = { ...emptyStore(), profile: PROFILE };
    delete older.firstWeek;
    localStorage.setItem(STORE_KEY, JSON.stringify(older));

    expect(loadFirstWeek()).toBeNull();
  });

  it("onboarding starts a first week", () => {
    saveOnboardingResult(PROFILE, DEFAULT_LOOK);
    expect(loadFirstWeek()).toEqual({ opened: [], noted: {} });
  });

  it("editing birth details keeps the week where it was", () => {
    saveOnboardingResult(PROFILE, DEFAULT_LOOK);
    setFirstWeek({ opened: ["2026-10-15", "2026-10-16"], noted: { hours: "2026-10-16" } });
    saveProfile({ ...PROFILE, birth: { ...PROFILE.birth, time: "17:30" } });

    expect(loadFirstWeek()).toEqual({ opened: ["2026-10-15", "2026-10-16"], noted: { hours: "2026-10-16" } });
  });

  it("a finished week is stored as null", () => {
    saveOnboardingResult(PROFILE, DEFAULT_LOOK);
    setFirstWeek(null);
    expect(loadFirstWeek()).toBeNull();
  });

  it("drops malformed values rather than throwing", () => {
    for (const bad of ["yes", 3, [], { opened: "2026-10-15", noted: {} }, { opened: [], noted: [] }, { opened: [7], noted: {} }]) {
      writeRaw(bad);
      expect(loadFirstWeek(), JSON.stringify(bad)).toBeNull();
    }
  });

  it("keeps only well-formed dates and known parts", () => {
    writeRaw({
      opened: ["2026-10-15", "yesterday", "2026-10-16"],
      noted: { hours: "2026-10-16", pace: "soon", "fortune-cookie": "2026-10-16" }
    });
    expect(loadFirstWeek()).toEqual({ opened: ["2026-10-15", "2026-10-16"], noted: { hours: "2026-10-16" } });
  });

  it("dedupes opened days and never keeps more than the week's seven", () => {
    const dates = Array.from({ length: 9 }, (_, index) => `2026-10-${String(15 + index).padStart(2, "0")}`);
    writeRaw({ opened: ["2026-10-15", ...dates], noted: {} });
    expect(loadFirstWeek()?.opened).toEqual(dates.slice(0, 7));
  });

  it("round-trips through a backup", () => {
    saveOnboardingResult(PROFILE, DEFAULT_LOOK);
    setFirstWeek({ opened: ["2026-10-15", "2026-10-16"], noted: { hours: "2026-10-16" } });
    const backup = serializeBackup();
    localStorage.removeItem(STORE_KEY);

    expect(importBackup(backup!)).toBe("ok");
    expect(loadStore().firstWeek).toEqual({ opened: ["2026-10-15", "2026-10-16"], noted: { hours: "2026-10-16" } });
  });
});

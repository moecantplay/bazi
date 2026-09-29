import { beforeEach, describe, expect, it } from "vitest";
import { importBackup } from "./backup";
import {
  DEFAULT_LOOK,
  STORE_KEY,
  answerLookIntro,
  emptyStore,
  loadLookPreference,
  loadStore,
  saveLookPreference,
  saveOnboardingResult,
  shouldShowLookIntro
} from "./store";
import type { StoredProfile } from "./store-types";
import { parseLookPreference } from "./store-types";
import { FakeStorage } from "./testing/fake-storage";

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

const PROFILE: StoredProfile = {
  birth: {
    date: "1994-12-08",
    time: "16:30",
    city: { name: "Jakarta", country: "Indonesia", lat: -6.2146, lng: 106.8451, tz: "Asia/Jakarta" },
    sex: "male"
  },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

describe("the one-time look note", () => {
  it("shows for a profile saved before looks existed", () => {
    const older: Record<string, unknown> = { ...emptyStore(), profile: PROFILE };
    delete older.look;
    delete older.lookPromptSeen;
    localStorage.setItem(STORE_KEY, JSON.stringify(older));

    expect(loadStore().lookPromptSeen).toBe(false);
    expect(shouldShowLookIntro()).toBe(true);
  });

  it("never shows without a profile", () => {
    expect(shouldShowLookIntro()).toBe(false);
  });

  it("never shows after onboarding, which saves the profile and the chosen look together", () => {
    expect(saveOnboardingResult(PROFILE, "almanac")).toBe(true);

    const stored = loadStore();
    expect(stored.profile?.birth.date).toBe("1994-12-08");
    expect(stored.look).toBe("almanac");
    expect(shouldShowLookIntro()).toBe(false);
  });

  it("answering it saves the look and retires it for good", () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...emptyStore(), profile: PROFILE, lookPromptSeen: false }));

    answerLookIntro("dial");

    expect(loadLookPreference()).toBe("dial");
    expect(shouldShowLookIntro()).toBe(false);
  });
});

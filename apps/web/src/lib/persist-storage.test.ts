import { describe, expect, it } from "vitest";
import { requestPersistentStorage, type PersistableStorage } from "./persist-storage";

function fakeManager(persisted: boolean, grant = true) {
  const calls = { persist: 0 };
  const manager: PersistableStorage = {
    persisted: async () => persisted,
    persist: async () => {
      calls.persist += 1;
      return grant;
    }
  };
  return { manager, calls };
}

describe("requestPersistentStorage", () => {
  it("asks when storage isn't persistent yet", async () => {
    const { manager, calls } = fakeManager(false);
    expect(await requestPersistentStorage(manager)).toBe(true);
    expect(calls.persist).toBe(1);
  });

  it("doesn't ask again once storage is persistent", async () => {
    const { manager, calls } = fakeManager(true);
    expect(await requestPersistentStorage(manager)).toBe(true);
    expect(calls.persist).toBe(0);
  });

  it("reports a refusal without throwing", async () => {
    const { manager } = fakeManager(false, false);
    expect(await requestPersistentStorage(manager)).toBe(false);
  });

  it("treats a rejected request as a refusal", async () => {
    const manager: PersistableStorage = {
      persisted: async () => false,
      persist: () => Promise.reject(new Error("denied"))
    };
    expect(await requestPersistentStorage(manager)).toBe(false);
  });

  it("skips browsers without the API", async () => {
    expect(await requestPersistentStorage(undefined)).toBe(false);
    expect(await requestPersistentStorage({} as PersistableStorage)).toBe(false);
  });
});

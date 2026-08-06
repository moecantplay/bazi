import { expect, test, type BrowserContext } from "@playwright/test";
import { FIXTURE_A, STORE_KEY } from "./helpers";

/**
 * Proves apps/web-next's one-time legacy migration (store-migration.ts)
 * actually fires when a real user loads the real app — the unit test in
 * store-migration.test.ts already proves the pure function's behavior in
 * isolation; this seeds apps/web's own six `daymaster.*.v1` keys straight
 * into localStorage before first navigation and drives the built export.
 */

const LEGACY_PROFILE_KEY = "daymaster.profile.v1";
const LEGACY_PEOPLE_KEY = "daymaster.people.v1";
const LEGACY_PEOPLE_ACTIVE_KEY = "daymaster.people-active.v1";
const LEGACY_COMPANION_KEY = "daymaster.compare.v1";
const LEGACY_THEME_KEY = "daymaster.theme.v1";
const STREAK_KEY = "daymaster.streak.v1";

const FRIEND_BIRTH = {
  date: "1992-02-02",
  time: null,
  city: FIXTURE_A.birth.city,
  sex: "female"
};

async function seedLegacyKeys(context: BrowserContext, entries: Record<string, unknown>): Promise<void> {
  await context.addInitScript((entriesJson: string) => {
    const values = JSON.parse(entriesJson) as Record<string, string>;
    for (const [key, value] of Object.entries(values)) {
      window.localStorage.setItem(key, value);
    }
  }, JSON.stringify(
    Object.fromEntries(
      Object.entries(entries).map(([key, value]) => [
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      ])
    )
  ));
}

test("migrates profile, saved people, active selection, and theme into store.v2, removing every legacy key", async ({
  page,
  context
}) => {
  await seedLegacyKeys(context, {
    [LEGACY_PROFILE_KEY]: FIXTURE_A,
    [LEGACY_PEOPLE_KEY]: [{ id: "friend-1", name: "Friend", birth: FRIEND_BIRTH }],
    [LEGACY_PEOPLE_ACTIVE_KEY]: "friend-1",
    [LEGACY_THEME_KEY]: "dark",
    [STREAK_KEY]: { count: 4, lastOpen: "2026-08-04" }
  });

  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  await expect(page.locator('[data-pillar="day"]')).toContainText("yang earth");
  // The pre-paint theme script falls back to the legacy key directly, ahead
  // of the client-side migration that runs a moment later.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const dump = await page.evaluate(
    ({ storeKey, legacyKeys, streakKey }) => ({
      store: window.localStorage.getItem(storeKey),
      legacy: legacyKeys.map((key) => window.localStorage.getItem(key)),
      streak: window.localStorage.getItem(streakKey)
    }),
    {
      storeKey: STORE_KEY,
      legacyKeys: [
        LEGACY_PROFILE_KEY,
        LEGACY_PEOPLE_KEY,
        LEGACY_PEOPLE_ACTIVE_KEY,
        LEGACY_COMPANION_KEY,
        LEGACY_THEME_KEY
      ],
      streakKey: STREAK_KEY
    }
  );

  const store = JSON.parse(dump.store!);
  expect(store.app).toBe("daymaster");
  expect(store.version).toBe(2);
  expect(store.profile.birth.date).toBe(FIXTURE_A.birth.date);
  expect(store.people).toEqual([{ id: "friend-1", name: "Friend", birth: FRIEND_BIRTH }]);
  expect(store.activePersonId).toBe("friend-1");
  expect(store.theme).toBe("dark");

  // Every legacy key is gone (daymaster.compare.v1 was never seeded here, so
  // it reads null both before and after — still worth asserting).
  expect(dump.legacy.every((value) => value === null)).toBe(true);

  // The streak is a permanent, separate carve-out (M19 decision C) and is
  // never read or removed by the migration.
  expect(dump.streak).toBe(JSON.stringify({ count: 4, lastOpen: "2026-08-04" }));
});

test("silently drops a stray retired field from a legacy shape instead of crashing", async ({
  page,
  context
}) => {
  const profileWithStrayField = { ...FIXTURE_A, han: "hide" };
  await seedLegacyKeys(context, { [LEGACY_PROFILE_KEY]: profileWithStrayField });

  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  await expect(page.locator('[data-pillar="day"]')).toContainText("yang earth");

  expect(pageErrors).toHaveLength(0);
  expect(consoleErrors).toHaveLength(0);

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY);
  const store = JSON.parse(stored!);
  expect(store.profile.birth.date).toBe(FIXTURE_A.birth.date);
  expect(store.profile).not.toHaveProperty("han");
});

test("a legacy compare.v1 companion (predating saved people) migrates into a person named Them and becomes active", async ({
  page,
  context
}) => {
  await seedLegacyKeys(context, {
    [LEGACY_PROFILE_KEY]: FIXTURE_A,
    [LEGACY_COMPANION_KEY]: FRIEND_BIRTH
  });

  await page.goto("/compare/");
  // Already active straight off the migration: the reading renders, not the picker.
  await expect(page.getByRole("heading", { name: "Them" })).toBeVisible();
  await expect(page.locator("[data-compare-reading]")).toBeVisible();

  // The saved-people picker also lists them by name.
  await page.getByRole("button", { name: "Change person" }).click();
  await expect(page.getByText("Saved people")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Them/ })).toBeVisible();

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY);
  const store = JSON.parse(stored!);
  expect(store.people).toHaveLength(1);
  expect(store.people[0].name).toBe("Them");
  const legacyCompanion = await page.evaluate(
    (key) => window.localStorage.getItem(key),
    LEGACY_COMPANION_KEY
  );
  expect(legacyCompanion).toBeNull();
});

test("a compare.v1 companion appends after already-saved people and outranks the legacy active selection", async ({
  page,
  context
}) => {
  await seedLegacyKeys(context, {
    [LEGACY_PROFILE_KEY]: FIXTURE_A,
    [LEGACY_PEOPLE_KEY]: [{ id: "friend-1", name: "Friend", birth: FRIEND_BIRTH }],
    [LEGACY_PEOPLE_ACTIVE_KEY]: "friend-1",
    [LEGACY_COMPANION_KEY]: FRIEND_BIRTH
  });

  await page.goto("/compare/");
  // The migrated compare.v1 companion (Them) becomes active, overriding the
  // legacy people-active.v1 pointer at Friend.
  await expect(page.getByRole("heading", { name: "Them" })).toBeVisible();

  // Read the store before "Change person" deliberately clears the active
  // selection (CompareView's own behavior, not part of migration).
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY);
  const store = JSON.parse(stored!);
  expect(store.people.map((person: { name: string }) => person.name)).toEqual(["Friend", "Them"]);
  expect(store.activePersonId).toBe(store.people[1].id);

  await page.getByRole("button", { name: "Change person" }).click();
  await expect(page.getByRole("button", { name: /^Friend/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Them/ })).toBeVisible();
});

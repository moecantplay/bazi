import { expect, test } from "@playwright/test";
import { FIXTURE_A, STORE_KEY, completeOnboarding, pinClock, seedStore } from "./helpers";

const TODAY = "2026-07-07";
const ROUTE = 'svg[aria-label^="Today\'s route"]';
const DIAL = 'svg[aria-label^="Today\'s hours"]';

async function storedLook(page: import("@playwright/test").Page): Promise<unknown> {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "{}").look, STORE_KEY);
}

test("onboarding: the look chosen before the reveal is saved and Today opens in it, with no note", async ({ page, context }) => {
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await completeOnboarding(page, "Instrument");

  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeAttached();
  await expect(page.locator(`main ${DIAL}`)).toBeVisible();
  expect(await storedLook(page)).toBe("dial");
  await expect(page.locator("[data-look-intro]")).toHaveCount(0);
});

test("onboarding: choosing Editorial opens Today as the printed page", async ({ page, context }) => {
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await completeOnboarding(page, "Editorial");
  await expect(page.getByText(/^Day 188 of the year$/)).toBeVisible();
  expect(await storedLook(page)).toBe("almanac");
});

test("settings: tapping a look switches Today without a reload", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail" });
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/settings/");

  const instrument = page.getByRole("radio", { name: /^Instrument/ });
  await instrument.click();
  await expect(instrument).toHaveAttribute("aria-checked", "true");
  expect(await storedLook(page)).toBe("dial");

  await page.getByRole("link", { name: "Today" }).click();
  await expect(page.locator(`main ${DIAL}`).first()).toBeVisible();
});

test("existing readers are told once, and keeping the look retires the note", async ({ page, context }) => {
  // A store from before looks existed: no `look`, no `lookPromptSeen`.
  await context.addInitScript(
    ([key, profile]) => {
      if (window.localStorage.getItem(key) !== null) {
        return;
      }
      const store = { app: "daymaster", version: 2, updatedAt: new Date().toISOString(), profile, people: [], activePersonId: null, theme: "system" };
      window.localStorage.setItem(key, JSON.stringify(store));
    },
    [STORE_KEY, FIXTURE_A] as const
  );
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  const note = page.locator("[data-look-intro]");
  await expect(note.getByRole("heading", { name: "Your day, three ways" })).toBeVisible();
  await note.getByRole("button", { name: "Keep Explorer", exact: true }).click();
  await expect(note).toHaveCount(0);

  await page.reload();
  await expect(page.locator(`main ${ROUTE}`).first()).toBeVisible();
  await expect(note).toHaveCount(0);
});

test("existing readers can pick another look from the note", async ({ page, context }) => {
  await context.addInitScript(
    ([key, profile]) => {
      if (window.localStorage.getItem(key) !== null) {
        return;
      }
      const store = { app: "daymaster", version: 2, updatedAt: new Date().toISOString(), profile, people: [], activePersonId: null, theme: "system" };
      window.localStorage.setItem(key, JSON.stringify(store));
    },
    [STORE_KEY, FIXTURE_A] as const
  );
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  const note = page.locator("[data-look-intro]");
  await note.getByRole("radio", { name: /^Editorial/ }).click();
  await expect(note.getByRole("button", { name: "Not now, keep Explorer", exact: true })).toBeVisible();
  await note.getByRole("button", { name: "Use Editorial", exact: true }).click();

  await expect(note).toHaveCount(0);
  await expect(page.getByText(/^Day 188 of the year$/)).toBeVisible();
  expect(await storedLook(page)).toBe("almanac");
});

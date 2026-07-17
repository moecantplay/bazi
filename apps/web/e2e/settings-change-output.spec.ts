import { expect, test } from "@playwright/test";
import { FIXTURE_LATE_ZI, PROFILE_KEY, pinClock, seedProfile } from "./helpers";

async function dayPillarText(page: import("@playwright/test").Page): Promise<string> {
  const chars = await page.locator('[data-pillar="day"] .font-han').allInnerTexts();
  return chars.join("");
}

test("late-Zi toggle changes the day pillar, and delete clears the profile", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_LATE_ZI);
  await pinClock(context, "2026-07-07T09:00:00Z");
  // Opt into Han characters: the day-pillar diff below reads .font-han glyphs.
  await context.addInitScript(() => {
    window.localStorage.setItem("daymaster.han.v1", "show");
  });

  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  const before = await dayPillarText(page);
  expect(before.length).toBeGreaterThan(0);

  // Flip the late-Zi rule in settings (a 23:30 birth shifts to the next day).
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await page.getByRole("switch", { name: /Shift late-night births/ }).click();

  // Back on the chart, the day pillar has changed.
  await page.getByRole("link", { name: "Chart" }).click();
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  const after = await dayPillarText(page);
  expect(after).not.toBe(before);

  // Delete my data: confirm, land back on onboarding, storage cleared.
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete my data" }).click();
  await page.getByRole("button", { name: "Delete my data" }).last().click();

  await expect(page.getByText("When were you born?")).toBeVisible();
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), PROFILE_KEY);
  expect(stored).toBeNull();
});

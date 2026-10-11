import { expect, test } from "@playwright/test";
import { FIXTURE_A, FIXTURE_LATE_ZI, pinClock, seedProfile, STORE_KEY } from "./helpers";

// The Day column's stem and branch glosses ("yang wood", "rat", ...): a
// late-Zi shift moves the day pillar, so this text changes with the rule.
async function dayPillarText(page: import("@playwright/test").Page): Promise<string> {
  return page.locator('[data-pillar="day"]').innerText();
}

/**
 * From Settings to the full chart in-app (You, then "Your chart in full"). A
 * full page load would re-run the seed script and undo the setting just made.
 */
async function openChartInApp(page: import("@playwright/test").Page): Promise<void> {
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "You", exact: true }).click();
  await page.getByRole("link", { name: /Your chart in full/ }).click();
  await expect(page.getByRole("heading", { name: "Your chart in full", exact: true })).toBeVisible();
}

test("late-Zi toggle changes the day pillar, and delete clears the profile", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_LATE_ZI);
  await pinClock(context, "2026-07-07T09:00:00Z");

  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Your chart in full", exact: true })).toBeVisible();
  const before = await dayPillarText(page);
  expect(before.length).toBeGreaterThan(0);

  // Flip the late-Zi rule in settings (a 23:30 birth shifts to the next day).
  await page.goto("/settings/");
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  // Arrived by a full load (Settings is no longer a tab): wait for hydration before the tap.
  await page.waitForLoadState("networkidle");
  const lateZi = page.getByRole("switch", { name: /Shift late-night births/ });
  await lateZi.click();
  await expect(lateZi).toBeChecked();

  // Back on the chart, the day pillar has changed.
  await openChartInApp(page);
  const after = await dayPillarText(page);
  expect(after).not.toBe(before);

  // Delete my data: confirm, land back on onboarding, storage cleared.
  await page.getByRole("link", { name: "You", exact: true }).click();
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete my data" }).click();
  await page.getByRole("button", { name: "Delete my data" }).last().click();

  await expect(page.getByText("When were you born?")).toBeVisible();
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY);
  expect(stored).toBeNull();
});

/**
 * True solar time loads on demand (M19.8-08): a chart stored with it on, or
 * switched on in Settings, must still open on every screen that computes it.
 */
test("a chart with true solar time on opens everywhere", async ({ page, context }) => {
  await seedProfile(context, { ...FIXTURE_A, config: { ...FIXTURE_A.config, trueSolarTime: true } });

  for (const path of ["/today/", "/ahead/", "/you/", "/people/", "/chart/", "/cycles/", "/compare/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("This screen didn’t open"), path).toHaveCount(0);
  }
  await page.goto("/chart/");
  await expect(page.locator('[data-pillar="day"]')).toContainText("yang earth");
});

test("switching true solar time on in Settings, then opening the chart", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/settings/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("switch", { name: "Use true solar time" }).click();
  await openChartInApp(page);

  await expect(page.locator('[data-pillar="day"]')).toContainText("yang earth");
  await expect(page.getByText("This screen didn’t open")).toHaveCount(0);
});

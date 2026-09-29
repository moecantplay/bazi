import { expect, test, type Page } from "@playwright/test";
import { E2E_LOOK, FIXTURE_A, STORE_KEY } from "./helpers";

/**
 * A screen that throws while rendering shows the recovery screen, never Next's
 * bare "Application error" (M19.8-01). The damaged store is written once from
 * a page that doesn't read it, not via addInitScript, so "Start over" can be
 * seen to actually clear it.
 */

const DAMAGED_BIRTHS = {
  "a birth past the engine's range": { ...FIXTURE_A.birth, date: "2150-01-01" },
  "an unknown time zone": { ...FIXTURE_A.birth, city: { ...FIXTURE_A.birth.city, tz: "Mars/Olympus" } }
};

async function seedDamagedStore(page: Page, birth: unknown): Promise<void> {
  await page.goto("/onboarding/");
  await page.evaluate(
    ([key, profile, look]) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          app: "daymaster",
          version: 2,
          updatedAt: "2026-09-29T00:00:00.000Z",
          profile: JSON.parse(profile),
          people: [],
          activePersonId: null,
          theme: "system",
          journal: {},
          look,
          lookPromptSeen: true
        })
      );
    },
    [STORE_KEY, JSON.stringify({ ...FIXTURE_A, birth }), E2E_LOOK] as const
  );
}

for (const [label, birth] of Object.entries(DAMAGED_BIRTHS)) {
  test(`a stored profile with ${label} shows the recovery screen`, async ({ page }) => {
    await seedDamagedStore(page, birth);
    await page.goto("/today/");

    await expect(page.getByRole("heading", { name: "This screen didn’t open" })).toBeVisible();
    await expect(page.getByText("Your chart is still on this device.")).toBeVisible();
    await expect(page.getByText("Application error")).toHaveCount(0);
  });
}

test("the recovery screen downloads the backup", async ({ page }) => {
  await seedDamagedStore(page, DAMAGED_BIRTHS["a birth past the engine's range"]);
  await page.goto("/today/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download my data" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("daymaster-backup.json");
});

test("start over clears everything and lands on onboarding", async ({ page }) => {
  await seedDamagedStore(page, DAMAGED_BIRTHS["an unknown time zone"]);
  await page.goto("/chart/");

  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByText("This erases your chart")).toBeVisible();
  await page.getByRole("button", { name: "Erase and start over" }).click();

  await expect(page).toHaveURL(/\/onboarding\/?$/);
  await expect(page.getByRole("heading", { name: "When were you born?" })).toBeVisible();
  expect(await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY)).toBeNull();
});

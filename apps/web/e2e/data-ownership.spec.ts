import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

test("edit birth details recomputes the chart without touching other settings", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/settings/");
  await page.getByRole("button", { name: "Edit birth details" }).click();

  // Prefilled from the profile; move the date one day later.
  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toHaveValue("1994-12-08");
  await dateInput.fill("1994-12-09");
  await page.getByRole("button", { name: "Next" }).click();

  // Time, city, and sex are already right — step through.
  await expect(page.locator('input[type="time"]')).toHaveValue("16:30");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  // Confirm shows the recomputed chart; the day after 戊辰 (yang earth) is
  // 己巳 (yin earth) — asserted via the gloss, the English-first default.
  await expect(page.getByText("Here’s the updated chart.")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/chart\/?$/);
  await expect(page.locator('[data-pillar="day"]')).toContainText("yin earth");
});

test("backup downloads and restores the whole chart on a fresh start", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/settings/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download my data" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("daymaster-backup.json");

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const backup = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  expect(backup.app).toBe("daymaster");
  expect(backup.profile.birth.date).toBe("1994-12-08");

  // Wipe everything, then restore from the file on the onboarding screen.
  await page.getByRole("button", { name: "Delete my data" }).click();
  await page.getByRole("button", { name: "Delete my data" }).click();
  await expect(page).toHaveURL(/\/onboarding\/?$/);

  await page.locator('input[type="file"]').setInputFiles({
    name: "daymaster-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup))
  });
  await expect(page).toHaveURL(/\/today\/?$/);
  await expect(page.locator("[data-reading-body]")).toBeVisible();
});

test("an onboarding refresh resumes on the same step with answers kept", async ({ page }) => {
  await page.goto("/onboarding/");
  await page.locator('input[type="date"]').fill("1994-12-08");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("What time?")).toBeVisible();

  await page.reload();
  await expect(page.getByText("What time?")).toBeVisible();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.locator('input[type="date"]')).toHaveValue("1994-12-08");
});

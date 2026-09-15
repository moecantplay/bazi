import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * /conditions/: Today arranged with a weather app's rhythm. Pinned to
 * 2026-09-10 17:07 Asia/Jakarta (10:07Z), a 丁亥 Full day for Fixture A whose
 * rough hour is the snake (9–11 am) and easy hour the tiger (3–5 am); the
 * current block at 17:07 is the rooster.
 */
const TODAY = "2026-09-10";

test("conditions screen reads the day as officer, hours and ten days", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T10:07:00Z`);

  await page.goto("/settings/");
  await page.getByRole("link", { name: "Open Conditions" }).click();
  await expect(page.getByRole("heading", { name: "Conditions", exact: true })).toBeVisible();

  // Conditions hero: the officer is the condition, the day's stem and animal beneath.
  const hero = page.locator("[data-conditions-hero]");
  await expect(hero.locator("[data-condition]")).toHaveText("Full");
  await expect(hero).toContainText("yin fire · pig day");
  await expect(hero).toContainText("A Full day: the cup filled to the brim");
  await expect(hero.getByRole("list", { name: "What leans today" }).getByRole("listitem")).toHaveCount(3);

  // Hours strip: twelve blocks, rough/easy marked, the rooster block is now.
  const strip = page.locator("[data-hours-strip]");
  await expect(strip.locator("[data-hour-block]")).toHaveCount(12);
  await expect(strip.locator('[data-hour-mark="rough"]')).toHaveAttribute("data-hour-block", "snake");
  await expect(strip.locator('[data-hour-mark="easy"]')).toHaveAttribute("data-hour-block", "tiger");
  await expect(strip.locator('[aria-current="time"]')).toHaveAttribute("data-hour-block", "rooster");

  // Ten-day list: ten rows, today pressed; picking tomorrow reloads the hero.
  const rows = page.locator("[data-ten-days]").getByRole("button");
  await expect(rows).toHaveCount(10);
  await expect(rows.nth(0)).toHaveAttribute("aria-pressed", "true");
  await rows.nth(1).click();
  await expect(hero.locator("[data-condition]")).toHaveText("Balance");
  await expect(rows.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(strip.locator('[aria-current="time"]')).toHaveCount(0);

  // The reading is still there, behind its fold.
  await page.getByRole("button", { name: "Back to today" }).click();
  await page.getByRole("button", { name: "Read the day · the full reading" }).click();
  await expect(page.locator("[data-reading-body] [data-fact-tag]").first()).toBeVisible();
});

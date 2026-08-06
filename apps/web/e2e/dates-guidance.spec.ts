import { expect, test } from "@playwright/test";
import { addDays, FIXTURE_A, longDate, pinClock, seedCompanion, seedProfile } from "./helpers";

const TODAY = "2026-07-07";

/** The twelve day-officer English names; the top result names one of them. */
const OFFICER_NAMES =
  /Establish|Remove|Full|Balance|Stable|Hold|Break|Danger|Success|Receive|Open|Close/;

test("Today shows the guidance chips and a cited guidance line", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/today/");
  // The headline hook opens the screen in display type.
  await expect(page.locator("[data-headline]")).toBeVisible();
  await expect(page.locator("[data-headline]")).not.toBeEmpty();

  const guidance = page.locator("[data-guidance]");
  await expect(guidance).toBeVisible();
  // Both trail-sign tiles (renamed from Favors/Watch — DESIGN.md's Trail
  // rollout, still rule-12 postponement-not-prohibition) with a fact-tagged
  // prose line beneath them.
  await expect(guidance.getByText(/^Clear trail$/)).toBeVisible();
  await expect(guidance.getByText(/^Take it slow$/)).toBeVisible();
  await expect(guidance.locator("[data-fact-tag]").first()).toBeVisible();
});

test("the elevation profile jumps the reading to the tapped day", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  // The datebar's own date button carries "jump to a date" in its accessible
  // name (Datebar's aria-label, unchanged); the elevation-profile's per-day
  // points also carry the long date in theirs, so this disambiguates the two
  // once both show the same date after the jump below.
  const dateButton = (iso: string) => page.getByRole("button", { name: new RegExp(`${longDate(iso)}.*jump to a date`) });

  await page.goto("/today/");
  // The datebar opens on today; tapping a later elevation-profile day-point
  // moves the reading.
  await expect(dateButton(TODAY)).toBeVisible();
  const target = addDays(TODAY, 2);
  await page.getByRole("button", { name: new RegExp(longDate(target)) }).click();
  await expect(dateButton(target)).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to today" })).toBeVisible();
});

test("Cycles shows this year's 丙午 outlook for the pinned clock", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/cycles/");
  const year = page.locator('[data-horizon="year"]');
  await expect(year.getByRole("heading", { name: "This year" })).toBeVisible();
  await expect(year.getByText("yang fire · horse")).toBeVisible();
});

test("the date finder ranks days and names the top officer", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/dates/");
  // Pick "marriage and betrothal" (commit) by its radio, then run the default range.
  await page.locator('label:has(input[value="commit"])').click();
  await page.getByRole("button", { name: "Find days" }).click();

  const rows = page.locator("[data-date-results] > li");
  await expect(rows.first()).toBeVisible();
  await expect(rows.first()).toContainText(OFFICER_NAMES);
  // Just me: one leaning swatch per row.
  await expect(rows.first().locator("[data-leaning-swatches] > div")).toHaveCount(1);
});

test("the date finder shows a swatch per chart with a saved person", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await seedCompanion(context, FIXTURE_A.birth);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/dates/");
  await page.locator('label:has(input[value="commit"])').click();
  await page.getByRole("button", { name: "Find days" }).click();

  const rows = page.locator("[data-date-results] > li");
  await expect(rows.first()).toBeVisible();
  // You plus the seeded person: two tinted cells per row.
  await expect(rows.first().locator("[data-leaning-swatches] > div")).toHaveCount(2);
});

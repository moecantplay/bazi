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
  // Both board columns with a fact-tagged prose line beneath them.
  await expect(guidance.getByText(/^Favors$/)).toBeVisible();
  await expect(guidance.getByText(/^Watch$/)).toBeVisible();
  await expect(guidance.locator("[data-fact-tag]").first()).toBeVisible();

  // Every modelled activity gets a gauge row; tapping one unfolds its cited line.
  const rows = page.locator("[data-areas] li");
  await expect(rows).toHaveCount(10);
  await rows.first().getByRole("button").click();
  await expect(page.locator("[data-areas] [data-fact-tag]").first()).toBeVisible();
});

test("the week strip jumps the reading to the tapped day", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/today/");
  // The header opens on today; tapping a later cell moves the reading to it.
  await expect(page.getByText(longDate(TODAY))).toBeVisible();
  const target = addDays(TODAY, 2);
  await page.getByRole("button", { name: new RegExp(longDate(target)) }).click();
  await expect(page.getByText(longDate(target))).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to today" })).toBeVisible();
});

test("Cycles shows this year's 丙午 outlook for the pinned clock", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/cycles/");
  const year = page.locator('[data-horizon="year"]');
  await expect(year.getByRole("heading", { name: "This year" })).toBeVisible();
  await expect(year.getByText("丙午")).toBeVisible();
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

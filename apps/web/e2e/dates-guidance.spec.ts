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
  // The two trail-sign tiles (Clear trail / Take it slow — rule-12
  // postponement, never prohibition) with a fact-tagged prose line beneath.
  await expect(guidance.getByText(/^Clear trail$/)).toBeVisible();
  await expect(guidance.getByText(/^Take it slow$/)).toBeVisible();
  await expect(guidance.locator("[data-fact-tag]").first()).toBeVisible();
});

test("the elevation profile jumps the reading to the tapped day", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  // The datebar's own date button carries "jump to a date" in its accessible
  // name (Datebar's aria-label); the elevation-profile's per-day points also
  // carry the long date in theirs, so this disambiguates the two once both
  // show the same date after the jump below.
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

test("Cycles opens on the current decade, with this year's 丙午 outlook already showing", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/cycles/");
  await expect(page.locator("[data-luck-current]")).toBeVisible();
  const year = page.locator('[data-horizon="year"]');
  await expect(year.getByRole("heading", { name: "2026", exact: true })).toBeVisible();
  await expect(year.getByText("yang fire · horse")).toBeVisible();
});

test("the luck timeline opens on the current decade/year/month, and every pillar is browsable via swipe or tap", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  await page.goto("/cycles/");
  const currentCard = page.locator("[data-luck-current]");
  await expect(currentCard).toBeVisible();

  // Fixture A's current decade (己卯, age 29-38) is already active on load,
  // its own theme/element/transit lines showing without any tap — as is the
  // real current year (2026) and month (July) beneath it.
  const reading = page.locator("[data-luck-reading]");
  await expect(reading).toBeVisible();
  await expect(reading).toContainText("An Earth decade, and Earth tends to suit you");
  await expect(reading).toContainText("friendly rivalry");
  await expect(reading).toContainText("This decade rubs at your career palace");
  await expect(
    page.locator('[data-horizon="year"]').getByRole("heading", { name: "2026", exact: true })
  ).toBeVisible();
  await expect(
    page.locator('[data-horizon="month"]').getByRole("heading", { name: "July 2026" })
  ).toBeVisible();

  // Every decade is reachable, not just the current one — there's no
  // expand/collapse left, just re-selection: tapping another decade card
  // makes it the active one and its reading replaces the current decade's.
  const decadeCards = page.locator("[data-luck-decade-card]");
  await expect(decadeCards).toHaveCount(8);
  const fourth = decadeCards.nth(3);
  await fourth.click();
  await expect(fourth).toHaveAttribute("data-carousel-active", "");
  await expect(reading).toContainText("A Metal decade");

  // Fourth decade (庚辰, age 39-48, 2034-2043) isn't the real current one, so
  // its year/month default to the decade's own start rather than "now" —
  // picking a year within it reads that year, and a month within that reads
  // that month.
  await expect(
    page.locator('[data-horizon="year"]').getByRole("heading", { name: "2034", exact: true })
  ).toBeVisible();

  await page.getByText("2036", { exact: true }).click();
  await expect(
    page.locator('[data-horizon="year"]').getByRole("heading", { name: "2036", exact: true })
  ).toBeVisible();

  await page.locator("[data-month-picker]").getByText("Mar", { exact: true }).click();
  await expect(
    page.locator('[data-horizon="month"]').getByRole("heading", { name: "March 2036" })
  ).toBeVisible();
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

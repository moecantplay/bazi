import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * Reshape trial: four tabs (Today · Ahead · You · People), Settings behind
 * the header control, nothing linking to Conditions, and each new tab's
 * plain reading.
 */
const TODAY = "2026-10-05";

test("the four tabs and the Settings control navigate", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link")).toHaveText(["Today", "Ahead", "You", "People"]);

  for (const [tab, heading] of [
    ["Ahead", "Ahead"],
    ["You", "You"],
    ["People", "People"],
    ["Today", "Today"]
  ] as const) {
    await nav.getByRole("link", { name: tab, exact: true }).click();
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeAttached();
    await expect(page.locator('a[href^="/conditions"]')).toHaveCount(0);
  }

  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await expect(page.locator('a[href^="/conditions"]')).toHaveCount(0);
  await expect(page.getByText("Look for Today")).toBeVisible();
});

test("Ahead plans something, then reads a month, a year and a decade one at a time", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/ahead/");

  // No single-day lists: days belong to Today.
  await expect(page.getByLabel("The next ten days")).toHaveCount(0);
  await expect(page.getByLabel("Plan something").getByRole("link")).toHaveCount(11);

  // Seasons lead; Plan something closes the screen.
  const order = await page.evaluate(() => {
    const seasons = document.querySelector('[aria-label="Your seasons"]');
    const plan = document.querySelector('[aria-label="Plan something"]');
    return seasons && plan ? seasons.compareDocumentPosition(plan) & Node.DOCUMENT_POSITION_FOLLOWING : 0;
  });
  expect(order).toBeTruthy();

  for (const [zoom, kicker, action] of [
    ["Month", "October 2026", "One thing this month"],
    ["Year", "2026", "One thing this year"],
    ["Decade", "Ages 29–38 · 2024–2033", "One thing this decade"]
  ] as const) {
    await page.getByRole("radio", { name: zoom }).click();
    const lead = page.getByLabel(kicker, { exact: true });
    await expect(lead.getByRole("heading")).toBeVisible();
    await expect(lead.getByText(action)).toBeVisible();
  }
});

test("Ahead opens Find a day already searching, and moves through the seasons", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/ahead/");

  // A plan chip opens Find a day with that activity chosen and the days ranked.
  await page.getByLabel("Plan something").getByRole("link", { name: "Moving" }).click();
  await expect(page).toHaveURL(/\/dates\/\?activity=move/);
  await expect(page.locator("[data-date-results]")).toBeVisible();
  await page.goBack();

  // Decade → a year in it → a month of that year.
  await page.getByRole("radio", { name: "Decade" }).click();
  await expect(page.getByLabel("Year by year").getByRole("button")).toHaveCount(10);
  await page.getByLabel("Year by year").getByRole("button", { name: /^2027/ }).click();
  await expect(page.getByLabel("2027", { exact: true }).getByRole("heading")).toBeVisible();
  await page.getByLabel("Month by month").getByRole("button", { name: /^Mar/ }).click();
  await expect(page.getByLabel("March 2027", { exact: true }).getByRole("heading")).toBeVisible();
  await expect(page.getByRole("button", { name: "Mar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Next month")).toBeVisible();

  // Any year of the reader's life can be picked directly.
  await page.getByRole("radio", { name: "Year" }).click();
  const years = page.getByLabel("Pick a year");
  await expect(years.getByRole("button", { name: "2027" })).toHaveAttribute("aria-pressed", "true");
  await years.getByRole("button", { name: "2040" }).click();
  await expect(page.getByLabel("2040", { exact: true }).getByRole("heading")).toBeVisible();
  await expect(years.getByRole("button", { name: "2040" })).toHaveAttribute("aria-pressed", "true");
});

test("You leads with the portrait and opens the full chart", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await page.goto("/you/");

  await expect(page.getByRole("heading", { name: "You are the mountain: slow to move, impossible to ignore." })).toBeVisible();
  await expect(page.getByText("Better in good company")).toBeVisible();
  await page.getByRole("link", { name: /Your chart in full/ }).click();
  await expect(page.getByRole("heading", { name: "Your chart in full", exact: true })).toBeVisible();
});

test("People adds someone and reads the pair in plain words", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await page.goto("/people/");

  await page.getByLabel("Their name").fill("Ana");
  await page.getByLabel("Their birth date").fill("1994-02-03");
  await page.getByLabel("Their birth time").fill("12:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Female" }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();

  const lead = page.getByLabel("You and Ana");
  await expect(lead.getByRole("heading")).toBeVisible();
  await expect(lead.getByText("One thing to try")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add someone" })).toBeVisible();
  await page.getByRole("link", { name: /The full comparison/ }).click();
  await expect(page.getByRole("heading", { name: "The full comparison", exact: true })).toBeVisible();
});

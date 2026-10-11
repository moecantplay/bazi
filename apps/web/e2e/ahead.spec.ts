import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/** M24-07: Ahead — your seasons first, Plan something last; single days belong to Today. */
const TODAY = "2026-10-05";

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

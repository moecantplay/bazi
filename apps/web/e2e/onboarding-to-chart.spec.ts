import { expect, test } from "@playwright/test";
import { pinClock, startOnboarding } from "./helpers";

// Fixture A pillars 甲戌 丙子 戊辰 庚申 as their English-first glosses, keyed by
// column so the assertions target visible grid text (icon tooltips share the
// same words as hidden SVG <title> nodes).
const PILLAR_WORDS: Array<[pillar: string, words: string[]]> = [
  ["year", ["yang wood", "dog"]],
  ["month", ["yang fire", "rat"]],
  ["day", ["yang earth", "dragon"]],
  ["hour", ["yang metal", "monkey"]]
];

test("full onboarding for fixture A saves a chart that reads correctly", async ({
  page,
  context
}) => {
  await pinClock(context, "2026-07-07T09:00:00Z");
  await page.goto("/onboarding/");

  // Welcome: a chart-free sample of today, before anything is asked.
  await expect(page.getByRole("heading", { name: /How today is likely to go/ })).toBeVisible();
  await expect(page.getByLabel("Today, for anyone")).toBeVisible();
  await page.getByRole("button", { name: "Get my reading" }).click();

  // Date.
  await expect(page.getByText("When were you born?")).toBeVisible();
  await page.fill('input[type="date"]', "1994-12-08");
  await page.getByRole("button", { name: "Next" }).click();

  // Time.
  await expect(page.getByText("What time?")).toBeVisible();
  await page.fill('input[type="time"]', "16:30");
  await page.getByRole("button", { name: "Next" }).click();

  // City.
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("button", { name: /Jakarta/ }).first().click();
  await expect(page.getByRole("combobox")).toHaveValue(/Jakarta, Indonesia/);
  await page.getByRole("button", { name: "Next" }).click();

  // Sex and the disclaimer on one step; the acknowledgment gates the action.
  await page.getByRole("radio", { name: "Male", exact: true }).click();
  const show = page.getByRole("button", { name: "Show my day" });
  await expect(show).toBeDisabled();
  await expect(page.getByText(/You remain the author\./)).toBeVisible();
  await page.getByRole("checkbox").check();
  await show.click();

  // Straight to Today: no look step, no reveal.
  await expect(page).toHaveURL(/\/today\/?$/);
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeAttached();
  // The first day carries a one-line welcome (M24-06).
  await expect(page.locator("[data-first-day]")).toBeVisible();

  // The full chart is behind You, and reads correctly.
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "You", exact: true }).click();
  await page.getByRole("link", { name: /Your chart in full/ }).click();
  await expect(page.getByRole("heading", { name: "Your chart in full", exact: true })).toBeVisible();

  for (const [pillar, words] of PILLAR_WORDS) {
    for (const word of words) {
      await expect(page.locator(`[data-pillar="${pillar}"]`)).toContainText(word);
    }
  }
  await expect(page.getByText(/Eating God/).first()).toBeVisible();

  // Structure lines live behind their collapsed heading.
  await page.getByText(/Your chart's structure/).click();
  await expect(page.locator("body")).toContainText(/trine/i);
});

test("refreshing mid-onboarding restores the step without a hydration error", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await startOnboarding(page);
  await page.fill('input[type="date"]', "1994-12-08");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.fill('input[type="time"]', "16:30");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Where were you born?")).toBeVisible();

  // The draft lives in session storage; a reload must land on the same
  // step, and the server-rendered HTML must hydrate cleanly first.
  await page.reload();
  await expect(page.getByText("Where were you born?")).toBeVisible();
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await expect(page.getByRole("button", { name: /Jakarta/ }).first()).toBeVisible();
  expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});

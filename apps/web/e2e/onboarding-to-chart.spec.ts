import { expect, test } from "@playwright/test";
import { pinClock } from "./helpers";

const PILLAR_CHARS = ["甲", "戌", "丙", "子", "戊", "辰", "庚", "申"];

test("full onboarding for fixture A saves a chart that reads correctly", async ({
  page,
  context
}) => {
  await pinClock(context, "2026-07-07T09:00:00Z");
  await page.goto("/onboarding/");

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
  await expect(page.getByText(/Selected:/)).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();

  // Sex.
  await page.getByRole("radio", { name: "Male", exact: true }).click();
  await page.getByRole("button", { name: "Next" }).click();

  // Disclaimer: scroll to the end, then acknowledge.
  await expect(page.getByText("Before your chart")).toBeVisible();
  await page
    .locator(".overflow-y-auto")
    .first()
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
  const acknowledge = page.getByRole("checkbox");
  await expect(acknowledge).toBeEnabled();
  await acknowledge.check();
  await page.getByRole("button", { name: "Show my chart" }).click();

  // Reveal, then save.
  await expect(page.getByText("Here is your chart.")).toBeVisible();
  await page.getByRole("button", { name: "Save chart" }).click();
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();

  // Open the chart and verify its content.
  await page.getByRole("link", { name: "Chart" }).click();
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();

  for (const char of PILLAR_CHARS) {
    await expect(page.getByText(char).first()).toBeVisible();
  }
  await expect(page.locator("body")).toContainText(/trine/i);
  await expect(page.getByText(/Eating God/).first()).toBeVisible();
});

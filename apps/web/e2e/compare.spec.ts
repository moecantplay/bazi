import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

const COMPARE_KEY = "daymaster.compare.v1";

test("compare flow: enter a second person, read the pair, change person", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/compare/");
  await expect(page.getByRole("heading", { name: "Compare", exact: true })).toBeVisible();

  // Fill the second person's details (day-pillar anchor date: 甲子 day).
  await page.getByLabel("Their birth date").fill("1949-10-01");
  await page.getByLabel("Their birth time").fill("12:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Female" }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();

  // Both pillar sets render; the reading cites facts, day-masters first.
  await expect(page.getByText("You", { exact: true })).toBeVisible();
  await expect(page.getByText("Them", { exact: true })).toBeVisible();
  const reading = page.locator("[data-compare-reading]");
  await expect(reading.locator("[data-fact-tag]").first()).toBeVisible();
  await expect(reading.locator("[data-fact-tag]").first()).toContainText("day-masters");

  // Persisted: a reload lands on the reading, not the form.
  await page.reload();
  await expect(page.locator("[data-compare-reading]")).toBeVisible();

  // Change person returns to the form and clears storage.
  await page.getByRole("button", { name: "Change person" }).click();
  await expect(page.getByRole("button", { name: "Read the pair" })).toBeVisible();
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), COMPARE_KEY);
  expect(stored).toBeNull();
});

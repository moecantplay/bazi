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

test("Ahead reads ten days, then a month, a year and a decade one at a time", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/ahead/");

  await expect(page.getByLabel("The next ten days").getByRole("listitem")).toHaveCount(10);
  await expect(page.getByRole("link", { name: /Find a day/ })).toBeVisible();

  for (const [zoom, kicker, action] of [
    ["Month", "October", "One thing this month"],
    ["Year", "2026", "One thing this year"],
    ["Decade", "Ages 29–38 · 2024–2033", "One thing this decade"]
  ] as const) {
    await page.getByRole("radio", { name: zoom }).click();
    const lead = page.getByLabel(kicker);
    await expect(lead.getByRole("heading")).toBeVisible();
    await expect(lead.getByText(action)).toBeVisible();
  }
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

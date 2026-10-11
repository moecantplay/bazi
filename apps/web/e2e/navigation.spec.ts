import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * M24-04: four tabs (Today · Ahead · You · People), Settings behind a gear in
 * each tab's header with Back to return, leaf screens under their tab, and
 * nothing linking to Conditions.
 */
const TODAY = "2026-10-05";

test("the four tabs and the Settings gear navigate, and nothing links to Conditions", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link")).toHaveText(["Today", "Ahead", "You", "People"]);

  for (const tab of ["Ahead", "You", "People", "Today"] as const) {
    await nav.getByRole("link", { name: tab, exact: true }).click();
    await expect(page.getByRole("heading", { name: tab, exact: true })).toBeAttached();
    await expect(page.locator('a[href^="/conditions"]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  }

  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await expect(page.locator('a[href^="/conditions"]')).toHaveCount(0);
  await expect(page.getByText("Look for Today")).toBeVisible();
  await expect(page.getByText("How your chart is counted")).toBeVisible();
  await page.getByRole("button", { name: /Back$/ }).first().click();
  await expect(page).toHaveURL(/\/today\/?/);
});

test("leaf screens sit under their tab, with Back", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  const nav = page.getByRole("navigation", { name: "Primary" });

  for (const [path, title, tab] of [
    ["/chart/", "Your chart in full", "You"],
    ["/compare/", "The full comparison", "People"],
    ["/cycles/", "Your decades", "Today"],
    ["/dates/", "Find a day", "Ahead"]
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Back$/ }).first()).toBeVisible();
    if (tab !== "Today") {
      await expect(nav.getByRole("link", { name: tab, exact: true })).toHaveAttribute("aria-current", "page");
    }
  }
});

test("the look previews never carry the Settings gear", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/settings/");
  await expect(page.getByText("Look for Today")).toBeVisible();
  await expect(page.locator('[role="radiogroup"] a[href="/settings/"]')).toHaveCount(0);
});

import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * M24-12: a retired screen's address sends old bookmarks and installed apps
 * on to the tab that replaced it.
 */

const RETIRED = [
  { from: "/conditions/", to: /\/today\/?$/, tab: "Today" },
  { from: "/cycles/", to: /\/ahead\/?$/, tab: "Ahead" },
  { from: "/compare/", to: /\/people\/?$/, tab: "People" }
];

for (const { from, to, tab } of RETIRED) {
  test(`${from} lands on the tab that replaced it`, async ({ page, context }) => {
    await seedProfile(context, FIXTURE_A);
    await pinClock(context, "2026-10-13T03:00:00Z");
    await page.goto(from);
    await expect(page).toHaveURL(to);
    // Wait for the tab itself, not just the address: ending the test while
    // the replacement page is still loading can crash headless Chromium (M20-25).
    await expect(page.getByRole("heading", { name: tab, exact: true })).toBeAttached();
    await page.waitForLoadState("networkidle");
  });
}

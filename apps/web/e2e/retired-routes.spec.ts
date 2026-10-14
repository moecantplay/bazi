import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * M24-12: a retired screen's address sends old bookmarks and installed apps
 * on to the tab that replaced it.
 */

const RETIRED = [{ from: "/conditions/", to: /\/today\/?$/ }];

for (const { from, to } of RETIRED) {
  test(`${from} lands on the tab that replaced it`, async ({ page, context }) => {
    await seedProfile(context, FIXTURE_A);
    await pinClock(context, "2026-10-13T03:00:00Z");
    await page.goto(from);
    await expect(page).toHaveURL(to);
  });
}

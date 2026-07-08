import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

/**
 * The offline promise: once the service worker has installed, every route
 * renders with the network gone — including routes never visited online,
 * which only work if the precache carries the _next chunks, not just HTML.
 */
test("offline: never-visited routes render fully from the precache", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, "2026-07-08T12:00:00+07:00");

  // One online visit; wait for the worker to finish installing everything.
  await page.goto("/today/");
  await page.evaluate(() => navigator.serviceWorker.ready);

  await context.setOffline(true);

  // Full navigations to routes this page never fetched online.
  await page.goto("/cycles/");
  await expect(page.getByText("Current decade")).toBeVisible();

  await page.goto("/chart/");
  await expect(page.locator('[data-pillar="day"]')).toContainText("戊");

  await context.setOffline(false);
});

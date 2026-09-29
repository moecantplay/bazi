import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { FIXTURE_A, seedProfile, seedStore } from "./helpers";

/**
 * The look is stamped on <html> by the pre-paint script, like the theme.
 * Recording data-look at DOMContentLoaded proves it was set during parsing,
 * before the app's scripts hydrate, so a chosen look never flashes the default.
 */
async function recordLookAtParse(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { lookAtParse?: string }).lookAtParse = document.documentElement.dataset.look;
    });
  });
}

async function lookAtParse(page: Page): Promise<string | undefined> {
  return page.evaluate(() => (window as unknown as { lookAtParse?: string }).lookAtParse);
}

test("a chosen look is on <html> before the app hydrates and survives reload", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "dial" });
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("dial");
  await expect(page.locator("html")).toHaveAttribute("data-look", "dial");

  await page.reload();
  expect(await lookAtParse(page)).toBe("dial");
});

test("a store written before looks existed opens in the default look", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("trail");
  await expect(page.locator("html")).toHaveAttribute("data-look", "trail");
});

test("an unknown stored look falls back to the default", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "neon" });
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("trail");
});

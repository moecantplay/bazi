import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { FIXTURE_A, STORE_KEY, seedStore } from "./helpers";

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

for (const look of ["trail", "almanac"] as const) {
  test(`a chosen ${look} look is on <html> before the app hydrates and survives reload`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look, lookPromptSeen: true });
    await recordLookAtParse(context);

    await page.goto("/today/");
    expect(await lookAtParse(page)).toBe(look);
    await expect(page.locator("html")).toHaveAttribute("data-look", look);

    await page.reload();
    expect(await lookAtParse(page)).toBe(look);
  });
}

test("a look the reader never chose opens in the default (M19.9-13 R3)", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail", lookPromptSeen: false });
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("dial");
  await expect(page.locator("html")).toHaveAttribute("data-look", "dial");
});

test("a store written before looks existed opens in the default look", async ({ page, context }) => {
  // Written directly, not via seedStore, which adds the suite's E2E_LOOK.
  await context.addInitScript(
    ([key, profile]) => {
      const store = { app: "daymaster", version: 2, updatedAt: new Date().toISOString(), profile, people: [], activePersonId: null, theme: "system" };
      window.localStorage.setItem(key, JSON.stringify(store));
    },
    [STORE_KEY, FIXTURE_A] as const
  );
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("dial");
  await expect(page.locator("html")).toHaveAttribute("data-look", "dial");
});

test("an unknown stored look falls back to the default", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "neon" });
  await recordLookAtParse(context);

  await page.goto("/today/");
  expect(await lookAtParse(page)).toBe("dial");
});

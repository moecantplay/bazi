import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

/**
 * Spies the StorageManager before any app script runs. Playwright's Linux
 * WebKit has no `navigator.storage` at all (real iOS Safari does), so the spy
 * installs its own when the browser lacks one.
 */
async function spyOnPersistence(context: BrowserContext) {
  await context.addInitScript(() => {
    const calls = { persisted: 0, persist: 0 };
    Object.assign(window, { __persistCalls: calls });
    const spy = {
      persisted: async () => {
        calls.persisted += 1;
        return false;
      },
      persist: async () => {
        calls.persist += 1;
        return false;
      }
    };
    if (navigator.storage) {
      Object.assign(navigator.storage, spy);
    } else {
      Object.defineProperty(navigator, "storage", { value: spy, configurable: true });
    }
  });
}

function persistCalls(page: Page) {
  return page.evaluate(() => (window as unknown as { __persistCalls: { persist: number } }).__persistCalls.persist);
}

/**
 * With a chart stored, a gated screen asks the browser to make storage
 * persistent (M19.8-02); the screen must render whatever the browser answers.
 */
test("a gated screen asks for persistent storage and still renders", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await spyOnPersistence(context);

  await page.goto("/chart/");
  await expect(page.locator('[data-pillar="day"]')).toBeVisible();
  await expect.poll(() => persistCalls(page)).toBe(1);
});

test("no chart, no request", async ({ page, context }) => {
  await spyOnPersistence(context);

  await page.goto("/onboarding/");
  await expect(page.getByRole("heading", { name: "When were you born?" })).toBeVisible();
  expect(await persistCalls(page)).toBe(0);
});

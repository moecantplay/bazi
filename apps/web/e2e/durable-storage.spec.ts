import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

/**
 * With a chart stored, a gated screen asks the browser to make storage
 * persistent (M19.8-02). The StorageManager is spied before any app script
 * runs; the screen must render whatever the browser answers.
 */
test("a gated screen asks for persistent storage and still renders", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await context.addInitScript(() => {
    const calls = { persisted: 0, persist: 0 };
    Object.assign(window, { __persistCalls: calls });
    navigator.storage.persisted = async () => {
      calls.persisted += 1;
      return false;
    };
    navigator.storage.persist = async () => {
      calls.persist += 1;
      return false;
    };
  });

  await page.goto("/chart/");
  await expect(page.locator('[data-pillar="day"]')).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __persistCalls: { persist: number } }).__persistCalls.persist))
    .toBe(1);
});

test("no chart, no request", async ({ page, context }) => {
  await context.addInitScript(() => {
    const calls = { persist: 0 };
    Object.assign(window, { __persistCalls: calls });
    navigator.storage.persist = async () => {
      calls.persist += 1;
      return false;
    };
  });

  await page.goto("/onboarding/");
  await expect(page.getByRole("heading", { name: "When were you born?" })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __persistCalls: { persist: number } }).__persistCalls.persist)).toBe(0);
});

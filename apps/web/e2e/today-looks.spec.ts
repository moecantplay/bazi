import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedStore } from "./helpers";

/** 2026-07-07 09:00 Jakarta: day 188 of the year. */
const TODAY = "2026-07-07";
const LOOKS = ["trail", "almanac", "dial"] as const;

test.use({ viewport: { width: 390, height: 844 } });

for (const look of LOOKS) {
  test(`${look}: the one-thing-to-do board starts on the first screen, above the nav`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look });
    await pinClock(context, `${TODAY}T02:00:00Z`);
    await page.goto("/today/");

    const board = await page.locator("[data-agency]").boundingBox();
    const nav = await page.locator("nav").last().boundingBox();
    expect(board).not.toBeNull();
    expect(nav).not.toBeNull();
    expect(board!.y).toBeLessThan(nav!.y);
  });
}

test("dial: the day's two hours are arcs on the ring, named by clock window", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "dial" });
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  const dial = page.locator('svg[aria-label^="Today\'s hours"]');
  await expect(dial).toHaveAttribute("aria-label", /rough hour \d{1,2}(?: [ap]m)?–\d{1,2} [ap]m/);
  await expect(dial).toHaveAttribute("aria-label", /easy hour \d{1,2}(?: [ap]m)?–\d{1,2} [ap]m/);
  await expect(dial.locator('[data-waypoint="hours"]')).toHaveCount(2);
});

test("almanac: the poster numbers the day of the year", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "almanac" });
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");

  await expect(page.getByText("Day 188 of the year")).toBeVisible();
});

test("changing the look re-renders Today without a reload", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail" });
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.goto("/today/");
  await expect(page.locator('svg[aria-label^="Today\'s route"]')).toBeVisible();

  // Settings will stamp data-look the same way (M19.9-04's control calls applyLookPreference).
  await page.evaluate(() => {
    document.documentElement.dataset.look = "dial";
  });
  await expect(page.locator('svg[aria-label^="Today\'s hours"]')).toBeVisible();
  await expect(page.locator('svg[aria-label^="Today\'s route"]')).toHaveCount(0);
});

test("reduced motion shows the final state with no arrival animation", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail" });
  await pinClock(context, `${TODAY}T02:00:00Z`);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/today/");

  const headline = page.locator("[data-headline]");
  await expect(headline).toBeVisible();
  expect(await headline.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
});

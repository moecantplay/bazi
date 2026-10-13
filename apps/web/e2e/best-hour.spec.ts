import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedStore } from "./helpers";

/**
 * The reader's best hour beside the day's easy and rough hours (M24-13), in
 * every look. Fixture A on 2026-07-12: easy 3–5 am, rough 9–11 am, best
 * 11 am–1 pm (Fire). On 2026-07-07 the best hour is the easy hour, 1–3 pm.
 */

const LOOKS = ["trail", "almanac", "dial"] as const;
const OWN_DAY = "2026-07-12";
const SHARED_DAY = "2026-07-07";

test.use({ viewport: { width: 390, height: 844 } });

for (const look of LOOKS) {
  test(`${look}: the hours card keeps Easiest and Roughest and adds the best hour`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look });
    await pinClock(context, `${OWN_DAY}T02:00:00Z`);
    await page.goto("/today/");

    const card = page.locator('a[data-topic="hours"]');
    await expect(card).toContainText("Easiest 3–5 am");
    await expect(card).toContainText("Roughest 9–11 am.");
    await expect(card.locator("[data-card-note]")).toHaveText("11 am–1 pm suits you best.");
  });

  test(`${look}: when the best hour is the easy hour, the card says so once`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look });
    await pinClock(context, `${SHARED_DAY}T02:00:00Z`);
    await page.goto("/today/");

    const note = page.locator('a[data-topic="hours"] [data-card-note]');
    await expect(note).toHaveText("The easy hour suits you best too.");
  });
}

test("the hours page says why the hour suits you", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A });
  await pinClock(context, `${OWN_DAY}T02:00:00Z`);
  await page.goto("/today/");
  await page.locator('a[data-topic="hours"]').click();

  await expect(page.getByText("11 am–1 pm suits you best: it brings Fire, and your birth chart runs better with more of it.")).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`trail (${theme}): the best hour rides the route with its own label`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look: "trail", theme });
    await pinClock(context, `${OWN_DAY}T02:00:00Z`);
    await page.goto("/today/");

    const route = page.locator('svg[aria-label^="Today\'s route"]');
    await expect(route).toHaveAttribute("aria-label", /suits you best 11 am–1 pm$/);
    await expect(route.locator('[data-waypoint="hours"]')).toHaveCount(2);
    const mark = route.locator('[data-waypoint="best-hour"]');
    await expect(mark).toHaveCount(1);
    await expect(mark).toContainText("SUITS YOU · 11 AM–1 PM");
    await expect(mark.locator("[data-best-hour-star]")).toHaveCount(1);
  });
}

test("trail: when NOW is inside the best hour, NOW wears its ring and the disc steps aside", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail" });
  await pinClock(context, `${OWN_DAY}T04:30:00Z`);
  await page.goto("/today/");

  const route = page.locator('svg[aria-label^="Today\'s route"]');
  const mark = route.locator('[data-waypoint="best-hour"]');
  await expect(mark).toContainText("SUITS YOU · 11 AM–1 PM");
  await expect(mark.locator("circle")).toHaveCount(0);
  await expect(route.locator('circle[r="21"]')).toHaveAttribute("stroke", "var(--element-fire)");
});

test("trail: a best hour that is the easy hour has no mark of its own", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "trail" });
  await pinClock(context, `${SHARED_DAY}T02:00:00Z`);
  await page.goto("/today/");

  const route = page.locator('svg[aria-label^="Today\'s route"]');
  await expect(route.locator('[data-waypoint="best-hour"]')).toHaveCount(0);
  await expect(route.locator('[data-waypoint="hours"]', { hasText: "EASY · SUITS YOU · 1–3 PM" })).toHaveCount(1);
});

for (const theme of ["light", "dark"] as const) {
  test(`dial (${theme}): the best hour is an arc outside the track and a line in the key`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look: "dial", theme });
    await pinClock(context, `${OWN_DAY}T02:00:00Z`);
    await page.goto("/today/");

    const dial = page.locator('svg[aria-label^="Today\'s hours"]');
    await expect(dial).toHaveAttribute("aria-label", /suits you best 11 am–1 pm$/);
    await expect(dial.locator('[data-waypoint="hours"]')).toHaveCount(2);
    await expect(dial.locator('[data-waypoint="best-hour"]')).toHaveCount(1);
    await expect(dial.locator("[data-best-hour-star]")).toHaveCount(1);
    await expect(page.locator("[data-best-hour-key]")).toHaveText("Suits you 11 am–1 pm");
  });
}

test("dial: a shared easy hour reads as one key line", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A, look: "dial" });
  await pinClock(context, `${SHARED_DAY}T02:00:00Z`);
  await page.goto("/today/");

  await expect(page.locator("[data-best-hour-key]")).toHaveText("Easy hour suits you");
});

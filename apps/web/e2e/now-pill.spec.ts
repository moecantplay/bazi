import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedStore } from "./helpers";

/**
 * M24-14: Explorer's NOW pill holds a fixed spot in the corner opposite
 * MORNING while the NOW disc walks the route. Fixture A on 2026-10-13, the
 * day the moving pill covered MORNING (6:30) and "SUITS YOU · 1–3 AM" (10:00).
 * At 390px the route's viewBox draws 1:1 along the hero's foot, so the pill
 * (x 282, y 224 in a 390×250 box) sits 282px in and 26px above the bottom.
 */

test.use({ viewport: { width: 390, height: 844 } });

const MOMENTS = [
  { utc: "2026-10-12T23:30:00Z", clock: "NOW 6:30" },
  { utc: "2026-10-13T03:00:00Z", clock: "NOW 10:00" },
  { utc: "2026-10-13T11:00:00Z", clock: "NOW 18:00" }
];

for (const { utc, clock } of MOMENTS) {
  test(`trail: at ${clock} the pill sits in its corner, inside the hero`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look: "trail" });
    await pinClock(context, utc);
    await page.goto("/today/");

    const pill = page.locator("[data-now-pill]");
    await expect(pill).toHaveText(clock);
    const hero = await page.locator(".route-hero").boundingBox();
    expect(hero).not.toBeNull();
    // The pill pops in from its centre: measure once it has settled.
    await expect.poll(async () => Math.round((await pill.boundingBox())!.x - hero!.x)).toBe(282);
    const box = (await pill.boundingBox())!;
    expect(hero!.y + hero!.height - box.y).toBeCloseTo(26, 0);
    expect(box.x + box.width).toBeLessThanOrEqual(hero!.x + hero!.width);
  });
}

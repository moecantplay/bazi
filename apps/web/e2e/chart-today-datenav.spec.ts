import { expect, test } from "@playwright/test";
import { addDays, FIXTURE_A, longDate, pinClock, seedProfile } from "./helpers";

const TODAY = "2026-07-07";

test("seeded chart renders and Today's date nav works and clamps", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  // Chart renders from the seeded profile.
  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  await expect(page.getByText("甲").first()).toBeVisible();

  // Move to Today; the reading cites at least one fact.
  await page.getByRole("link", { name: "Today" }).click();
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  const body = page.locator("[data-reading-body]");
  await expect(body.locator("[data-fact-tag]").first()).toBeVisible();

  // Three consecutive dates each cite a fact and read differently.
  const readings: string[] = [];
  for (let day = 0; day < 3; day += 1) {
    await expect(page.getByText(longDate(addDays(TODAY, day)))).toBeVisible();
    await expect(body.locator("[data-fact-tag]").first()).toBeVisible();
    readings.push(await body.innerText());
    if (day < 2) {
      await page.getByRole("button", { name: "Next day" }).click();
    }
  }
  expect(new Set(readings).size).toBe(3);

  // Jump back to today, then confirm the ±30-day clamp in both directions.
  await page.getByRole("button", { name: "Back to today" }).click();
  await expect(page.getByText(longDate(TODAY))).toBeVisible();

  const prev = page.getByRole("button", { name: "Previous day" });
  const next = page.getByRole("button", { name: "Next day" });

  for (let i = 0; i < 30; i += 1) {
    await prev.click();
  }
  await expect(prev).toBeDisabled();
  await expect(page.getByText(longDate(addDays(TODAY, -30)))).toBeVisible();

  for (let i = 0; i < 60; i += 1) {
    await next.click();
  }
  await expect(next).toBeDisabled();
  await expect(page.getByText(longDate(addDays(TODAY, 30)))).toBeVisible();

  // Past midnight, regaining visibility re-anchors the strip to the new day —
  // a PWA reopened the next morning must not keep showing yesterday.
  await page.getByRole("button", { name: "Back to today" }).click();
  await expect(page.getByText(longDate(TODAY))).toBeVisible();
  await page.evaluate((iso) => {
    const fixed = new Date(iso).getTime();
    const RealDate = Date;
    class FakeDate extends RealDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixed);
        } else {
          // @ts-expect-error forward arbitrary Date constructor args
          super(...args);
        }
      }
      static now() {
        return fixed;
      }
    }
    // @ts-expect-error replace the global Date with the re-pinned subclass
    window.Date = FakeDate;
    document.dispatchEvent(new Event("visibilitychange"));
  }, `${addDays(TODAY, 1)}T09:00:00Z`);
  await expect(page.getByText(longDate(addDays(TODAY, 1)))).toBeVisible();
});

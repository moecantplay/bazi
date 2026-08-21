import { expect, test, type Page } from "@playwright/test";
import { addDays, FIXTURE_A, longDate, pinClock, seedProfile } from "./helpers";

const TODAY = "2026-07-07";

/**
 * The datebar shows a short mono date on the page; the full long date lives
 * in the "jump to a date" button's accessible name instead (Datebar's
 * aria-label). Assert against that rather than visible text so this stays
 * robust to the datebar's own visual format. The "jump to a date" suffix
 * also disambiguates from the elevation profile's own per-day buttons, whose
 * accessible names carry the same long date whenever that day falls in the
 * visible 7-day window.
 */
function dateButton(page: Page, iso: string) {
  return page.getByRole("button", { name: new RegExp(`${longDate(iso)}.*jump to a date`) });
}

test("seeded chart renders and Today's date nav works and clamps", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);

  // Chart renders from the seeded profile.
  await page.goto("/chart/");
  await expect(page.getByRole("heading", { name: "Chart", exact: true })).toBeVisible();
  await expect(page.locator('[data-pillar="year"]')).toContainText("yang wood");

  // Move to Today; the reading cites at least one fact.
  await page.getByRole("link", { name: "Today" }).click();
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  const body = page.locator("[data-reading-body]");
  await expect(body.locator("[data-fact-tag]").first()).toBeVisible();

  // Three consecutive dates each cite a fact and read differently.
  const readings: string[] = [];
  for (let day = 0; day < 3; day += 1) {
    await expect(dateButton(page, addDays(TODAY, day))).toBeVisible();
    await expect(body.locator("[data-fact-tag]").first()).toBeVisible();
    readings.push(await body.innerText());
    if (day < 2) {
      await page.getByRole("button", { name: "Next day" }).click();
    }
  }
  expect(new Set(readings).size).toBe(3);

  // Jump back to today, then confirm the ±30-day clamp in both directions.
  await page.getByRole("button", { name: "Back to today" }).click();
  await expect(dateButton(page, TODAY)).toBeVisible();

  const prev = page.getByRole("button", { name: "Previous day" });
  const next = page.getByRole("button", { name: "Next day" });

  for (let i = 0; i < 30; i += 1) {
    await prev.click();
  }
  await expect(prev).toBeDisabled();
  await expect(dateButton(page, addDays(TODAY, -30))).toBeVisible();

  for (let i = 0; i < 60; i += 1) {
    await next.click();
  }
  await expect(next).toBeDisabled();
  await expect(dateButton(page, addDays(TODAY, 30))).toBeVisible();
  await expect(page.getByText("Readings reach 30 days out from today.")).toBeVisible();

  // Tapping the date opens a picker that jumps anywhere in the window.
  await page.getByRole("button", { name: /jump to a date/i }).click();
  await page.getByLabel("Jump to a date").fill(addDays(TODAY, 5));
  await expect(dateButton(page, addDays(TODAY, 5))).toBeVisible();

  // Past midnight, regaining visibility re-anchors the strip to the new day —
  // a PWA reopened the next morning must not keep showing yesterday.
  await page.getByRole("button", { name: "Back to today" }).click();
  await expect(dateButton(page, TODAY)).toBeVisible();
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
  await expect(dateButton(page, addDays(TODAY, 1))).toBeVisible();
});

test("today's terrain shows all 10 activities and its disclosure toggles the manifest", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  const terrain = page.locator("[data-activity-terrain]");
  await expect(terrain).toBeVisible();
  await expect(terrain.locator('[role="img"]')).toHaveAttribute("aria-label", /Today across 10 activities/);
  await expect(terrain.locator("[data-activity-manifest]")).toHaveCount(0);

  await terrain.getByRole("button", { name: "Show all 10 in detail" }).click();
  const manifest = terrain.locator("[data-activity-manifest]");
  await expect(manifest).toBeVisible();
  await expect(manifest.locator("li")).toHaveCount(10);
  await expect(manifest).toContainText("Gatherings");
  await expect(manifest).toContainText("meeting friends and kin");

  await terrain.getByRole("button", { name: "Hide details" }).click();
  await expect(terrain.locator("[data-activity-manifest]")).toHaveCount(0);
});

test("streak counts consecutive opens and the tomorrow note shows only on today", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  // Yesterday's visit is already on record; today's open should extend it.
  // daymaster.streak.v1 is a deliberate carve-out from the store.v2 document
  // (M19 decision C) — seeded directly like apps/web did.
  await context.addInitScript(
    ([key, json]) => {
      window.localStorage.setItem(key, json);
    },
    ["daymaster.streak.v1", JSON.stringify({ count: 3, lastOpen: addDays(TODAY, -1) })] as const
  );

  await page.goto("/today/");
  // The wording varies by day (streakLine picks from a bank), but the count is
  // always in it.
  await expect(page.locator("[data-streak]")).toBeVisible();
  await expect(page.locator("[data-streak]")).toContainText("4");
  await expect(page.getByText("Tomorrow reads differently. It’ll be here in the morning.")).toBeVisible();

  // Neither line follows the reader to other dates.
  await page.getByRole("button", { name: "Next day" }).click();
  await expect(page.locator("[data-streak]")).toHaveCount(0);
  await expect(page.getByText("Tomorrow reads differently. It’ll be here in the morning.")).toHaveCount(0);
});

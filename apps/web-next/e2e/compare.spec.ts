import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile, STORE_KEY } from "./helpers";

test("compare flow: enter a second person, read the pair, change person", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/compare/");
  await expect(page.getByRole("heading", { name: "Compare", exact: true })).toBeVisible();

  // Fill the second person's details (day-pillar anchor date: 甲子 day).
  await page.getByLabel("Their birth date").fill("1949-10-01");
  await page.getByLabel("Their birth time").fill("12:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Female" }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();

  // Both pillar sets render; the reading cites facts, day-masters first.
  await expect(page.getByText("You", { exact: true })).toBeVisible();
  await expect(page.getByText("Them", { exact: true })).toBeVisible();
  const reading = page.locator("[data-compare-reading]");
  await expect(reading.locator("[data-fact-tag]").first()).toBeVisible();
  await expect(reading.locator("[data-fact-tag]").first()).toContainText("day-masters");

  // Persisted: a reload lands on the reading, not the form.
  await page.reload();
  await expect(page.locator("[data-compare-reading]")).toBeVisible();

  // Change person returns to the picker; the person stays saved by name.
  await page.getByRole("button", { name: "Change person" }).click();
  await expect(page.getByRole("button", { name: "Read the pair" })).toBeVisible();
  await expect(page.getByText("Saved people")).toBeVisible();
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORE_KEY);
  expect(JSON.parse(stored!).people).toHaveLength(1);
});

test("saved people: add two, switch without re-entry, remove one", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/compare/");
  await page.getByLabel("Their name").fill("Ana");
  await page.getByLabel("Their birth date").fill("1949-10-01");
  await page.getByLabel("Their birth time").fill("12:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Female" }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();
  await expect(page.getByRole("heading", { name: "Ana" })).toBeVisible();

  // Add a second person from the picker.
  await page.getByRole("button", { name: "Change person" }).click();
  await page.getByLabel("Their name").fill("Bo");
  await page.getByLabel("Their birth date").fill("1994-12-09");
  await page.getByLabel("Their birth time").fill("08:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Male", exact: true }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();
  await expect(page.getByRole("heading", { name: "Bo" })).toBeVisible();

  // Switch back to Ana straight from the list — no re-entry.
  await page.getByRole("button", { name: "Change person" }).click();
  await page.getByRole("button", { name: /^Ana/ }).click();
  await expect(page.getByRole("heading", { name: "Ana" })).toBeVisible();

  // Remove Bo; only Ana remains saved.
  await page.getByRole("button", { name: "Change person" }).click();
  await page.getByRole("button", { name: "Remove Bo" }).click();
  await expect(page.getByRole("button", { name: /^Bo/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Ana/ })).toBeVisible();
});

test("a legacy single companion migrates to a saved person", async ({ page, context }) => {
  // Seeds the pre-v2 shapes apps/web wrote (daymaster.profile.v1 plus the
  // very old single-companion daymaster.compare.v1, predating even that
  // app's own saved-people list) and lets the real migration path
  // (store-migration.ts, invoked by the first loadStore() call at app boot)
  // fold them into daymaster.store.v2. The migration mechanism itself has
  // its own exhaustive coverage in store-migration.spec.ts; this proves the
  // Compare screen renders correctly off the result.
  await context.addInitScript(
    ([profileKey, profileJson, companionKey, companionJson]) => {
      window.localStorage.setItem(profileKey, profileJson);
      window.localStorage.setItem(companionKey, companionJson);
    },
    [
      "daymaster.profile.v1",
      JSON.stringify(FIXTURE_A),
      "daymaster.compare.v1",
      JSON.stringify({
        date: "1949-10-01",
        time: "12:00",
        city: FIXTURE_A.birth.city,
        sex: "male"
      })
    ] as const
  );

  await page.goto("/compare/");
  await expect(page.getByRole("heading", { name: "Them" })).toBeVisible();
  await expect(page.locator("[data-compare-reading]")).toBeVisible();
});

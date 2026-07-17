import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedCompanion, seedProfile } from "./helpers";

const HAN_KEY = "daymaster.han.v1";
const HAN_PATTERN = /[㐀-鿿豈-﫿]/;

/** Whether the element's rendered text contains any Han character. */
async function containsHan(locator: import("@playwright/test").Locator): Promise<boolean> {
  const text = await locator.innerText();
  return HAN_PATTERN.test(text);
}

test("English-first by default; the Chinese-characters toggle opts in and persists", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await seedCompanion(context, {
    date: "1949-10-01",
    time: "12:00",
    city: FIXTURE_A.birth.city,
    sex: "male"
  });
  await pinClock(context, "2026-07-08T12:00:00+07:00");

  // Default: English only — glosses stand in for glyphs everywhere.
  // (font-han styles every glyph outside the seal, so zero means none rendered.)
  await page.goto("/chart/");
  const dayColumn = page.locator('[data-pillar="day"]');
  await expect(dayColumn).toContainText("yang earth");
  await expect(dayColumn).toContainText("dragon");
  await expect(page.locator(".font-han")).toHaveCount(0);
  expect(await containsHan(dayColumn)).toBe(false);

  // Reading prose and fact tags carry no Han by default either.
  await page.goto("/today/");
  await expect(page.locator(".font-han")).toHaveCount(0);
  const readingBody = page.locator("[data-reading-body]");
  await expect(readingBody.locator("p").first()).toBeVisible();
  expect(await containsHan(readingBody)).toBe(false);

  // Cycles reads as gloss pairs (Fixture A's 己卯 decade covers 2024–2033
  // under the pinned 2026 clock).
  await page.goto("/cycles/");
  await expect(page.getByText("Current decade")).toBeVisible();
  await expect(page.locator(".font-han")).toHaveCount(0);
  await expect(page.getByText("yin earth · rabbit").first()).toBeVisible();
  expect(await containsHan(page.locator("body"))).toBe(false);

  // Compare: both pillar grids and the pair reading are English too.
  await page.goto("/compare/");
  const compareReading = page.locator("[data-compare-reading]");
  await expect(compareReading.locator("[data-fact-tag]").first()).toBeVisible();
  await expect(page.locator(".font-han")).toHaveCount(0);
  expect(await containsHan(page.locator("body"))).toBe(false);

  // Opt in from Settings.
  await page.goto("/settings/");
  const toggle = page.getByRole("switch", { name: "Show Chinese characters" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  // The chart hero now shows the day pillar's characters (Fixture A day = 戊辰).
  await page.goto("/chart/");
  await expect(dayColumn).toContainText("戊");
  await expect(dayColumn).toContainText("yang earth");

  // The opt-in survives a reload and is stored under the versioned key.
  await page.reload();
  await expect(dayColumn).toContainText("戊");
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), HAN_KEY);
  expect(stored).toBe("show");

  // Turning it back off restores English-first and clears the key.
  await page.goto("/settings/");
  await page.getByRole("switch", { name: "Show Chinese characters" }).click();
  await page.goto("/chart/");
  await expect(page.locator(".font-han")).toHaveCount(0);
  await expect(dayColumn).toContainText("yang earth");
  const cleared = await page.evaluate((key) => window.localStorage.getItem(key), HAN_KEY);
  expect(cleared).toBeNull();
});

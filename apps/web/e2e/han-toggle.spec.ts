import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedCompanion, seedProfile } from "./helpers";

const HAN_KEY = "daymaster.han.v1";
const HAN_PATTERN = /[㐀-鿿豈-﫿]/;

/** Whether the element's rendered text contains any Han character. */
async function containsHan(locator: import("@playwright/test").Locator): Promise<boolean> {
  const text = await locator.innerText();
  return HAN_PATTERN.test(text);
}

test("the Chinese-characters toggle swaps every screen to English and persists", async ({
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

  // Default: the chart hero shows the day pillar's characters (Fixture A day = 戊辰).
  await page.goto("/chart/");
  const dayColumn = page.locator('[data-pillar="day"]');
  await expect(dayColumn).toContainText("戊");
  await expect(dayColumn).toContainText("yang earth");

  // Turn the characters off in Settings.
  await page.goto("/settings/");
  const toggle = page.getByRole("switch", { name: "Show Chinese characters" });
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  // The chart hero now reads in English only, glosses standing in for glyphs.
  // (font-han styles every glyph outside the seal, so zero means none rendered;
  // waiting on it also absorbs the post-hydration swap to the stored preference.)
  await page.goto("/chart/");
  await expect(page.locator(".font-han")).toHaveCount(0);
  await expect(dayColumn).toContainText("yang earth");
  await expect(dayColumn).toContainText("dragon");
  expect(await containsHan(dayColumn)).toBe(false);

  // Reading prose and fact tags are stripped too (Today's cards).
  await page.goto("/today/");
  await expect(page.locator(".font-han")).toHaveCount(0);
  const readingBody = page.locator("[data-reading-body]");
  await expect(readingBody.locator("p").first()).toBeVisible();
  expect(await containsHan(readingBody)).toBe(false);

  // The preference survives a reload and is stored under the versioned key.
  await page.reload();
  await expect(page.locator(".font-han")).toHaveCount(0);
  expect(await containsHan(readingBody)).toBe(false);
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), HAN_KEY);
  expect(stored).toBe("hide");

  // Cycles: the current-decade card and timeline nodes read as gloss pairs
  // (Fixture A's 己卯 decade covers 2024–2033 under the pinned 2026 clock).
  await page.goto("/cycles/");
  await expect(page.getByText("Current decade")).toBeVisible();
  await expect(page.locator(".font-han")).toHaveCount(0);
  await expect(page.getByText("yin earth · rabbit").first()).toBeVisible();
  expect(await containsHan(page.locator("body"))).toBe(false);

  // Compare: both pillar grids and the pair reading are stripped too.
  await page.goto("/compare/");
  const compareReading = page.locator("[data-compare-reading]");
  await expect(compareReading.locator("[data-fact-tag]").first()).toBeVisible();
  await expect(page.locator(".font-han")).toHaveCount(0);
  expect(await containsHan(page.locator("body"))).toBe(false);

  // Turning it back on restores the characters and clears the key.
  await page.goto("/settings/");
  await page.getByRole("switch", { name: "Show Chinese characters" }).click();
  await page.goto("/chart/");
  await expect(dayColumn).toContainText("戊");
  const cleared = await page.evaluate((key) => window.localStorage.getItem(key), HAN_KEY);
  expect(cleared).toBeNull();
});

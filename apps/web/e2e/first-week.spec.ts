import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { FIXTURE_A, completeOnboarding, pinClock, seedStore } from "./helpers";

/**
 * M24-10: a new reader's first week. Day one has the banner; each of the next
 * six opened days has one note, each part once, in order, and only when it's
 * on screen. Readers who had a chart before M24-10 never see it.
 */

/** 09:00 in Jakarta (the suite's device zone) on a date. */
function morning(dateISO: string): string {
  return `${dateISO}T02:00:00Z`;
}

/**
 * Fixture A's opened days and the part each one introduces. A three-day gap
 * after day one (opened days, not calendar days); on 10-21 the day's element
 * card isn't on screen, so Also today goes first and the element waits a day.
 */
const WEEK: Array<[date: string, part: string | null]> = [
  ["2026-10-18", "hours"],
  ["2026-10-19", "character"],
  ["2026-10-20", "pace"],
  ["2026-10-21", "also-today"],
  ["2026-10-22", "element"],
  ["2026-10-23", "small-signs"],
  ["2026-10-24", null]
];

async function openOn(page: Page, context: BrowserContext, dateISO: string): Promise<void> {
  await pinClock(context, morning(dateISO));
  await page.goto("/today/");
  await expect(page.locator("[data-topic-cards]")).toBeVisible();
}

test("a new reader's first week: the banner, then one note a day, then nothing", async ({ page, context }) => {
  await pinClock(context, morning("2026-10-15"));
  await completeOnboarding(page);
  await expect(page.locator("[data-first-day]")).toBeVisible();
  await expect(page.locator("[data-first-week]")).toHaveCount(0);

  for (const [index, [date, part]] of WEEK.entries()) {
    await openOn(page, context, date);
    await expect(page.locator("[data-first-day]")).toHaveCount(0);
    if (part === null) {
      await expect(page.locator("[data-first-week]")).toHaveCount(0);
      continue;
    }
    const note = page.locator("[data-first-week]");
    await expect(note).toHaveAttribute("data-first-week", part);
    await expect(note).toContainText(`Your first week · day ${index + 2}`);
    if (index === 0) {
      // A reload reads the stored week back: same note, and no step forward.
      await page.reload();
      await expect(note).toHaveAttribute("data-first-week", part);
      // Another date shows no note.
      await page.getByRole("button", { name: "Next day" }).click();
      await expect(note).toHaveCount(0);
    }
  }
});

for (const look of ["trail", "almanac", "dial"]) {
  test(`${look}: day two's note sits after the first screen, before the cards`, async ({ page, context }) => {
    await seedStore(context, {
      profile: { ...FIXTURE_A, createdAt: morning("2026-10-15") },
      look,
      firstWeek: { opened: ["2026-10-15"], noted: {} }
    });
    await openOn(page, context, "2026-10-18");
    const note = page.locator("[data-first-week]");
    await expect(note).toContainText("Hours, below,");
    const noteBox = await note.boundingBox();
    const cardsBox = await page.locator("[data-topic-cards]").boundingBox();
    expect(noteBox!.y + noteBox!.height).toBeLessThanOrEqual(cardsBox!.y);
  });
}

test("a reader whose chart predates the first week never sees a note", async ({ page, context }) => {
  await seedStore(context, { profile: FIXTURE_A });
  for (const date of ["2026-10-18", "2026-10-19"]) {
    await openOn(page, context, date);
    await expect(page.locator("[data-first-week]")).toHaveCount(0);
  }
});

import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile, seedStore } from "./helpers";

const TODAY = "2026-07-07";

test("a topic card opens its page, and Back keeps the day", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  await page.getByRole("button", { name: "Next day" }).click();
  const card = page.locator("[data-topic-cards] a").first();
  await card.click();
  await expect(page).toHaveURL(/\/today\/topic\/\?date=2026-07-08&topic=/);
  const topicPage = page.locator("[data-topic-page]");
  await expect(topicPage.getByRole("heading", { level: 1 })).not.toBeEmpty();
  await expect(topicPage.getByRole("heading", { name: "Where the name comes from" })).toBeVisible();

  await topicPage.getByRole("link", { name: /Today/ }).click();
  await expect(page).toHaveURL(/\/today\/\?date=2026-07-08/);
  await expect(page.getByRole("button", { name: "Back to today" })).toBeVisible();
});

test("the reading's Read more opens the lead's page, where the old name lives", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  // Today's own text never names the system; its topic page does, once.
  await expect(page.locator("[data-reading-body]")).not.toContainText(/old calendars/i);
  await page.locator("[data-reading-body] [data-read-more]").click();
  const topicPage = page.locator("[data-topic-page]");
  await expect(topicPage).toContainText("The old calendars call this");
  await expect(topicPage.getByRole("heading", { name: "For you today" })).toBeVisible();
  await expect(topicPage.getByRole("heading", { name: "Working with it" })).toBeVisible();
  await expect(topicPage.getByRole("heading", { name: "Good for" })).toBeVisible();
  await expect(topicPage.getByRole("heading", { name: "Hold off on" })).toBeVisible();
});

test("a topic the day doesn't carry falls back to Today", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/topic/?date=2026-07-07&topic=nonsense");
  // 2026-07-07 is today, which Today shows without a date in its URL.
  await expect(page).toHaveURL(/\/today\/$/);
  await expect(page.locator("[data-reading-body]")).toBeVisible();
});

test("the read-more link explains how the reading works", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  // On You since M24-06, not Today.
  await page.goto("/you/");

  await page.locator("[data-about-reading]").click();
  const sheet = page.locator("[data-glossary-sheet]");
  await expect(sheet.getByRole("heading", { name: "How this reading works" })).toBeVisible();
  await expect(sheet.getByText("Four Pillars")).toBeVisible();

  // The close button dismisses it (the panel's X, not the backdrop).
  await sheet.getByRole("button", { name: "Close" }).last().click();
  await expect(sheet).toHaveCount(0);
});

/** M24-15: every "What the marks mean" link opens the sheet for its own look's marks. */
const MARKS_SHEETS = [
  { look: "dial", topic: "marks:dial", title: "The week and the day", texts: ["dashed amber ring", "best hour"] },
  { look: "almanac", topic: "marks:almanac", title: "The week", texts: ["Each day carries a dot"] },
  { look: "trail", topic: "marks:trail-week", title: "The week ahead", texts: ["Each point carries that day's animal"] },
  { look: "trail", topic: "marks:trail-route", title: "Today's route", texts: ["amber circle with an X"] }
] as const;

for (const { look, topic, title, texts } of MARKS_SHEETS) {
  test(`${look}: the ${topic} link explains the marks drawn above it`, async ({ page, context }) => {
    await seedStore(context, { profile: FIXTURE_A, look });
    await pinClock(context, `${TODAY}T09:00:00Z`);
    await page.goto("/today/");

    await page.locator(`[data-marks-legend="${topic}"]`).click();
    const sheet = page.locator("[data-glossary-sheet]");
    await expect(sheet.getByRole("heading", { name: title, exact: true })).toBeVisible();
    for (const text of texts) {
      await expect(sheet).toContainText(text);
    }
    await expect(sheet).not.toContainText("filled dot");

    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
  });
}

test("cycles horizon captions link to the glossary too", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/cycles/");

  const yearCard = page.locator('[data-horizon="year"]');
  await yearCard.locator("[data-fact-tag] button").first().click();
  await expect(page.locator("[data-glossary-sheet]")).toBeVisible();
});

test("M20-26: a written-out topic page carries every section, and a date it comes back opens that day", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, "2026-10-10T09:00:00Z");
  await page.goto(`/today/topic/?date=2026-10-06&topic=${encodeURIComponent("ten-god:Direct Wealth")}`);
  const topicPage = page.locator("[data-topic-page]");
  await expect(topicPage.locator("[data-topic-tagline]")).toHaveText("Do less, finish it, take the help.");
  for (const heading of ["For you today", "How it tends to go", "Where it shows up", "Your sore spot and what eases it", "Working with it", "When it comes back"]) {
    await expect(topicPage.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(topicPage.locator("[data-topic-closing]")).toBeVisible();
  await topicPage.getByRole("link", { name: /16 Oct/ }).click();
  await expect(page).toHaveURL(/date=2026-10-16&topic=ten-god/);
  await expect(page.locator("[data-topic-page] h1")).toHaveText("A day for steady work");
});

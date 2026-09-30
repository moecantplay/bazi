import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

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
  await page.goto("/today/");

  await page.locator("[data-about-reading]").click();
  const sheet = page.locator("[data-glossary-sheet]");
  await expect(sheet.getByRole("heading", { name: "How this reading works" })).toBeVisible();
  await expect(sheet.getByText("Four Pillars")).toBeVisible();

  // The close button dismisses it (the panel's X, not the backdrop).
  await sheet.getByRole("button", { name: "Close" }).last().click();
  await expect(sheet).toHaveCount(0);
});

test("the week strip's legend link explains the tone marks", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  await page.locator("[data-week-legend]").click();
  const sheet = page.locator("[data-glossary-sheet]");
  await expect(sheet.getByRole("heading", { name: "The week ahead" })).toBeVisible();
  await expect(sheet.getByText("filled dot")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
});

test("cycles horizon captions link to the glossary too", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/cycles/");

  const yearCard = page.locator('[data-horizon="year"]');
  await yearCard.locator("[data-fact-tag] button").first().click();
  await expect(page.locator("[data-glossary-sheet]")).toBeVisible();
});

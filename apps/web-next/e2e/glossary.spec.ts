import { expect, test } from "@playwright/test";
import { FIXTURE_A, pinClock, seedProfile } from "./helpers";

const TODAY = "2026-07-07";

test("fact-tag captions open their glossary explainer", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  // Every daily body caption is a link; tapping one opens the sheet.
  const body = page.locator("[data-reading-body]");
  const caption = body.locator("[data-fact-tag] button").first();
  await expect(caption).toBeVisible();
  await caption.click();

  const sheet = page.locator("[data-glossary-sheet]");
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading", { level: 2 })).not.toBeEmpty();

  // The caption explains the category only — advice lives behind "Read more".
  await expect(sheet.locator("[data-glossary-advice]")).toHaveCount(0);

  // Escape closes it.
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
});

test("a card's Read more opens the deep dive, not the category explainer", async ({
  page,
  context,
}) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, `${TODAY}T09:00:00Z`);
  await page.goto("/today/");

  // The first daily body card is an interaction line; interactions have dives.
  await page.locator("[data-reading-body] [data-read-more]").first().click();

  const sheet = page.locator("[data-glossary-sheet]");
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading", { level: 2, name: /^Inside / })).toBeVisible();
  await expect(sheet.locator("[data-glossary-advice]")).toBeVisible();
  await expect(sheet.getByRole("heading", { name: "Working with it" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
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

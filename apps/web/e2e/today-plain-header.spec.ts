import { expect, test, type Page } from "@playwright/test";
import { FIXTURE_A, longDate, pinClock, seedProfile, walkOnboardingToLookStep } from "./helpers";

/**
 * M20-24: Today's header says nothing a reader needs the system to understand.
 * The suite runs once per look (E2E_LOOK), so each check holds in all three.
 */

/** The plain-words list from packages/content/test/plain-terms.ts (VOICE.md rule 11), minus "chart", which Today's chrome may use. */
const SYSTEM_TERMS: readonly RegExp[] = [
  /\b(yang|yin)\b/i,
  /\b(rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig)s?\b/i,
  /\bpalaces?\b/i,
  /\b(wood|fire|earth|metal|water)\b/i,
  /\b(clash|clashes|combine|combines|trine|trines|harm|harms|punishment|punishments)\b/i,
  /\bold (calendars|books|almanacs?)\b/i
];

/** The tone words the week strip speaks, and the header phrase each must agree with. */
const PHRASE_FOR_WEEK_WORD: ReadonlyArray<[weekWord: string, phrase: string]> = [
  ["leans favorable", "Leans your way"],
  ["leans toward friction", "Take it slow"],
  ["even day", "An even day"]
];

function expectPlain(text: string, where: string): void {
  for (const pattern of SYSTEM_TERMS) {
    expect(pattern.test(text), `${pattern} in ${where}: "${text.match(pattern)?.[0]}"`).toBe(false);
  }
}

async function expectHeaderAgreesWithWeek(page: Page, dateISO: string): Promise<void> {
  const phrase = (await page.locator("main [data-day-tone]").first().innerText()).trim();
  // The week cell, not the date control ("… — jump to a date"): its name ends in a tone word.
  const toneWords = PHRASE_FOR_WEEK_WORD.map(([weekWord]) => weekWord).join("|");
  const cell = page.getByRole("button", { name: new RegExp(`^${longDate(dateISO)}.*— (${toneWords})$`) }).first();
  const cellName = (await cell.getAttribute("aria-label")) ?? "";
  const match = PHRASE_FOR_WEEK_WORD.find(([weekWord]) => cellName.endsWith(weekWord));
  expect(match, `week cell "${cellName}"`).toBeTruthy();
  expect(phrase.toLowerCase()).toBe(match![1].toLowerCase());
}

test("Today's header names no system term and shows the day's tone, agreeing with the week", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, "2026-07-07T09:00:00+07:00");
  await page.goto("/today/");

  const dates = ["2026-07-07", "2026-07-08", "2026-07-09"];
  for (const [index, dateISO] of dates.entries()) {
    if (index > 0) {
      await page.getByRole("button", { name: "Next day" }).click();
    }
    await expect(page.locator("main [data-day-tone]").first()).toBeVisible();
    await expectHeaderAgreesWithWeek(page, dateISO);
    expectPlain(await page.locator("main").innerText(), `Today ${dateISO}`);
  }
});

test("Today speaks no animal or element name to a screen reader", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await pinClock(context, "2026-07-07T09:00:00+07:00");
  await page.goto("/today/");
  await expect(page.locator("main [data-day-tone]").first()).toBeVisible();

  // Link URLs appear in the snapshot but are never spoken; topic ids in them may name a mechanic.
  const spoken = (await page.locator("main").ariaSnapshot())
    .split("\n")
    .filter((line) => !line.trim().startsWith("- /url:"))
    .join("\n");
  expectPlain(spoken, "Today's accessibility tree");
});

test("the onboarding look step previews carry no pillar words", async ({ page, context }) => {
  await pinClock(context, "2026-07-07T09:00:00+07:00");
  await walkOnboardingToLookStep(page);

  expectPlain(await page.locator("main").innerText(), "the look step");
});

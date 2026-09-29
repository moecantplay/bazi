import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { FIXTURE_A, copiedText, seedProfile, stubShareAndClipboard } from "./helpers";

test("the chart card falls back to a PNG download without a share sheet", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await stubShareAndClipboard(context);
  await page.goto("/chart/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Share as image" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("daymaster-chart.png");
  await expect(page.getByText("Card saved to your downloads.")).toBeVisible();
});

test("a chart link round-trips into Compare's add-person form", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await stubShareAndClipboard(context);

  await page.goto("/chart/");
  await page.getByRole("button", { name: "Copy chart link" }).click();
  await expect(page.getByText(/Link copied/)).toBeVisible();
  const url = await copiedText(page);
  // The birth details ride in the fragment, which never reaches the server (M19.8-03).
  expect(url).toContain("/onboarding/#share=");
  expect(url).not.toContain("?share=");

  // Opening the link on a device that already has a profile lands on Compare,
  // form prefilled with the sender's details.
  await page.goto(url);
  await expect(page).toHaveURL(/\/compare\/?$/);
  await expect(page.getByLabel("Their birth date")).toHaveValue(FIXTURE_A.birth.date);
  await expect(page.getByLabel("Their birth time")).toHaveValue(FIXTURE_A.birth.time);

  // Name them and read the pair without retyping anything else.
  await page.getByLabel("Their name").fill("Sender");
  await page.getByRole("button", { name: "Read the pair" }).click();
  await expect(page.getByRole("heading", { name: "Sender" })).toBeVisible();
});

/** Copy Fixture A's chart link from the Chart screen. */
async function copyChartLink(page: Page, context: BrowserContext): Promise<string> {
  await seedProfile(context, FIXTURE_A);
  await stubShareAndClipboard(context);
  await page.goto("/chart/");
  await page.getByRole("button", { name: "Copy chart link" }).click();
  await expect(page.getByText(/Link copied/)).toBeVisible();
  return copiedText(page);
}

test("a link sent before M19.8 (?share=) still opens in Compare", async ({ page, context }) => {
  const legacyUrl = (await copyChartLink(page, context)).replace("#share=", "?share=");

  await page.goto(legacyUrl);
  await expect(page).toHaveURL(/\/compare\/?$/);
  await expect(page.getByLabel("Their birth date")).toHaveValue(FIXTURE_A.birth.date);
});

test("on a fresh device the link waits for onboarding and leaves the address bar clean", async ({ page }) => {
  // This context has no chart. The link is built the way buildShareUrl does
  // (base64url JSON of the birth) rather than copied from a second context.
  const payload = Buffer.from(JSON.stringify(FIXTURE_A.birth)).toString("base64url");

  await page.goto(`/onboarding/#share=${payload}`);
  await expect(page.getByText("A chart came with your link.")).toBeVisible();
  expect(await page.evaluate(() => [window.location.hash, window.location.search])).toEqual(["", ""]);
});

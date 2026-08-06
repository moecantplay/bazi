import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

test("the chart card falls back to a PNG download without a share sheet", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);
  await page.goto("/chart/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Share as image" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("daymaster-chart.png");
  await expect(page.getByText("Card saved to your downloads.")).toBeVisible();
});

test("a chart link round-trips into Compare's add-person form", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/chart/");
  await page.getByRole("button", { name: "Copy chart link" }).click();
  await expect(page.getByText(/Link copied/)).toBeVisible();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toContain("/onboarding/?share=");

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

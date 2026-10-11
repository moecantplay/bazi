import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

/** M24-09: People — saved people first, one button to add someone, a plain pair reading. */
test("People adds someone and reads the pair in plain words", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await page.goto("/people/");

  await page.getByLabel("Their name").fill("Ana");
  await page.getByLabel("Their birth date").fill("1994-02-03");
  await page.getByLabel("Their birth time").fill("12:00");
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("option", { name: /Jakarta, Indonesia/ }).getByRole("button").click();
  await page.getByRole("radio", { name: "Female" }).click();
  await page.getByRole("button", { name: "Read the pair" }).click();

  const lead = page.getByLabel("You and Ana");
  await expect(lead.getByRole("heading")).toBeVisible();
  await expect(lead.getByText("One thing to try")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add someone" })).toBeVisible();
  await page.getByRole("link", { name: /The full comparison/ }).click();
  await expect(page).toHaveURL(/\/compare\/$/);
});

import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

/** M24-08: You, in plain words, with "Your chart in full" one tap in. */
test("You leads with the portrait, shows your elements and colours, and opens the full chart", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await page.goto("/you/");

  await expect(page.getByRole("heading", { name: "You are the mountain: slow to move, impossible to ignore." })).toBeVisible();

  const elements = page.getByLabel("Your elements");
  await expect(elements.getByText("What helps you")).toBeVisible();
  await expect(elements.getByText("What wears you down")).toBeVisible();
  await expect(elements.getByText("Fire", { exact: true })).toBeVisible();

  const colours = page.getByLabel("Your colours");
  await expect(colours.getByText("Colours that suit you")).toBeVisible();
  await expect(colours.getByText("Go easy on")).toBeVisible();
  await expect(colours).toContainText("If you live in black, add one red thing");

  await expect(page.getByLabel("What shapes you").getByText("Better in good company")).toBeVisible();

  await page.getByRole("link", { name: /Your chart in full/ }).click();
  await expect(page).toHaveURL(/\/chart\/$/);
});

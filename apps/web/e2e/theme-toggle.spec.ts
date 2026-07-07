import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

const THEME_KEY = "daymaster.theme.v1";

async function bodyBackground(page: import("@playwright/test").Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test("appearance choice pins the theme, survives reload, follows the OS on System", async ({
  page,
  context
}) => {
  await seedProfile(context, FIXTURE_A);

  // Default: no pinned theme, light OS -> light paper.
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/settings/");
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  const lightBackground = await bodyBackground(page);

  // System follows the OS without any stored preference.
  await page.emulateMedia({ colorScheme: "dark" });
  const systemDarkBackground = await bodyBackground(page);
  expect(systemDarkBackground).not.toBe(lightBackground);

  // Pinning Light beats a dark OS.
  await page.getByRole("radio", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bodyBackground(page)).toBe(lightBackground);

  // Pinning Dark stamps the attribute and darkens the paper.
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await bodyBackground(page)).toBe(systemDarkBackground);

  // The pin survives a reload (stamped before first paint by the inline script).
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");

  // Back to System: attribute cleared, storage cleared.
  await page.getByRole("radio", { name: "System" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  const stored = await page.evaluate((key) => window.localStorage.getItem(key), THEME_KEY);
  expect(stored).toBeNull();
});

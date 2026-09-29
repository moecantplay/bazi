import { expect, test, type Page } from "@playwright/test";
import {
  E2E_LOOK,
  FIXTURE_A,
  STORE_KEY,
  completeOnboarding,
  pinClock,
  seedProfile,
  seedStore,
  stubShareAndClipboard
} from "./helpers";

/**
 * Anonymous usage counts (M19.8-06), against the E2E build's stub tracker
 * (e2e/fake-analytics.js). The stub records calls in the page, so each check
 * reads them before navigating away.
 */

interface RecordedCall {
  name?: string;
  data?: Record<string, unknown> | null;
  pageview?: string;
}

const calls = (page: Page) =>
  page.evaluate(() => (window as unknown as { __analyticsCalls?: RecordedCall[] }).__analyticsCalls ?? []);

const events = async (page: Page, name: string) =>
  (await calls(page)).filter((call) => call.name === name);

test("Today counts the first open of the day with only coarse buckets", async ({ page, context }) => {
  await pinClock(context, "2026-09-29T05:00:00.000Z");
  await seedProfile(context, FIXTURE_A);

  await page.goto("/today/");
  await expect.poll(async () => (await events(page, "reading-opened")).length).toBe(1);
  const [opened] = await events(page, "reading-opened");
  expect(Object.keys(opened.data ?? {}).sort()).toEqual(["installed", "look", "sinceFirstChart", "streak", "theme"]);
  expect(opened.data).toMatchObject({ installed: "no", streak: "1", sinceFirstChart: "90+" });

  // A second open the same day is not a second reader-day.
  await page.reload();
  await expect.poll(async () => (await calls(page)).some((call) => call.pageview !== undefined)).toBe(true);
  expect(await events(page, "reading-opened")).toHaveLength(0);
});

test("page views carry the route only", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/chart/?from=somewhere#section");
  await expect.poll(async () => (await calls(page)).map((call) => call.pageview).filter(Boolean)).toEqual(["/chart/"]);

  const script = await page.evaluate(() => (window as unknown as { __analyticsScript: Record<string, string> }).__analyticsScript);
  expect(script).toMatchObject({ "data-website-id": "e2e", "data-auto-track": "false" });
});

test("no birth detail, note or identifier ever leaves in a payload", async ({ page, context }) => {
  await stubShareAndClipboard(context);
  await seedProfile(context, FIXTURE_A);

  await page.goto("/today/");
  await page.getByRole("button", { name: "Rang true" }).click();
  await page.getByPlaceholder("What actually happened").fill("private note about my sister");
  const todayCalls = await calls(page);

  await page.goto("/chart/");
  await page.getByRole("button", { name: "Copy chart link" }).click();
  await expect(page.getByText(/Link copied/)).toBeVisible();
  const chartCalls = await calls(page);

  const everything = JSON.stringify([...todayCalls, ...chartCalls]);
  expect(everything).toContain("reading-marked");
  expect(everything).toContain("chart-shared");
  for (const secret of ["1994-12-08", "16:30", "Jakarta", "Indonesia", "private note", "male"]) {
    expect(everything, secret).not.toContain(secret);
  }
  expect(await page.evaluate(() => document.cookie)).toBe("");
  // Counting writes nothing of its own: every stored key is the app's.
  const keys = await page.evaluate(() => [...Object.keys(window.localStorage), ...Object.keys(window.sessionStorage)]);
  expect(keys.filter((key) => !key.startsWith("daymaster."))).toEqual([]);
});

test("turning counts off in Settings stops events and the script", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);

  await page.goto("/settings/");
  const toggle = page.getByRole("switch", { name: "Share anonymous usage counts" });
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  await page.getByRole("button", { name: "Download my data" }).click();
  expect(await events(page, "backup-downloaded")).toHaveLength(0);

  await page.goto("/today/");
  await page.waitForLoadState("networkidle");
  expect(await page.evaluate(() => "umami" in window)).toBe(false);
});

test("a reader who chose no counts is never counted", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await seedStore(context, { usageCounts: false });

  const scriptRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/__e2e/analytics.js")) {
      scriptRequests.push(request.url());
    }
  });
  await page.goto("/today/");
  await page.waitForLoadState("networkidle");
  expect(scriptRequests).toEqual([]);
});

test("Global Privacy Control means nothing is counted, and Settings says so", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true });
  });

  await page.goto("/settings/");
  await expect(page.getByText("Your browser asks sites not to track you, so nothing is counted.")).toBeVisible();
  await expect(page.getByRole("switch", { name: "Share anonymous usage counts" })).toHaveCount(0);
  expect(await page.evaluate(() => "umami" in window)).toBe(false);
});

test("choosing a look in Settings is counted with where it was chosen", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);

  // Pick a look other than the one this pass seeded, so the choice is a change.
  const [look, name] = E2E_LOOK === "dial" ? ["almanac", "Editorial"] : ["dial", "Instrument"];

  await page.goto("/settings/");
  await page.getByRole("radio", { name: new RegExp(`^${name}`) }).click();
  await expect.poll(async () => events(page, "look-chosen")).toEqual([
    { name: "look-chosen", data: { look, where: "settings" } }
  ]);
});

test("onboarding counts each step reached and the look it finished with", async ({ page }) => {
  await completeOnboarding(page, "Editorial");
  await expect(page).toHaveURL(/\/today\/?$/);

  const steps = (await events(page, "onboarding-step")).map((call) => call.data?.step);
  expect(steps).toEqual(["date", "time", "city", "sex", "disclaimer", "look", "reveal"]);
  expect(await events(page, "onboarding-finished")).toEqual([
    { name: "onboarding-finished", data: { look: "almanac" } }
  ]);
  expect(await events(page, "look-chosen")).toEqual([
    { name: "look-chosen", data: { look: "almanac", where: "onboarding" } }
  ]);
});

test("a broken screen is counted by route and error name, never the message", async ({ page }) => {
  await page.goto("/onboarding/");
  await page.evaluate(
    ([key, profile]) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({ app: "daymaster", version: 2, updatedAt: "2026-09-29T00:00:00.000Z", profile: JSON.parse(profile) })
      );
    },
    [STORE_KEY, JSON.stringify({ ...FIXTURE_A, birth: { ...FIXTURE_A.birth, date: "2150-01-01" } })] as const
  );

  await page.goto("/today/");
  await expect.poll(async () => events(page, "screen-error")).toEqual([
    { name: "screen-error", data: { route: "/today/", kind: "RangeError" } }
  ]);
  expect(JSON.stringify(await calls(page))).not.toContain("2150");
});

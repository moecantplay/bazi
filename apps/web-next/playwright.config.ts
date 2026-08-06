import { defineConfig, devices } from "@playwright/test";

/**
 * E2E against the real static export (apps/web-next/out), served by a tiny
 * static file server — never `next dev`. Run via `pnpm --filter
 * @daymaster/web-next e2e`, which installs the browser, builds the export,
 * then runs these specs.
 *
 * Port 3211, deliberately distinct from apps/web's 3210 (decision D, M19
 * plan) so both suites can coexist in one session without colliding.
 *
 * CHROME_PATH, when set, points Playwright at an existing Chromium binary so a
 * machine that can't download the managed browser can still run the suite.
 */

const chromePath = process.env.CHROME_PATH;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${process.env.E2E_PORT ?? 3211}`,
    // Date labels format in the device locale; pin it so e2e/helpers.longDate
    // (en-GB) keeps matching what the app renders.
    locale: "en-GB",
    trace: "retain-on-failure",
    ...(chromePath ? { launchOptions: { executablePath: chromePath } } : {})
  },
  webServer: {
    command: "node e2e/static-server.mjs",
    url: `http://localhost:${process.env.E2E_PORT ?? 3211}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});

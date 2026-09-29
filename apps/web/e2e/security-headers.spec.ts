import { expect, test } from "@playwright/test";
import { FIXTURE_A, seedProfile } from "./helpers";

/**
 * The E2E server applies the same out/vercel.json production deploys with
 * (M19.8-05), so these hold for the live site and the whole suite runs under
 * the real CSP.
 */

const ROUTES = ["/today/", "/chart/", "/cycles/", "/compare/", "/dates/", "/conditions/", "/settings/"];

test("every document carries the security headers", async ({ request }) => {
  for (const path of ["/", "/today/", "/onboarding/"]) {
    const response = await request.get(path);
    const headers = response.headers();
    const csp = headers["content-security-policy"] ?? "";
    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("frame-ancestors 'none'");
    expect(csp, path).toContain("object-src 'none'");
    expect(headers["x-content-type-options"], path).toBe("nosniff");
    expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"], path).toBe("DENY");
    expect(headers["permissions-policy"], path).toContain("geolocation=()");
  }
});

test("hashed assets are immutable and the service worker is never cached", async ({ request }) => {
  const html = await (await request.get("/onboarding/")).text();
  const chunkPath = html.match(/\/_next\/static\/[^"']+\.js/)?.[0];
  expect(chunkPath).toBeDefined();

  const chunk = await request.get(chunkPath as string);
  expect(chunk.headers()["cache-control"]).toBe("public, max-age=31536000, immutable");

  const sw = await request.get("/sw.js");
  expect(sw.headers()["cache-control"]).toBe("no-cache");
});

test("no screen trips the content security policy", async ({ page, context }) => {
  await seedProfile(context, FIXTURE_A);
  await context.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { __cspViolations: violations });
    document.addEventListener("securitypolicyviolation", (event) => {
      violations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });

  for (const path of ROUTES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const violations = await page.evaluate(
      () => (window as unknown as { __cspViolations: string[] }).__cspViolations
    );
    expect(violations, path).toEqual([]);
  }
});

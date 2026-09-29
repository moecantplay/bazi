# Design — E2E on phones, including WebKit

## Approach

Add two `projects` entries using Playwright's device descriptors. `share.spec.ts` clipboard permissions differ in WebKit; grant per-project or skip with a stated reason. CI installs `chromium webkit --with-deps`.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/playwright.config.ts` | Two projects |
| `.github/workflows/verify.yml` | WebKit install |

## Alternatives considered

BrowserStack or real devices: cost, and nothing here needs them yet.

## Risks

Runtime roughly triples; depends on the open question.

## Verification

Green locally and in CI.

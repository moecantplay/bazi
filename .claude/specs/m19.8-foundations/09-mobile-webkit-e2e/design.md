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

## As built

WebKit triage — every failure was a test assumption; no app bug spun off:

- **Clipboard** (3 tests): Playwright's WebKit has no `clipboard-read`/`clipboard-write` permission. New `stubShareAndClipboard`/`copiedText` helpers (e2e/helpers.ts) record writes instead of using the real clipboard, in every project.
- **Share sheet** (1 test): the emulated iPhone exposes `navigator.share`, so "falls back to a PNG download without a share sheet" never reached the fallback. The same stub removes `share`/`canShare`, which is what the test's title describes.
- **Offline** (1 test): Playwright's WebKit fails an offline navigation served by the service worker with "internal error" — a tool limitation. Skipped on WebKit with that reason; offline on iOS needs a real-iPhone check.

Local run time per look across three projects ≈ 2 min, so CI E2E ≈ 6 min.

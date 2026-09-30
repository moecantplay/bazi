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

First CI runs (2026-09-29, 2026-09-30) — two more WebKit test assumptions that macOS WebKit hides; both fixed in the tests:

- **No `navigator.storage`** (durable-storage, 2 tests): Playwright's Linux WebKit has no StorageManager, so the spy's init script threw before installing. The first test saw 0 calls; "no chart, no request" passed only because nothing was counted. One `spyOnPersistence` helper now installs a stand-in when `navigator.storage` is missing. Removing `navigator.storage` locally reproduces the CI failure on the old spec, and the new spec passes all three projects.
- **Stepping the ±30-day clamp** (chart-today-datenav): about 95 day-steps at ~0.8 s each on CI WebKit (the trace) outran the 30 s test timeout. The test now jumps to ±28 with the date picker and steps the last two days. Local WebKit time went from 8.6 s to 4.7 s.

Spun off: Instrument's agency board clears the bottom nav by 18 px at 390×844 on macOS. Taller Linux text puts it 8 px under the nav, failing `today-looks.spec.ts` "dial: … above the nav" in both Chromium projects. That's a real layout problem, not a test assumption, so it gets its own ticket.

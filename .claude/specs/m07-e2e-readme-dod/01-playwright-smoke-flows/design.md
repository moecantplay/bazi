# Design — Playwright smoke flows

Reconstructed 2026-09-29 from: `_sources/plan.md` §M7, `_sources/progress.md` §M7, `_sources/decisions-log.md` 2026-07-07. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Web logic lives in packages; the web app is covered by Playwright E2E rather than unit tests.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/e2e/` | three specs |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Single worker, pinned clock, real static export.

## Decisions

- 2026-07-07 apps/web has no unit tests by design; logic lives in packages, web is covered by Playwright E2E. (Later softened: M19 added a few store tests.)

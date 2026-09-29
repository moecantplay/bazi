# Design — Dark theme implementation

Reconstructed 2026-09-29 from: `_sources/plan.md` §M9, `_sources/progress.md` §M9. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Pre-paint script reads the stored preference before first render.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/layout.tsx`, `globals.css` | theme tokens + pre-paint script |
| `apps/web/e2e/theme-toggle.spec.ts` | E2E |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E theme spec.

## Decisions

None logged for this ticket.

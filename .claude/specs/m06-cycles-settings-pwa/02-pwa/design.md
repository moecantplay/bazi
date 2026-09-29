# Design — Installable PWA

Reconstructed 2026-09-29 from: `_sources/plan.md` §M6, `_sources/progress.md` §M6. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Static export with trailing slashes so routes precache cleanly. (Service worker rebuilt in M12-03.)

## Changes

| Area | Change |
| --- | --- |
| `apps/web/public/` | manifest, sw.js |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Installability checks on the served export.

## Decisions

None logged for this ticket.

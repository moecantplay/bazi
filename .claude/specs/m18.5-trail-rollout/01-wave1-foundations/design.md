# Design — Wave 1 — Foundations

Reconstructed 2026-09-29 from: `_sources/plan.md` §M18.5, `_sources/progress.md` §M18.5. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Terrain stamped client-side in ProfileGate (terrain has no meaning before onboarding).

## Changes

| Area | Change |
| --- | --- |
| `apps/web/scripts/generate-tokens.mjs` | token generator |
| `apps/web/src/app/globals.css` | primitives |

## Alternatives considered

Not recorded.

## Risks

Found: the wood/light fallback never responded to dark mode before a terrain was stamped — fixed with a theme-keyed pre-terrain ground.

## Verification

Verify + screenshots.

## Decisions

None logged for this ticket.

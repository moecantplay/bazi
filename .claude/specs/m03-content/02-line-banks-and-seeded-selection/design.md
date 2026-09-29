# Design — Line banks and seeded selection

Reconstructed 2026-09-29 from: `_sources/plan.md` §M3, `_sources/progress.md` §M3. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

FNV-1a hash of a seed string drives every pick.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/banks/` | line banks |
| `packages/content/src/hash.ts` | seeded selection |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Determinism tests; reviewer pass.

## Decisions

None logged for this ticket.

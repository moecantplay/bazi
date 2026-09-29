# Design — Today scoped to the day

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-08-21 day-only entry, commit `b4f5e05`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Fix at the single root; downstream is pure so it stopped everywhere at once. `transitWhen()` left in place (never called with annual).

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/src/facts.ts` | day-only facts |

## Alternatives considered

Not recorded.

## Risks

The type still allows mixing — M20-08 makes it a type error.

## Verification

Engine tests; E2E; live check.

## Decisions

- 2026-08-21 Today reclassified to day-only content; month/year exclusively Cycles'.

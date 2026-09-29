# Design — Reading facts and fixture coverage

Reconstructed 2026-09-29 from: `_sources/plan.md` §M2, `_sources/progress.md` §M2. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Facts as a discriminated union consumed by content. (Annual transits in dailyFacts were later removed — M19.5-03.)

## Changes

| Area | Change |
| --- | --- |
| `src/facts.ts` | fact emission |
| `test/edge-fixtures.test.ts` | edge fixtures |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Coverage threshold enforced in vitest config.

## Decisions

None logged for this ticket.

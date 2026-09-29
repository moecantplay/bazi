# Design — Compare: saved people

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 people entry, commit `909ebc5`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Legacy single companion migrates on first Compare load.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/people.ts` | people store |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E.

## Decisions

- 2026-07-08 Compare people: daymaster.people.v1 (named list) + daymaster.people-active.v1; legacy daymaster.compare.v1 auto-migrates to a person named "Them" on first Compare load.

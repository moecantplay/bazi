# Design — Store sync

## Approach

Sync on app open, on store write (debounced), and on regaining network.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store/sync.ts` | Sync loop |
| API | GET/PUT envelope |

## Alternatives considered

CRDT/field merge: far more complexity than one user's own devices need.

## Risks

Clock skew breaking last-write-wins; use server-assigned timestamps.

## Verification

E2E: two storage-isolated browser contexts converge; conflict prompt on first sign-in.

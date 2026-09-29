# Design — Infrastructure and schema

## Approach

Schema shaped by the existing v2 store document so the client's backup envelope is what the server stores, whole.

## Changes

| Area | Change |
| --- | --- |
| new `apps/api` or Next API routes (per 01) | Server code |
| `db/migrations/` | Schema |

## Alternatives considered

Per-field tables for profile/people/journal: premature; whole-envelope sync is the M21 plan.

## Risks

Envelope growth (journal) — measure size at 1 year of daily entries.

## Verification

Migrations apply cleanly to an empty database; staging reachable.

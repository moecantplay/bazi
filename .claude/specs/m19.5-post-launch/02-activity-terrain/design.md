# Design — Per-activity terrain gauge

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-08-21 activity entry, commit `7a97000`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

SVG holds only the dashed path; dots and labels are HTML on top (non-uniform SVG scaling distorts circles and text).

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/src/activity-terrain.ts` | model |
| `apps/web` activity-terrain | component |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E; both themes.

## Decisions

- 2026-08-21 Per-activity terrain gauge revived; trail signs remain the curated top-3 summary, this is the full 10-activity detail under it.

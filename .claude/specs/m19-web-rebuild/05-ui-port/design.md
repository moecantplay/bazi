# Design — UI port

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 6–8, `_sources/decisions-log.md` 2026-08-05 cinnabar entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Faithful ports of the verified Trail implementation, re-sourced from presentation.

## Changes

| Area | Change |
| --- | --- |
| `apps/web-next/src/` | new app |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Scripted click-throughs; E2E in Phase 10.

## Decisions

- 2026-08-05 Live bug: `--cinnabar` was referenced but never defined in either app — the seal had rendered black since M18.5. Fixed in both. Lesson: add a "every var(--x) is defined" check (now M20-09).

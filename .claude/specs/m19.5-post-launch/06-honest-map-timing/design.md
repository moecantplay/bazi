# Design — Map marks honest about time

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 map entries, commits `b733651`, `c29e984`, `cc8f190`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Only clash + combine hours (exactly one block each); hour-vs-chart rejected (repeats daily, lights most blocks).

## Changes

| Area | Change |
| --- | --- |
| engine `facts.ts` | hour-interaction |
| content `banks/hour-interactions.ts` | hours line |
| presentation route-waypoints, map-hero | timing |

## Alternatives considered

Rewording the legend only; hour-vs-chart interactions (both rejected).

## Risks

Not recorded.

## Verification

E2E; live screenshots across three day branches × both themes.

## Decisions

- 2026-09-10 Map-hero marks honest about time.
- 2026-09-10 Follow-up: labels below marks; map ↔ rail cross-reference; `ReadingArea` type; onboarding hydration fix.

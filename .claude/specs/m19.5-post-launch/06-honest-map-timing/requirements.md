# Map marks honest about time

Status: done · Milestone: M19.5 · Ticket: 06

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 map entries, commits `b733651`, `c29e984`, `cc8f190`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

"The moment signs clash seems inaccurate because everyday the signs clash on the same time" (owner): day-long relations sat at fake hours.

## Goal

Day-long relations shown as all-day; only genuinely timed marks on the route.

## Requirements

- **R1.** Day-long relation marks move to an ALL DAY row; the route carries the day's rough and easy hour (new `hour-interaction` fact).
  - Acceptance: `hourInteractionFacts(dayBranch)`.
- **R2.** Timed labels stack below their mark; map and rail cross-reference by waypoint number; hours get their own section.
  - Acceptance: `c29e984`.
- **R3.** Onboarding hydration error on refresh fixed.
  - Acceptance: `cc8f190`; E2E guard.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

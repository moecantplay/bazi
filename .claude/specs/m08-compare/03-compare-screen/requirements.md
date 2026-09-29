# Compare screen and E2E

Status: done · Milestone: M8 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/plan.md` §M8, `_sources/progress.md` §M8. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Users needed a place to enter a second person and read the pair.

## Goal

/compare as a fifth tab, persisted locally.

## Requirements

- **R1.** Compact second-birth form (unknown time, city, sex); companion at `daymaster.compare.v1`; same engine config as primary; both pillar grids + cited reading cards; change-person clears.
  - Acceptance: shipped.
- **R2.** Delete-my-data clears the companion; SW precaches /compare/.
  - Acceptance: cache bumped v2.
- **R3.** E2E: fill → read pair → reload persists → change person clears.
  - Acceptance: 5/5 flows green, verify green.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

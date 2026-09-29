# Live "you are here" marker

Status: done · Milestone: M19.5 · Ticket: 04

Reconstructed 2026-09-29 from: commit `96e2e63`, `_sources/decisions-log.md` 2026-09-10 map entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The map's "you are here" was static.

## Goal

The marker tracks the real time of day on today's view.

## Requirements

- **R1.** Dot + pill at the live point on the drawn route (0 at 6am, 1 at 10pm) via getPointAtLength.
  - Acceptance: only live on today's own view.
- **R2.** MORNING/EVENING labels legible over contours; bookend labels step aside from the live dot.
  - Acceptance: ink halo via paint-order stroke.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

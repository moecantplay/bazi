# Today tweaks

Status: done · Milestone: M17.5 · Ticket: 01

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 Today tweaks entry, commit `1b5fb76`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

From screenshots: the week strip was buried, the at-a-glance dot read as a draggable slider, the streak line was always the same.

## Goal

Three Today adjustments.

## Requirements

- **R1.** Week strip back under the date nav.
  - Acceptance: M17's demotion reversed.
- **R2.** At-a-glance bar grows from the center tick; no round marker; bare axis when neutral.
  - Acceptance: shipped.
- **R3.** Streak line cycles fun wordings deterministically per day (FNV hash of the date).
  - Acceptance: `streakLine` in `lib/streak.ts`.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Line banks and seeded selection

Status: done · Milestone: M3 · Ticket: 02

Reconstructed 2026-09-29 from: `_sources/plan.md` §M3, `_sources/progress.md` §M3. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Readings need enough lines to vary, chosen deterministically so the same person on the same day always sees the same reading.

## Goal

Natal, daily and luck-transition banks with seeded selection; zero chart math in content.

## Requirements

- **R1.** Natal bank ~120, daily bank ~150, luck transitions.
  - Acceptance: natal 114; daily 62 templates → ~139 rendered variants; luck transitions 10.
- **R2.** Selection seeded by hash(birth data + ISO date), never Math.random.
  - Acceptance: FNV-1a; determinism tests.
- **R3.** Content does zero chart math.
  - Acceptance: reviewer APPROVE.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

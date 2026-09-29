# Terrain labels

Status: done · Milestone: M19.5 · Ticket: 07

Reconstructed 2026-09-29 from: commits `93a82cd`, `3dc4d77`, `063b267`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Activity labels on the terrain crossed the route at phone widths.

## Goal

Labels that never cross the route.

## Requirements

- **R1.** Attempt 1: staggered lane below the plot.
  - Acceptance: `93a82cd` — read as a detached table.
- **R2.** Attempt 2: only leaning activities named, above/below.
  - Acceptance: `3dc4d77`.
- **R3.** Owner pick: all ten names on 45° tags below a staked baseline.
  - Acceptance: `063b267`; E2E asserts all ten.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

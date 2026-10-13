# NOW pill covers an hour label

Status: draft · Milestone: M24 · Ticket: 14 · Found during M24-13; needs owner approval

## Problem

On Explorer, when the morning marks crowd the start of the route, the "NOW 10:00" pill sits on top of a timed mark's label. In the M24-13 mockups (Fixture A, 2026-10-13 and 2026-10-15, 10:00), the pill covers most of "ROUGH · 3–5 AM" / "ROUGH · 7–9 AM". This happens in production today, with or without the best hour. The label is placed down-right of its mark because up-left would run off the left edge (`labelPlacement`, `route-geometry.ts`), which is exactly where the pill hangs below NOW.

DESIGN.md §Explorer says NOW's pill sits below its disc and a label that can't go up-left goes down-right. It doesn't say what happens when the two meet.

## Goal

No timed-mark label is ever covered by the NOW pill, at any time of day.

## Requirements

- **R1.** A timed label and the NOW pill never overlap.
  - Acceptance: a presentation or web unit test sweeps every hour of the day over a year of days for every fixture and finds no label box intersecting the pill box. An E2E screenshot of the 2026-10-13 10:00 case shows the label readable.

## Out of scope

- Moving NOW or the marks themselves.

## Open questions

- [ ] Fix by moving the label (for example, above the mark when the pill is below it), or by lifting the pill above its disc while it passes a label, as the legacy map did ("YOU ARE HERE" lifted)?

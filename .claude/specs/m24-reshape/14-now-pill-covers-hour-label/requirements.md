# NOW pill covers an hour label

Status: draft · Milestone: M24 · Ticket: 14 · Found during M24-13; needs owner approval

## Problem

On Explorer, when the morning marks crowd the start of the route, the "NOW 10:00" pill sits on top of a timed mark's label. In the M24-13 mockups (Fixture A, 2026-10-13 and 2026-10-15, 10:00), the pill covers most of "ROUGH · 3–5 AM" / "ROUGH · 7–9 AM". This happens in production today, with or without the best hour. The label is placed down-right of its mark because up-left would run off the left edge (`labelPlacement`, `route-geometry.ts`), which is exactly where the pill hangs below NOW.

DESIGN.md §Explorer says NOW's pill sits below its disc and a label that can't go up-left goes down-right. It doesn't say what happens when the two meet.

**Measured 2026-10-14.** A geometry sweep over every real day shape (each rough × easy × best-hour block, spread as `spreadTimed` does) and every 10 minutes from 6 am to 10 pm finds the pill covering a label in about 18% of cases: only down-right labels (marks in the first third of the route), with NOW between about 9:15 am and 7:30 pm. Screenshots of the production composition (Fixture A, 2026-10-13, Explorer, light) show more than the ticket first named:

| Time | What collides |
| --- | --- |
| 6:30 | The pill runs off the left and bottom edges and covers MORNING |
| 8:30 | The pill covers MORNING |
| 10:00 | The pill covers "SUITS YOU · 1–3 AM"; the NOW disc also sits on top of the best-hour and rough discs |

The 10:00 disc overlap comes from clamping: small-hours blocks (1–3 am, 3–5 am) are drawn at progress 0.2–0.34, the 9–11 am stretch, so NOW walks over them mid-morning.

Neither fix in the open question works on its own. Lifting the pill straight above its disc runs it into the climbing route in 75% of the cases that need it. Moving the label has no free side: up-left is off the edge (that's why it went down-right), and the pill passes through down-right. Trying seven spots around the disc in turn still leaves about 30% of the cases with no clear spot.

## Goal

No timed-mark label is ever covered by the NOW pill, at any time of day.

## Requirements

- **R1.** A timed label and the NOW pill never overlap.
  - Acceptance: a presentation or web unit test sweeps every hour of the day over a year of days for every fixture and finds no label box intersecting the pill box. An E2E screenshot of the 2026-10-13 10:00 case shows the label readable.

## Out of scope

- Moving NOW or the marks themselves.

## Open questions

- [ ] Fix by moving the label (for example, above the mark when the pill is below it), or by lifting the pill above its disc while it passes a label, as the legacy map did ("YOU ARE HERE" lifted)?
- [ ] Widen the ticket to MORNING, the edges and the NOW disc over other marks, or keep it to labels?
- [ ] Given the measurements, take the clock out of the moving pill (for example, a fixed spot on the hero that nothing else uses), or keep a moving pill that tries several spots?

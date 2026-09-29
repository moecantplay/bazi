# English-first default and pillar grid

Status: done · Milestone: M17.5 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 English-first entry, commits `47caa14`, `c8abac9`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

From screenshots: "make the whole app wording as english first instead of mandarin first".

## Goal

Glosses as the default wording; a pillar grid whose rows line up.

## Requirements

- **R1.** Han toggle defaults to off; `daymaster.han.v1` inverted ("show" = on, absence = off; legacy "hide" reads as absence).
  - Acceptance: E2E asserts glosses by default.
- **R2.** Pillar grid rebuilt as 4 columns × 6 rows with per-column subgrid.
  - Acceptance: fixes the day column's branch floating above its neighbours.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

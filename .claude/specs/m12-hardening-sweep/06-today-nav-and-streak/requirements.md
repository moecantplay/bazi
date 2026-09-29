# Today date nav and streak

Status: done · Milestone: M12 · Ticket: 06

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 push entry, commits `a18a62a`, `8a852d2`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Date navigation was step-only; nothing encouraged coming back.

## Goal

Jump-to-date, and a local return habit without push.

## Requirements

- **R1.** Tap the date → native picker clamped to ±30d; boundary explains itself; aria-live on day changes.
  - Acceptance: shipped.
- **R2.** Streak line ("N days running", localStorage, cleared by delete); come-back-tomorrow note after the agency card.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

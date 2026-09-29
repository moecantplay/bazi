# Data ownership: edit, backup, restore

Status: done · Milestone: M12 · Ticket: 04

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 backup entry, commits `70d9e59`, `e8fcc73`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Changing birth details meant deleting everything; there was no way to move data between devices.

## Goal

Edit in place, download a backup, restore from a file.

## Requirements

- **R1.** Edit birth details from Settings, reusing onboarding steps; confirm shows recomputed pillars; preferences untouched.
  - Acceptance: E2E.
- **R2.** Download-my-data JSON backup + restore on onboarding; delete confirm names everything it erases.
  - Acceptance: E2E round-trips all three.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

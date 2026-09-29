# Today fold and day journal

Status: done · Milestone: M19.5 · Ticket: 11

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 refinement entry (UI), commits `1c1d4bb`, `3d75bb6`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Today was long; there was no way to record how a reading landed.

## Goal

Fold secondary detail; add a per-day journal.

## Requirements

- **R1.** Trail signs and activity terrain merged into one card; Today folds after the reading behind "Go deeper · what the day suits".
  - Acceptance: signpost and journal stay outside the fold.
- **R2.** Per-day journal: "How is it landing?" Rang true / Didn't fit + optional 140-char note, today and past only; additive `journal` store field.
  - Acceptance: backups carry it; delete clears it.

## Out of scope

Current-location onboarding step; multi-person Compare.

## Open questions

None — closed at delivery.

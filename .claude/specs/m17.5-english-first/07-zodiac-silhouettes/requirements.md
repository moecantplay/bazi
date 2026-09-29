# Zodiac animal icons v2

Status: done · Milestone: M17.5 · Ticket: 07

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 zodiac entry, commits `2f386dc`, `d687c7c`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The owner rejected the abstract line faces and three rounds of hand-authored redraws.

## Goal

Recognizable animal silhouettes.

## Requirements

- **R1.** Filled single-path silhouettes in `lib/animal-icon-paths.ts` from owner-generated Gemini images via trace-and-polish (potrace → paper.js simplify → mirror → refit).
  - Acceptance: shipped.
- **R2.** Dragon ships two paths (compact default, detailed ≥40px); pillar grid seats icons in 48px tinted circles with 13px wording beneath.
  - Acceptance: shipped.
- **R3.** Install-sheet screenshots regenerated.
  - Acceptance: commit `d687c7c`.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

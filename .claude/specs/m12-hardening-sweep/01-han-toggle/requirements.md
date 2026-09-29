# Show Chinese characters toggle

Status: done · Milestone: M12 · Ticket: 01

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08, commit `f5b450d`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Characters everywhere excluded readers who don't read Chinese; the owner chose a toggle over an English-first redesign.

## Goal

A toggle that swaps glyphs for English glosses without a flash.

## Requirements

- **R1.** Default on; off swaps glyphs for glosses and strips Han from reading text; seal keeps its characters.
  - Acceptance: shipped.
- **R2.** Provider reads localStorage before first paint; stem+branch pairs strip to plain names.
  - Acceptance: E2E covers chart/today/cycles/compare + persistence.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Chinese characters removed

Status: done · Milestone: M17.5 · Ticket: 05

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 removal entry, commit `b63aa35`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

From screenshots, the owner wanted characters gone, not just off by default.

## Goal

English glosses are the only register.

## Requirements

- **R1.** No Settings toggle, no HanCharactersProvider, no `daymaster.han.v1`; reading text always runs through stripHanCharacters.
  - Acceptance: shipped.
- **R2.** Romanized names only where no translation exists, always with meaning beside them.
  - Acceptance: e.g. "rén water · chén earth".
- **R3.** Old backups carrying the retired preference still import; field ignored.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

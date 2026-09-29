# Compare: saved people

Status: done · Milestone: M12 · Ticket: 07

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 people entry, commit `909ebc5`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Compare held one companion; switching meant re-entering birth data.

## Goal

A named list of saved people.

## Requirements

- **R1.** `daymaster.people.v1` + `people-active.v1`; legacy `compare.v1` auto-migrates to a person named "Them".
  - Acceptance: E2E migration.
- **R2.** Switch without re-entry; per-person remove.
  - Acceptance: E2E add/switch/remove.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Structured content token runs

Status: done · Milestone: M19 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 2, 4, 11, `_sources/decisions-log.md` 2026-08-05 Phase 11 + 2026-08-06 cleanup entries. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Prose embedded Han characters and relied on `stripHanCharacters` to hide them.

## Goal

`ReadingLine` carries structured runs; the string API and strip retired.

## Requirements

- **R1.** ContentRun/TokenLine type; runs additive alongside text.
  - Acceptance: Phase 2: content 121/121; old app E2E 24/24.
- **R2.** All banks converted to runs.
  - Acceptance: Phase 4.
- **R3.** String fields, `strip-han.ts` and string branchToken/interactionTag deleted; DraftLine/finalizeLine boundary.
  - Acceptance: Phase 11 cleanup.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Single versioned store

Status: done · Milestone: M19 · Ticket: 04

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phase 3, `_sources/decisions-log.md` 2026-08-05 decision C. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Six independent localStorage keys, not shaped for future sync.

## Goal

One versioned document shaped like the sync payload.

## Requirements

- **R1.** `daymaster.store.v2`; migration on first load ingesting every legacy key in order, idempotent, dropping stray fields.
  - Acceptance: 7-test migration suite.
- **R2.** Backup v2 = same shape; deleteAllData clears store + streak + session keys.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

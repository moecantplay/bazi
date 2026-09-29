# Days read in the device zone

Status: done · Milestone: M19.5 · Ticket: 09

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 refinement entry (a), commit `d99a460`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Days were read in the birth zone even when the reader lived elsewhere.

## Goal

Days in the device zone; the chart stays in the birth zone.

## Requirements

- **R1.** `readingZoneOf(profile)` resolves a transient `readingZone` attached by ProfileGate and stripped on save.
  - Acceptance: never persisted/synced.
- **R2.** E2E pins `timezoneId: "Asia/Jakarta"`.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

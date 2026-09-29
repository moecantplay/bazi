# Today scoped to the day

Status: done · Milestone: M19.5 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-08-21 day-only entry, commit `b4f5e05`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

`dailyFacts()` mixed day and year facts; Today could be entirely about the year on days the day pillar had nothing.

## Goal

Today shows only day facts; month/year belong to Cycles.

## Requirements

- **R1.** `dailyFacts()` computes facts only from the day pillar (transits and stars).
  - Acceptance: engine 157/157.
- **R2.** Tests: annual fact absent; star exclusion on 2026-06-15 fixture.
  - Acceptance: red first, then green.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

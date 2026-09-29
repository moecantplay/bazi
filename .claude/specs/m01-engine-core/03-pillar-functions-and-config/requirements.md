# Pillar functions and engine config

Status: done · Milestone: M1 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/plan.md` §M1, `_sources/progress.md` §M1, `_sources/decisions-log.md` 2026-07-07 entries. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Given a birth instant and place, compute year, month, day and hour pillars, plus the daily/annual pillars readings need.

## Goal

Pure pillar functions with configurable school-dependent choices.

## Requirements

- **R1.** `sexagenary`, `yearPillar` (立春 boundary), `monthPillar` (jié + Five Tigers), `dayPillar` (anchor 1949-10-01 = 甲子, lateZiHour config), `hourPillar` (Five Rats), `annualPillar`, `dailyPillar`.
  - Acceptance: 50 tests green.
- **R2.** EngineConfig: lateZiHour and trueSolarTime (longitude offset + equation of time).
  - Acceptance: fixture D + EoT bounds tested.
- **R3.** Unknown birth time accepted (hour: null).
  - Acceptance: unknown-time fixtures.
- **R4.** Out-of-table years throw RangeError.
  - Acceptance: range-guard follow-up `b2833f9`.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Reading facts and fixture coverage

Status: done · Milestone: M2 · Ticket: 05

Reconstructed 2026-09-29 from: `_sources/plan.md` §M2, `_sources/progress.md` §M2. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The content layer must receive structured facts, not do chart math; the engine needed breadth of fixtures and coverage.

## Goal

`ReadingFact` emission plus ≥20 fixtures and ≥90% coverage.

## Requirements

- **R1.** `natalFacts` + `dailyFacts` emit deterministic ReadingFacts (annual + daily transits at this stage).
  - Acceptance: deterministic tests.
- **R2.** ≥15 extra fixtures: jié-edge ±2min, Feb 29, 23:00/01:00 exact, 11:59/12:00, unknown-time, backward luck.
  - Acceptance: ≥20 total fixtures.
- **R3.** Coverage ≥90% lines.
  - Acceptance: 90 tests, 97.7% lines.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

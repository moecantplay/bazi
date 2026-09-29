# Solar-term table

Status: done · Milestone: M1 · Ticket: 02

Reconstructed 2026-09-29 from: `_sources/plan.md` §M1, `_sources/progress.md` §M1. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Year and month pillars change on solar-term (jié) instants, which must be computed astronomically, not approximated.

## Goal

A generated table of jié instants 1900–2100 with a tested generator.

## Requirements

- **R1.** Generator using astronomy-engine produces jié instants 1900–2100 into `data/solar-terms.json`.
  - Acceptance: 2412 entries, strictly increasing.
- **R2.** Anchors: 立春 1994 = Feb 4 ±1d, 大雪 1994 = Dec 7 ±1d, 立春 2026 = Feb 4 ±1d.
  - Acceptance: anchors within ±1d.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

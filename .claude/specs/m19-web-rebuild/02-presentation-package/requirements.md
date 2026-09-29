# packages/presentation

Status: done · Milestone: M19 · Ticket: 02

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 1, 5. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

View logic lived in apps/web/src/lib with no unit tests.

## Goal

A React-free, unit-tested view-model package.

## Requirements

- **R1.** 18 pure files extracted; 67 tests, 99.51% lines.
  - Acceptance: Phase 1.
- **R2.** Content-dependent view-models: `todayScreenModel`, elevation, chart-preview, pillar-stars, map-hero, guidance-board, renderRun.
  - Acceptance: Phase 5: 125 tests, 99.68% lines.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

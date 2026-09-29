# Wave 4 — Verify

Status: done · Milestone: M18.5 · Ticket: 04

Reconstructed 2026-09-29 from: `_sources/plan.md` §M18.5, `_sources/progress.md` §M18.5, `_sources/decisions-log.md` 2026-08-05 M18.5 entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The rollout needed measuring on the real app, not just the prototype.

## Goal

Full verify, E2E, rendered contrast across terrains and themes, review.

## Requirements

- **R1.** E2E updated for renamed sections.
  - Acceptance: 24/24.
- **R2.** Rendered contrast on the built app, 5 terrains × 2 themes.
  - Acceptance: 3 real AA failures found and fixed (elevation labels fading, segmented unselected label ~4.0:1, legend tags on ink-tint); 0 failures after.
- **R3.** Code review.
  - Acceptance: APPROVE with 2 cleanups (dead `.hero-card` CSS, stale PWA themeColor), both fixed.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

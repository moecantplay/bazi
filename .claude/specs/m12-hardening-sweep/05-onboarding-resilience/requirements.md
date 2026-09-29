# Onboarding resilience

Status: done · Milestone: M12 · Ticket: 05

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, commit `134d229`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

A refresh mid-onboarding lost progress; screen readers didn't land on step titles.

## Goal

Draft survives refresh; step headings take focus.

## Requirements

- **R1.** Draft + step persist to sessionStorage.
  - Acceptance: refresh resumes.
- **R2.** Step headings take focus (no visible ring).
  - Acceptance: globals exempt tabindex=-1.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

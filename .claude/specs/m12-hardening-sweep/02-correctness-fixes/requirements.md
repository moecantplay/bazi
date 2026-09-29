# Correctness fixes

Status: done · Milestone: M12 · Ticket: 02

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, commits `049aba3`, `cc1e94a`, `9949ded`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Today stuck on yesterday after midnight, private browsing crashed onboarding, dates ignored the locale.

## Goal

Three correctness fixes.

## Requirements

- **R1.** Today re-anchors past midnight on focus/visibility.
  - Acceptance: E2E simulates rollover.
- **R2.** Storage writes guarded; private browsing shows a plain-words note.
  - Acceptance: shipped.
- **R3.** Dates format in the device locale.
  - Acceptance: E2E pins en-GB.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

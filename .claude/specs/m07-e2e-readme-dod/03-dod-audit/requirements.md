# Definition-of-done audit

Status: done · Milestone: M7 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/progress.md` DoD audit (final, 2026-07-07). Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

v1 needed to be checked against every item of the brief's definition of done.

## Goal

All ten DoD items green with evidence.

## Requirements

- **R1.** pnpm verify green from clean clone.
  - Acceptance: GREEN.
- **R2.** §5 golden tests; ≥20 fixtures; engine coverage ≥90%.
  - Acceptance: 98 tests; 97.77% lines / 96.44% branch.
- **R3.** Fixture A renders pillars + Water trine + Eating God.
  - Acceptance: E2E onboarding-to-chart.
- **R4.** 3 consecutive daily readings differ, each cites ≥1 fact.
  - Acceptance: E2E chart-today-datenav.
- **R5.** Unknown time → 3-pillar chart, no hour copy.
  - Acceptance: engine + content tests, UI checked headlessly.
- **R6.** Cycles shows Fixture A luck pillars with correct years.
  - Acceptance: verified against engine goldens.
- **R7.** 3 Playwright smoke flows green.
  - Acceptance: 3/3.
- **R8.** PWA installable, no console errors.
  - Acceptance: manifest + SW verified; zero errors across headless drives.
- **R9.** Disclaimer in onboarding + settings; voice holds on a 20-line sample.
  - Acceptance: byte-identical; reviewer sampled 20 lines.
- **R10.** README complete.
  - Acceptance: screenshot from real /chart.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

# Dark theme implementation

Status: done · Milestone: M9 · Ticket: 02

Reconstructed 2026-09-29 from: `_sources/plan.md` §M9, `_sources/progress.md` §M9. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The spec needed shipping without a flash of the wrong theme.

## Goal

System default, Settings override, persisted, no flash.

## Requirements

- **R1.** `prefers-color-scheme` default; `data-theme` pin from Settings (System/Light/Dark); `daymaster.theme.v1`.
  - Acceptance: shipped.
- **R2.** Pre-paint inline script so pinned themes never flash; PWA theme-color per scheme; delete-my-data clears it.
  - Acceptance: shipped.
- **R3.** Playwright theme spec.
  - Acceptance: pin dark, survive reload, Light beats dark OS, System follows OS; 4/4 E2E green.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

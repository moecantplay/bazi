# Both-theme pass

Status: done · Milestone: M18 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/progress.md` §M18, `_sources/decisions-log.md` 2026-07-30 entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Owner reminder mid-M18: "we have a light and dark mode".

## Goal

Every direction reviewed in both themes with measured contrast.

## Requirements

- **R1.** Appearance control (Light/Dark/System) in the mockup chrome; forced theme resolves identically to the OS scheme.
  - Acceptance: scripted computed-style diff on all 10 screens.
- **R2.** Contrast computed on rendered text, both themes.
  - Acceptance: all 34 failures were light mode; fixed; all directions clear AA, Trail across all five terrains.
- **R3.** Anchor mass inverts in dark (paper mass, ink text).
  - Acceptance: shipped in mockups.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

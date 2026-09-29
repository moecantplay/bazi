# Post-cutover fixes

Status: done · Milestone: M19.5 · Ticket: 01

Reconstructed 2026-09-29 from: commits `0189d98`, `cd78889`, `e9dfb14`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Three issues on the live app right after cutover.

## Goal

Fix them.

## Requirements

- **R1.** Elevation-profile SVG fills its card instead of spilling into the headline.
  - Acceptance: `h-full w-full` on the absolutely positioned SVG.
- **R2.** The ground colour follows the viewed day, not only real today.
  - Acceptance: TodayView re-stamps `data-terrain`.
- **R3.** Map hero gets breathing room and a "what the marks mean" legend.
  - Acceptance: ROUTE_TOPIC glossary entry + legend button.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

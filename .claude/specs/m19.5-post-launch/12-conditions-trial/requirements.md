# Conditions trial

Status: done · Milestone: M19.5 · Ticket: 12

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-15 entry, commit `dc5caab`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The owner wanted to feel a weather app's rhythm (structure only, not the forecast framing M18 rejected) without touching Today.

## Goal

A parallel `/conditions/` route to live with.

## Requirements

- **R1.** Reached only from Settings; Today untouched except the signpost extracted to a shared component.
  - Acceptance: shipped.
- **R2.** Day officer as condition vocabulary; stand-in weather-shaped icons; hourly strip auto-scrolls on today; ten-day list; no numbers.
  - Acceptance: `conditions-screen.ts`.
- **R3.** Tests.
  - Acceptance: presentation 161/161; E2E 34/34.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

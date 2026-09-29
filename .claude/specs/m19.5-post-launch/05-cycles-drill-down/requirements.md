# Cycles drill-down

Status: done · Milestone: M19.5 · Ticket: 05

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-08-21 luck + horizon entries, commit `1798b62`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Luck pillars were static and "This year"/"This month" sat apart from the timeline.

## Goal

One decade → year → month drill-down.

## Requirements

- **R1.** Each luck pillar opens its own reading (theme, element weather, one transit line).
  - Acceptance: `luckPillarFacts()`, `luckPillarReading()`, `luckPillarReadingsFor()`.
- **R2.** HorizonOutlook folded into LuckTimeline; year and month selectable; one decade open at a time.
  - Acceptance: `annualPillarFacts`, `monthlyPillarFactsForCalendarMonth`; horizon* functions deleted.
- **R3.** Tests.
  - Acceptance: engine 166, content 119, presentation 139; E2E 30/30.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.

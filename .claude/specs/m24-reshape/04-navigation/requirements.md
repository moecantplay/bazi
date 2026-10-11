# Navigation and Settings in the header

Status: done · Milestone: M24 · Ticket: 04 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md))

## Problem

Production's tabs are Chart · Today · Cycles · Compare · Settings: ordered by the system, with the least-used screen first (proposal §2). You, Ahead and People are live (M24-08, 07, 09) but nothing links to them. Conditions is a fourth way to see Today, reached from Settings (D4 drops it). The trial ran four tabs with Settings behind a header gear (trial R2) for six days.

## Goal

The bottom nav is Today · Ahead · You · People. Settings opens from a gear in every tab screen's header and returns with Back. Chart, Cycles, Compare and Find a day become leaf screens under the tab they belong to. Nothing links to Conditions.

## Requirements

- **R1. Four tabs** (D1).
  - Today, Ahead, You and People, in that order.
  - A tab lights for its own leaf screens: Ahead for Find a day; You for "Your chart in full"; People for the full comparison.
  - Acceptance: E2E taps each tab and lands on its screen.
- **R2. Settings behind a gear.**
  - Every tab screen's header carries a Settings control: Ahead, You and People in the title row, and each look's Today in its own top row.
  - Settings renders with Back. The look previews never show the gear.
  - Acceptance: E2E opens Settings from a tab and goes back. No preview contains a Settings link.
- **R3. Leaf screens.** Each leaf screen renders with Back:
  - Chart is titled "Your chart in full";
  - Compare is titled "The full comparison";
  - Cycles is titled "Your decades".
  - Acceptance: E2E checks each title and its Back.
- **R4. Conditions unlinked** (D4).
  - Settings drops "Try a different rhythm". No link anywhere leads to `/conditions/`.
  - The route itself is retired in M24-12.
  - Acceptance: E2E finds no `a[href^="/conditions"]` on any tab or on Settings.
- **R5. Settings reads as the reshape's.**
  - The look section is titled "Look for Today" and says every other screen stays the same (D2, D3).
  - The chart-counting toggles move under "How your chart is counted".
  - Acceptance: E2E sees "Look for Today".
- **R6. Shared chart links land on People.** Onboarding's share redirect goes to `/people/` instead of `/compare/`, with the add form prefilled.
  - Acceptance: the share E2E round-trips into People.
- **R7. Today keeps its plain header.** In Explorer and Instrument, the day's tone (M20-24) and the gear share the top row. In Editorial, the gear sits beside the date, and the tone stays on the poster.
  - Acceptance: screenshots of 3 looks × 2 themes; the plain-header E2E still passes.
- **R8. Ships.**
  - Acceptance: `pnpm verify`, full E2E in every look, a live check on production, and deployed.

## Out of scope

- Deleting Conditions, Cycles and Compare (M24-12).
- Onboarding's own steps (M24-05).
- Moving Find a day and "How this reading works" off Today (M24-06).

## Open questions

None.

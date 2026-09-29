# Pick the permanent look

Status: draft · Milestone: M19.9 · Ticket: 12

## Problem

Owner, 2026-09-29: every screen ships in three looks "because down the line i would pick one for the permanent design". Keeping three looks costs about ×3 on every future screen (M20 Today work, M21 accounts, M23 mobile), so the trial needs an end point and evidence to end it with.

## Goal

The owner chooses one look with usage evidence in hand, and the app, DESIGN.md and the test suite carry only that look.

## Requirements

- **R1.** An evidence summary from [M19.8-06](../../m19.8-foundations/06-usage-counts/requirements.md) counts: `look-chosen` by look and by where it was chosen; `reading-opened` by look × days-since-first-chart bucket (which look people are still using weeks in); `reading-marked` by look.
  - Acceptance: summary table in `design.md`, with dates and totals.
- **R2.** Owner decision logged.
  - Acceptance: `decisions.md` entry.
- **R3.** The two retired looks are removed: components, CSS, `look` values migrated to the survivor, the picker, the onboarding step and `e2e:looks`.
  - Acceptance: grep finds no retired look; `pnpm verify` and E2E green; stored readers on a retired look open in the survivor.

## Out of scope

Redesigning the survivor.

## Open questions

- [ ] How much data is enough: a date, or a count of readers who've passed day 30?
- [ ] Keep the `look` store field (a single value) for a possible future second look, or remove it?

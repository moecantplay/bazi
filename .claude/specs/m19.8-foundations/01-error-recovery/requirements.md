# Recover from a broken screen

Status: approved · Milestone: M19.8 · Ticket: 01

## Problem

`apps/web/src/app` has no `error.tsx` or `global-error.tsx`. Any exception while rendering a screen replaces the whole page with Next's default "Application error: a client-side exception has occurred". Probed 2026-09-29 on the static export:

- stored birth `2150-01-01` → every gated screen throws `Instant … is past the final solar term`;
- stored city zone `Mars/Olympus` → `Invalid time zone specified`.

`loadStore()` validates only the document envelope (`app`, `version`, `updatedAt`), so any damaged profile — a hand-edited backup, a future migration bug — reaches the engine. Because every gated screen reads the same profile, the reader can't get to Settings to download their data or start over. The app is bricked on that device.

## Goal

A screen that fails to render shows a calm recovery screen that lets the reader try again, save their data, or start over, in every look and theme.

## Requirements

- **R1.** A render error on any route shows a recovery screen instead of Next's default error text.
  - Acceptance: E2E seeds each probe above; `/today/` shows the recovery heading, and no "Application error" text.
- **R2.** The recovery screen offers: try again; download my data (the same backup file Settings produces) when a profile is stored; start over (two-step, clears everything, lands on onboarding).
  - Acceptance: E2E — "Start over" → confirm → `/onboarding/`, store gone; "Download my data" yields `daymaster-backup.json`.
- **R3.** Copy follows VOICE.md: plain verbs, no blame, says the chart is still on the device.
  - Acceptance: owner reads the screenshot set.
- **R4.** Uses base components only, so it holds in all three looks × both themes.
  - Acceptance: six screenshots (look × theme), no undefined `var(--x)`.

## Out of scope

- Deep validation of the stored profile in `loadStore()` (would change the store contract; separate ticket if wanted).
- Reporting errors anywhere — ticket 06 counts them, without messages.

## Open questions

None.

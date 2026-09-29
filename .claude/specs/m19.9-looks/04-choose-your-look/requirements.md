# Choose your look: onboarding step and Settings option

Status: done · Milestone: M19.9 · Ticket: 04

## Problem

The owner wants users to pick a look during onboarding and change it later (2026-09-29). Onboarding today is disclaimer → date → time → city → sex → reveal (`app/onboarding/page.tsx`, `GATHERING_STEPS = 5`); Settings has only Appearance (theme) at `components/settings-content.tsx:126`.

## Goal

New users choose A, B or C in onboarding from live previews; anyone can change it in Settings.

## Requirements

- **R1.** An onboarding step, right before the chart reveal, shows three previews of the user's own Today in Explorer, Editorial and Instrument and lets them pick one; Continue without changing the pick keeps Explorer. The reveal and everything after render in the chosen look.
  - Acceptance: E2E: onboarding completes with each choice; store holds it.
- **R2.** Settings gets a Look control beside Appearance with the same three previews.
  - Acceptance: E2E: change look in Settings, Today re-renders.
- **R3.** Previews are real renders, not screenshots, so they show the user's terrain and theme.
  - Acceptance: preview uses the look compositions from 05 at thumbnail scale.
- **R4.** Mocked in both themes before code; copy follows VOICE.md.
  - Acceptance: mockups in `research/`, owner sign-off.
- **R5.** Existing users (a profile saved before looks existed) are told once, on their next Today, that they can choose a look: the same three previews, "Keep Explorer" or pick one. It never shows again after either answer, and never to someone who picked a look in onboarding.
  - Acceptance: E2E: an old store sees the note once; after answering, reload shows no note; a fresh onboarding never sees it.

## Out of scope

The looks themselves (05–10).

## Open questions

- [x] Where in onboarding? **Before the chart reveal** (owner, 2026-09-29).
- [x] What does onboarding look like before a look is chosen? **Onboarding as it is today; the look step itself previews how each look would look** (owner, 2026-09-29).
- [x] Names shown to users? **Explorer · Editorial · Instrument** (decided in 02).
- [x] One-time prompt for existing users? **Yes, tell them they can choose a look** (owner, 2026-09-29) → R5.
- [x] Mockup sign-off: onboarding step, Settings control, existing-user note (`research/look-picker.html`). **Approved** (owner, 2026-09-29).

# Choose your look: onboarding step and Settings option

Status: draft · Milestone: M19.9 · Ticket: 04

## Problem

The owner wants users to pick a look during onboarding and change it later (2026-09-29). Onboarding today is disclaimer → date → time → city → sex → reveal (`app/onboarding/page.tsx`, `GATHERING_STEPS = 5`); Settings has only Appearance (theme) at `components/settings-content.tsx:126`.

## Goal

New users choose A, B or C in onboarding from live previews; anyone can change it in Settings.

## Requirements

- **R1.** An onboarding step shows three previews of the user's own Today in A, B and C and lets them pick one; skippable to the default.
  - Acceptance: E2E: onboarding completes with each choice; store holds it.
- **R2.** Settings gets a Look control beside Appearance with the same three previews.
  - Acceptance: E2E: change look in Settings, Today re-renders.
- **R3.** Previews are real renders, not screenshots, so they show the user's terrain and theme.
  - Acceptance: preview uses the look compositions from 05 at thumbnail scale.
- **R4.** Mocked in both themes before code; copy follows VOICE.md.
  - Acceptance: mockups in `research/`, owner sign-off.

## Out of scope

The looks themselves (05–10).

## Open questions

- [ ] Where in onboarding: before the reveal (so the reveal is in the chosen look) or after it?
- [ ] What does onboarding itself look like before a look is chosen — the default look?
- [ ] Names shown to users for the three looks.
- [ ] Should existing users (who never saw the onboarding step) get a one-time "Choose your look" prompt on next open? (moved from 03)

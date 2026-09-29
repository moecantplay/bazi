# Expo app with screen parity

Status: draft · Milestone: M23 · Ticket: 01

## Problem

No native app.

## Goal

`apps/mobile` in Expo implementing the design system natively, sharing all packages.

## Requirements

- **R1.** Packages consumed unchanged; only the component layer is native.
  - Acceptance: no package forks.
- **R2.** Screen parity with web (M19 checklist, updated for M20's Today).
- **R3.** Native affordances: haptics on selection, native share sheet, icons/splash from the icon pipeline.
- **R4.** Maestro smoke flows (onboarding → Today) on both platforms in CI.

## Out of scope

Tablet layouts.

## Open questions

- [ ] Carry the M20-15 verdict: any engine or zone workaround it needed lands here properly.

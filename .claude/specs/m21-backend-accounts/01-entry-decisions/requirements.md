# Entry decisions

Status: draft · Milestone: M21 · Ticket: 01

## Problem

Three decisions gate every other M21 ticket and are still open from the 2026-07-29 approval.

## Goal

All three decided and logged.

## Requirements

- **R1.** Auth provider chosen (candidates: Auth.js, Clerk, Neon Auth).
  - Acceptance: decision logged with the reason.
- **R2.** Hosting shape chosen: Next.js off static export, or the static shell kept plus a separate API.
  - Acceptance: decision logged; impact on the PWA/service worker stated.
- **R3.** Privacy posture written as user-facing copy (encrypted at rest, deletion is deletion, no data resale, minimal analytics), passing VOICE.md.
  - Acceptance: copy in `content/reference/`, owner-approved.

## Out of scope

Implementation.

## Open questions

- [ ] Auth provider?
- [ ] Hosting shape? If ticket M20-15 (Expo spike) ran, its findings apply here — a shared API serves web and mobile.
- [ ] Privacy posture wording.

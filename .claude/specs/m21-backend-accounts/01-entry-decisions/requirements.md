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

- **R4.** Usage counts get a home: self-hosted Umami on the M21 infrastructure, and the build is configured for it (`NEXT_PUBLIC_ANALYTICS_*`, see [M19.8-06](../../m19.8-foundations/06-usage-counts/design.md)). Owner, 2026-09-29: no paid analytics service; "let's just wait for M21".
  - Acceptance: tracker reachable; production build configured; events visible for one real day; CSP carries the tracker's origin.

## Out of scope

Implementation.

## Open questions

- [ ] Auth provider?
- [ ] Hosting shape? If ticket M20-15 (Expo spike) ran, its findings apply here — a shared API serves web and mobile.
- [ ] Privacy posture wording.

# Share links keep birth details off the server

Status: approved · Milestone: M19.8 · Ticket: 03

## Problem

`buildShareUrl` (`apps/web/src/lib/share-link.ts`) produces `/onboarding/?share=<base64 JSON>`. The payload is someone's birth date, time, city and sex, lightly encoded. A query string is sent to the host with the request, so every opened share link writes those details into Vercel's request logs, and into any proxy or analytics that records URLs. The Settings copy under Share promises "nothing is stored anywhere but your devices".

## Goal

New share links carry the payload in the URL fragment, which browsers never send to a server; links already sent keep working.

## Requirements

- **R1.** New links have the form `/onboarding/#share=<payload>`.
  - Acceptance: E2E copies a link and asserts the fragment form, with no `?share=`.
- **R2.** Opening a fragment link behaves exactly as today: compare with a profile, wait until after onboarding without one.
  - Acceptance: existing share E2E flows green with the new form.
- **R3.** Old `?share=` links still open.
  - Acceptance: E2E opens a legacy query link and lands on Compare with the person filled in.
- **R4.** After intake, the payload is removed from the address bar whichever form arrived.
  - Acceptance: E2E asserts `location.hash` and `location.search` are empty after intake on a fresh device.

## Out of scope

Encrypting or shortening the payload.

## Open questions

None.

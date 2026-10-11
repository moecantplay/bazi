# Welcome and five-step onboarding

Status: done · Milestone: M24 · Ticket: 05 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md)) · Carries [M20-18](../../m20-clarity/18-first-run-shows-a-reading/requirements.md) (approved 2026-09-30)

## Problem

A new reader meets a bare date field with no promise. They reach value seven screens in, after a jargon look preview ("Yang Water · Rat Day") and a reveal of eight unexplained labels (proposal §1). The trial's onboarding (trial R3) opens on a Welcome screen with a chart-free sample of today, gathers four answers, and lands on Today. The owner used it for six days.

## Goal

A new reader sees what Daymaster is, and a real sample of today, before anything is asked. They answer four questions and land on Today.

## Requirements

- **R1. Welcome first** (M20-18).
  - The Welcome screen says what Daymaster is.
  - It shows "Today, for anyone": the day's plain headline from its almanac day officer, the activities it favours, and the easiest and roughest hours. All of these are chart-free, so they're true for anyone.
  - "Get my reading" starts the steps. Restoring from a backup stays on this screen.
  - Acceptance: E2E sees the sample. A content test checks the twelve headlines are plain. A presentation test builds the sample from a date and zone alone.
- **R2. Four gathering steps.**
  - Date, time, city, then sex. The sex step carries a one-line reason, the verbatim disclaimer and its acknowledgement checkbox.
  - Progress dots count four.
  - Acceptance: E2E completes the four steps. The disclaimer text is unchanged, and the checkbox gates "Show my day".
- **R3. No look step, no reveal** (D3).
  - The profile is saved with the default look (Instrument, M19.9-13) and the look note marked seen, then the reader lands on Today.
  - Usage counts record the four steps and the default look.
  - Acceptance: E2E lands on Today in Instrument with no look note. The usage-counts E2E sees `date, time, city, sex`.
- **R4. A draft never resumes on the wrong step.**
  - The steps are renumbered, so the session draft moves to `daymaster.onboarding.v2`.
  - Start-over clears both keys.
  - Acceptance: the store's delete test and the refresh-mid-onboarding E2E pass.
- **R5. Errors stay honest.** A birth outside 1900–2100, a chart the engine can't build, or a browser that won't store the profile each shows its own message on the last step, as the reveal did.
- **R6. Ships.**
  - Acceptance: `pnpm verify`, full E2E in every look, the screens checked in both themes, and deployed.

## Out of scope

- Today's first-day banner (M24-06).
- The one-time look note for existing readers, which is unchanged.
- Settings' look picker, which became "Look for Today" in M24-04.

## Open questions

None.

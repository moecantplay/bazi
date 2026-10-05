# Reshape trial build

Status: done · Milestone: proposal (2026-10-05 reshape) · Ticket: trial-build

## Problem

The owner needs to use the reshaped app for a few days before approving the direction in [proposal.md](../proposal.md) (owner, 2026-10-05: "im going to have to use the app for a short period of time in order to make a decision"). The mockups on the [canvas](https://claude.ai/artifact/HVGR4EnLXf7qwv87TEJYjA) show one fixed day (2026-10-05) with draft text, so they can't show:

- whether Today, Ahead and You hold up as the date moves;
- whether five tabs becoming four, and a five-step onboarding, feel right in daily use;
- whether a plain lead reads well on screens other than Today.

The owner chose a throwaway trial build on a preview URL (2026-10-05). It reuses today's content rearranged, with plain wording only on each screen's lead, over a trial of a few days. The looks decision is already made: three looks on Today only (D2, 2026-10-05).

## Goal

The owner can install a preview of the reshaped app on their phone, use it with their own chart for a few days, and decide on the direction. Production and `main` stay untouched.

## Requirements

- **R1. Isolated.** The trial lives on branch `trial/reshape`, is never merged, and deploys as a Vercel **preview** of the existing `daymaster` project. Production (`daymaster-nu.vercel.app`) is untouched.
  - Acceptance: `main` has no trial commits; production's `last-modified` header is unchanged after the deploy; the preview URL serves the trial.
- **R2. Four tabs.** The bottom nav is Today · Ahead · You · People. Settings opens from a gear in each tab screen's header and returns with Back. Conditions is unreachable (its Settings entry removed). Find a day is reached from Ahead.
  - Acceptance: E2E: each tab and the gear navigate; no link to `/conditions/` remains.
- **R3. Value-first onboarding.**
  - A Welcome screen opens the flow. It says what Daymaster is and shows a chart-free sample of today: the day's character and the activities it suits.
  - Four gathering steps follow: date, time, city, then sex with a one-line reason and the verbatim disclaimer.
  - There is no look step and no chart reveal; onboarding lands on Today.
  - Acceptance: E2E completes onboarding in four steps after Welcome and lands on Today. The disclaimer text is unchanged and its checkbox gates the last step.
- **R4. Today, slimmed, in all three looks.**
  - No system terms in the header (drops "Yang Water · Rat Day").
  - Find a day and "How this reading works" leave Today.
  - On the first day after onboarding, a one-line portrait banner sits above the reading.
  - The composed reading is unchanged (M20-21).
  - Acceptance: Today renders in Explorer, Editorial and Instrument, light and dark. The first-day banner shows only on the date the profile was created.
- **R5. Ahead.**
  - One screen with a 10 days / Month / Year / Decade switch, showing one view at a time.
  - **10 days:** the ten-day strip (from Conditions' day model, in plain tone words) plus the Find a day entry.
  - **Month, Year and Decade** each show a plain lead (headline + body + one thing to try) built from that period's strongest fact. The period's other facts follow as cards, reusing existing wording.
  - Acceptance:
    - Every view renders for Fixture A and the unknown-time fixture.
    - A content test fails if a lead contains a system term (M20-21's R10 list).
    - The lead is deterministic, keyed by the period plus the chart.
- **R6. You.**
  - The day-master portrait as the lead, then plain cards: company/strength, balance, what suits you, rooms you tend to do well in, patterns, stars.
  - The current Chart screen moves, unchanged, behind "Your chart in full".
  - Acceptance: the You screen renders for every fixture. A content test fails if a card title or sentence contains a system term.
- **R7. People.**
  - Saved people are listed first, with an "Add someone" button that opens the existing form.
  - A selected person shows a plain pair lead (built from how the two day-masters relate), then the pair's facts as cards.
  - Acceptance: E2E adds a person and sees the pair reading. A content test checks the leads for system terms.
- **R8. Ships for use.**
  - The trial passes the gate below.
  - The owner gets the preview link plus a note on moving their chart: back up from production and restore on the preview. The preview is a separate site, so its storage starts empty.
  - Gate: `pnpm verify` green on the branch; E2E green for the flows changed in R2, R3 and R7; a live check of the preview.
  - Acceptance: `pnpm verify` output, E2E output, and the preview URL recorded in tasks.md.

## Out of scope

- Writing the full plain banks for Ahead, You and People (proposal M24-11). The trial writes only the leads in R5–R7.
- Topic pages for the new cards: cards on Ahead, You and People link to existing glossary or topic content where it exists, and otherwise don't link.
- Folder restructure, voice lint, no-repeat rotation, the quality gates and the M20 fixes.
- Deploying to production, merging, or changing any foundation spec. DESIGN.md and VOICE.md change only once the direction is approved.

## Open questions

- [x] Approve this ticket (requirements + design) so the build can start. **Approved** (owner, 2026-10-05: "i'll approve it for now because i will dictate based on the feel").

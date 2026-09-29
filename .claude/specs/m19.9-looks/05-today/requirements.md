# Today in three looks

Status: done · Milestone: M19.9 · Ticket: 05

## Problem

The 01 mockups exist only as HTML. Once looks exist (03), Today renders only in the old Trail composition regardless of the chosen look.

## Goal

Today has an A, B and C composition, each mocked, approved and built, rendering the same content in every look.

## Requirements

- **R1.** Mockups of Today in Explorer, Editorial and Instrument, both themes, 390×844, real Fixture A content; owner approves before code.
  - Acceptance: screenshots in this ticket's `research/`, owner sign-off noted in Open questions.
- **R2.** Each look follows its DESIGN.md look section (02); shared base rules hold (seal, English only, VOICE, anchor, AA).
  - Acceptance: `check.mjs` 0 failures for this screen's cards × 3 looks × 5 terrains × 2 themes.
- **R3.** All three looks render the same facts and actions from one presentation model; no look drops content, it only moves it.
  - Acceptance: E2E runs this screen's specs under `data-look` trail, almanac and dial, green.
- **R4.** Switching look updates the screen immediately without reload.
  - Acceptance: E2E: changing `data-look` (what 04's Settings control stamps) swaps the composition without a reload.
- **R5.** `useLook()` (reads `data-look` via `useSyncExternalStore`, server snapshot `DEFAULT_LOOK`) and a `LookSwitch` helper land here as Today is their first consumer (moved from 03).
  - Acceptance: switching `data-look` re-renders Today's composition; no hydration warning for a stored non-default look.

## Out of scope

Copy changes (M20-14). Engine changes.

## Open questions

- [x] Refinements from 01 carried over? None (owner, 2026-09-29).
- [x] Where does the one-thing-to-do board sit? **On the first screen** (owner, 2026-09-29, after comparing both). This amends the CLAUDE.md non-negotiable and VOICE.md "agency line ends every daily reading" to "closes the first screen"; the amendment lands with this ticket.
- [x] Board style? **Pull quote, in every look** (owner, 2026-09-29). Owner asked to see both: `research/today-full.html` (https://claude.ai/artifact/PVkaWKhDP6coSShmebyqj8), `research/*-{end,top}-*.png`.

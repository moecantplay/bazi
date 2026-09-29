# Today in three looks

Status: draft · Milestone: M19.9 · Ticket: 05

## Problem

The 01 mockups exist only as HTML. Once looks exist (03), Today renders only in the old Trail composition regardless of the chosen look.

## Goal

Today has an A, B and C composition, each mocked, approved and built, rendering the same content in every look.

## Requirements

- **R1.** Mockups of Today in A, B and C, both themes, 390×844, real Fixture A content; owner approves before code.
  - Acceptance: screenshots in this ticket's `research/`, owner sign-off noted in Open questions.
- **R2.** Each look follows its DESIGN.md look section (02); shared base rules hold (seal, English only, VOICE, anchor, AA).
  - Acceptance: `check.mjs` 0 failures for this screen's cards × 3 looks × 5 terrains × 2 themes.
- **R3.** All three looks render the same facts and actions from one presentation model; no look drops content, it only moves it.
  - Acceptance: E2E runs this screen's specs under `data-look` trail, almanac and dial, green.
- **R4.** Switching look updates the screen immediately without reload.
  - Acceptance: E2E: change look in Settings, return, new composition present.
- **R5.** `useLook()` (reads `data-look` via `useSyncExternalStore`, server snapshot `DEFAULT_LOOK`) and a `LookSwitch` helper land here as Today is their first consumer (moved from 03).
  - Acceptance: switching `data-look` re-renders Today's composition; no hydration warning for a stored non-default look.

## Out of scope

Copy changes (M20-14). Engine changes.

## Open questions

- [x] Refinements from 01 carried over? None (owner, 2026-09-29).
- [ ] Where does the one-thing-to-do board sit: last (keeps the non-negotiable "agency line ends every daily reading") or on the first screen (amends it)? Owner asked to see both: `research/today-full.html` (https://claude.ai/artifact/PVkaWKhDP6coSShmebyqj8), `research/*-{end,top}-*.png`.

# Chart in three looks

Status: draft · Milestone: M19.9 · Ticket: 06

## Problem

Chart is a seal, a pillar grid and ~600 words of stacked prose (research/current in 01). Once looks exist (03), Chart renders only in the old Trail composition regardless of the chosen look.

## Goal

Chart has an A, B and C composition, each mocked, approved and built, rendering the same content in every look.

## Requirements

- **R1.** Mockups of Chart in A, B and C, both themes, 390×844, real Fixture A content; owner approves before code.
  - Acceptance: screenshots in this ticket's `research/`, owner sign-off noted in Open questions.
- **R2.** Each look follows its DESIGN.md look section (02); shared base rules hold (seal, English only, VOICE, anchor, AA).
  - Acceptance: `check.mjs` 0 failures for this screen's cards × 3 looks × 5 terrains × 2 themes.
- **R3.** All three looks render the same facts and actions from one presentation model; no look drops content, it only moves it.
  - Acceptance: E2E runs this screen's specs under `data-look` trail, almanac and dial, green.
- **R4.** Switching look updates the screen immediately without reload.
  - Acceptance: E2E: change look in Settings, return, new composition present.

## Out of scope

Copy changes (M20-14). Engine changes.

## Open questions

- [ ] What is Chart's signature object in each look (seal for all? pillar poster in B? a natal dial in C)?

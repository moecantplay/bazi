# Three directions

Status: done · Milestone: M19.9 · Ticket: 01

## Problem

Owner, 2026-09-29: "make the app look and feel like an award winning app." An audit of the 2026-09-29 static build (Fixture A, 390×844, both themes, screenshots in `research/current/`) shows a competent, token-correct app that still reads as a document, not a product:

- **Today is ~5,700px tall** (780×5686 @2x). The first screen spends its hero on a sentence and a map that is covered by the nav at load; the main idea ("something has to move") is said 4 times.
- **The map hero packs 7 labels into ~340px** (ALL DAY rows, ROUGH, CLEAR, EVENING, compass, flag) and needs a "What the marks mean" link to decode.
- **Cycles and Chart are walls of same-sized cards** of prose, the pattern the owner rejected on 2026-07-16.
- **Nothing moves.** No arrival moment, no route drawing, no haptic-feeling press states; DESIGN.md §Motion explicitly deferred a motion pass.
- **No single signature object.** Award-winning daily apps (Co-Star, (Not Boring) Weather, Gentler Streak, Structured) are recognizable from one screenshot; Daymaster's identity is spread across rail, map, elevation strip and signpost at equal weight.

## Goal

Three finished Today directions (A Trail distilled, B Almanac page, C Day dial) that become the three looks users choose between (owner, 2026-09-29: "put the direction as an option on the settings, that way users can try out how each direction feel"). Each has a signature hero, a restrained first screen and the shared motion language.

## Requirements

- **R1.** Three distinct directions for Today, mocked on-device (390×844) in both themes with real Fixture A content for 2026-09-29, including motion.
  - Acceptance: mockups in `research/`, viewable on the owner's phone, screenshots of each direction × theme.
- **R2.** Every direction respects the standing rules: the seal is the only cinnabar mass; English only; VOICE.md; the anchor defined by distance from the ground; `[data-theme]` twins; AA on rendered text.
  - Acceptance: contrast measured on the chosen mockup's rendered text in both themes, 0 failures.
- **R3.** The first screen (above the fold, nav visible) states the day in one headline, one idea and one thing to do. Everything else is one tap or scroll away, not deleted.
  - Acceptance: the chosen mockup's first 844px contains no more than headline + ≤40 words + agency line + hero.
- **R4.** A motion language: one orchestrated arrival sequence (≤ 1.2s total, each element ≤ 420ms except the hero draw), springy press states ≤ 240ms, transform/opacity/stroke-offset only, and fully static under `prefers-reduced-motion`.
  - Acceptance: written into DESIGN.md §Motion; reduced-motion render of the mockup shows the final state.
- **R5.** The owner approves all three Today mockups as the reference for each look; they feed the DESIGN.md restructure (M19.9-02).
  - Acceptance: owner sign-off noted here; decision logged in `decisions.md`.

## Out of scope

Other screens (M19.9-06…10), the look switch itself (03, 04), copy rewording (M20-14), new icon art, engine changes.

## Open questions

- [x] Which direction (or blend)? **All three ship as user-selectable looks, permanently, on every screen; the current Trail Today retires** (owner, 2026-09-29).
- [x] Order vs M20? **Looks run before M20**; M20-10/14 later apply to three Todays (owner, 2026-09-29).
- [x] Any refinements to A, B or C before they're treated as the reference? **None for now; "approved, let's see how it goes"** (owner, 2026-09-29).

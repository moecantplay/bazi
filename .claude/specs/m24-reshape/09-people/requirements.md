# People

Status: done · Milestone: M24 · Ticket: 09 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md))

## Problem

Compare opens on an empty form and reads a pair in the old voice (proposal §2). The trial built People (trial R7): saved people first, one button to add someone, and a plain pair reading for the chosen person. The owner used it for six days. It lives only on `trial/reshape`.

## Goal

A `/people/` screen in production, in the base design and both themes, lists saved people, adds someone with one button, and reads each pair in plain words. The full comparison stays one tap away. The code lives in its proper homes.

## Requirements

- **R1. Saved people first.**
  - Saved people are listed, and the chosen one is marked.
  - "Add someone" opens the existing form. With nobody saved yet, the form opens on its own.
  - People can be removed.
  - Acceptance: E2E adds a person and reads the pair.
- **R2. A plain pair lead.**
  - The lead is keyed by how the two day-masters relate: same, you feed them, they feed you, you steer, they steer.
  - Cards follow for the pair's sign links, by life area, plus what each of you brings out in the other.
  - Acceptance: a content test checks every relation and interaction in plain words, and the trial's exact lead for one pair.
- **R3. The full comparison is one tap away** (`/compare/`, unchanged until M24-12).
- **R4. Proper homes, and ships on its own.**
  - Code lives in `content/src/banks/people/`, `content/src/readings/people/`, `presentation/src/pair-screen.ts` and `web/src/components/people/`.
  - `/people/` is reachable by URL until M24-04, which also points shared chart links here.
  - Acceptance: `pnpm verify`, full E2E in every look, a live check in both themes, and deployed.

## Out of scope

- The tab, and moving share links from Compare to People (M24-04).
- Retiring Compare (M24-12).

## Open questions

None.

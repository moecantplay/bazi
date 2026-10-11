# You

Status: in-progress · Milestone: M24 · Ticket: 08 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md))

## Problem

Production has no answer to "who am I in this system?" in plain words. The only screen about the reader is Chart: a pillar grid with old names, a 90-word strength paragraph, and bare glosses (proposal §2). The trial built a You screen (trial R6, R15, R16) and the owner used it for six days. It lives only on `trial/reshape`, in trial-named files (`banks/trial/`, `readings/trial/plain-readings.ts`, `presentation/src/trial-screens.ts`).

## Goal

A `/you/` screen in production, in the base design and both themes, says who the reader is in everyday words: the portrait, their elements and colours, and plain cards. "Your chart in full" (today's Chart) is one tap in. The code lives in its proper homes, without trial names.

## Requirements

- **R1. Portrait lead.**
  - The day-master's defining image leads: its first sentence is the headline, and the rest is the body ("You are the mountain: slow to move, impossible to ignore.").
  - One "Worth remembering" line closes the lead (trial R6).
  - Acceptance: a content test checks every stem's lead, and that its words pass the plain-terms check.
- **R2. Your elements** (trial R15).
  - **What helps you** shows the favourable elements in the engine's order; **what wears you down** shows the rest.
  - Each is a swatch chip with the English name, and a plain line beside it.
  - One "Ease it" line points back to the first helper.
  - Acceptance:
    - a content test checks the lines are plain and the two lists split all five elements;
    - a presentation test builds the section for every fixture.
- **R3. Your colours** (trial R16).
  - **Colours that suit you** and **go easy on** list each element's colours: the classical colour first, then at most two modern shades (flagged).
  - A "where" line follows, then one fix line.
  - Acceptance: tests as in R2; swatches follow DESIGN.md's swatch rule.
- **R4. What shapes you.** Plain cards: company and strength, balance, and rooms you tend to do well in. Acceptance: card titles and lines pass the plain-terms check.
- **R5. Your chart in full.** A card links to `/chart/`. Chart itself is unchanged; its rename and back link come with navigation (M24-04).
  - Acceptance: E2E opens You and follows the link to Chart.
- **R6. Proper homes.** No file, identifier or comment says "trial":
  - shared plain-reading types and helpers in `content/src/readings/plain/`;
  - You's builder in `content/src/readings/you/`;
  - wording in `content/src/banks/you/` and `content/src/banks/colours.ts`;
  - presentation in `presentation/src/you-screen.ts` and `colours.ts`;
  - web in `components/you/` and `components/plain/`.
  - Acceptance: `grep -ri trial` over the touched packages finds nothing new.
- **R7. Ships on its own.** `/you/` is reachable by URL until M24-04 adds the tab. Production stays whole.
  - Acceptance: `pnpm verify`, full E2E in every look, the screen checked live in both themes, and deployed.

## Out of scope

- The tab bar and the Settings gear (M24-04).
- Today's colour (M24-06). Its colour bank is shared and lands here.
- Ahead and People (M24-07, M24-09). The plain-reading types they reuse land here.

## Open questions

None.

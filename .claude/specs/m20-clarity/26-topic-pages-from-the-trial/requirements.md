# Topic pages as the trial built them

Status: done · Milestone: M20 · Ticket: 26 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../../m24-reshape/README.md))

## Problem

Production's topic pages mostly repeat the card that opened them (M20-22's measurements: 7–90 words). On the trial the owner asked for, and used, two improvements:

- **R13:** "Good for / Hold off on" on every topic page (owner, 2026-10-05).
- **R14:** the fuller layout from the M20-22 mockups, to feel locally (owner, 2026-10-10: "i'd need to try it on local first at least to get the feel"):
  - tagline;
  - For you today;
  - a drawing of the reader's chart (stage hill or sign tiles);
  - How it tends to go;
  - Where it shows up;
  - Your sore spot and what eases it;
  - Good for / Hold off on;
  - three steps;
  - When it comes back;
  - Where the name comes from;
  - a closing line.

  It was written out for three topics (steady work, Coming of Age, the family clash). Every other topic shows the layout with its current lines.

M20-22 (sourced meanings for every topic, 180–350 words each) and M20-23 (problem and remedy as an engine fact) are the full versions and haven't started. This ticket ships what the trial had, so production matches it. Those two build on top.

## Goal

Every topic page carries Good for / Hold off on and the fuller layout. The three written-out topics read in full, and the rest show the layout with their current lines, exactly as on the trial.

## Requirements

- **R1. Good for / Hold off on** (trial R13): every ten-god, element, stage and sign-link page lists 2–3 things it's good for and 1–2 to hold off on, in plain words.
  - Acceptance: a content test covers every key. E2E sees both headings on a sign-link page.
- **R2. The fuller layout** (trial R14), in the order in the Problem.
  - Each section renders only where it has content.
  - Acceptance: E2E on "steady work" (2026-10-06, Fixture A) sees every section and the closing line, and a "When it comes back" date opens that day's page.
- **R3. The sore spot, as a stopgap** (`presentation/src/sore-spot.ts`):
  - the problem is the element that controls the chart's first helpful element, when the chart has it;
  - the remedies are the element that controls the problem, and the element the problem feeds (Shen Feng Tong Kao 病藥說類第九, as cited in the file).
  - M20-23 replaces it with a sourced engine fact.
  - Acceptance: the presentation topic-depth test covers the dates the trial checked.
- **R4. No trial names.** The trial's `trial-depth.ts` and `trial-sore-spot.ts` become `banks/topics/depth.ts` and `presentation/src/sore-spot.ts`. Comments cite this ticket.
- **R5. Ships.**
  - Acceptance: `pnpm verify`, full E2E in every look, a topic page checked in both themes, and deployed.

## Out of scope

- M20-22's remaining requirements: sourced meanings and length targets for every topic, card-repeat removal, per-chart variants, and styles.
- M20-23's engine fact.

## Open questions

None.

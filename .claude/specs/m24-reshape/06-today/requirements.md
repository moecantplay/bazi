# Today slimmed, with Today's colour

Status: done · Milestone: M24 · Ticket: 06 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md))

## Problem

Today still carries two links that now have homes elsewhere: "Find a day for something" (now Ahead's Plan something) and "How this reading works" (now on You). A new reader's first Today says nothing about who they are or what the page is for. The trial slimmed Today (trial R4), added a first-day banner, and added Today's colour (trial R17, approved from its mockup on 2026-10-10). The owner used them in the trial.

## Goal

Today in all three looks: the reading, plain cards, what the day suits, then today's colour. A one-line welcome on the reader's first day. Nothing that belongs to another tab.

## Requirements

- **R1. Off Today.**
  - "Find a day for something" leaves What the day suits; Find a day opens from Ahead.
  - "How this reading works" leaves Today; it lives on You.
  - Acceptance: E2E finds neither link on Today in any look. Find a day's E2E reaches it from Ahead, and the glossary E2E finds the explainer on You.
- **R2. The first-day banner.**
  - On the date the reader's chart was made, one line shows the seal, their portrait line, and what the page does each morning. Every other day it renders nothing.
  - Acceptance: E2E sees it right after onboarding, and not on a seeded older profile.
- **R3. Today's colour** (trial R17).
  - A card after What the day suits, the same in every look: a swatch, the colour's name and one line.
  - **On a day whose element helps the reader:** the colour is that element's ("It matches the day. Wear it, or keep something pink close.").
  - **On one that wears them down:** it's a helper that keeps the day's element in check, else the helper that the day's element feeds ("It keeps you steady today. A little goes far: a scarf, a mug, a pen.").
  - The shade follows hash(birth data + date).
  - The steadying rule is already in `flags.md`.
  - Acceptance:
    - presentation: every fixture gets a colour on every day of a year, always one of its suiting colours;
    - content: the lines are plain;
    - E2E: Fixture A on 2026-10-15 shows beige, below What the day suits.
- **R4. Ships.**
  - Acceptance: `pnpm verify`, full E2E in every look, Today checked in 3 looks × 2 themes, and deployed.

## Out of scope

- The look note and the plain header (M19.9-13, M20-24 are done).
- Topic pages (M20-22, M20-23).

## Open questions

None.

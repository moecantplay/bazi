# Ahead

Status: in-progress · Milestone: M24 · Ticket: 07 · Approved under the owner's standing instruction (2026-10-11, [M24 README](../README.md))

## Problem

Production answers "what's coming?" with Cycles, which repeats the same three cards for decade, year and month in the old voice (proposal §2). It also has Find a day, hidden behind Today. The trial built Ahead (trial R5, R9–R12): "Your seasons" (any month, any year of the reader's life, every ten-year stretch, each read plainly) and "Plan something", which opens Find a day already searching. The owner shaped it over four rounds and used it for six days. It lives only on `trial/reshape`.

## Goal

An `/ahead/` screen in production, in the base design and both themes, reads the reader's seasons in plain words and opens Find a day for whatever they're planning. The code lives in its proper homes.

## Requirements

- **R1. Your seasons, first** (trial R10, R12).
  - A Month / Year / Decade switch.
  - **Month:** the month's plain lead (headline, body, one thing to try) and its cards. A row of months to pick from, and a look at next month.
  - **Year:** the year's lead and cards. "Month by month" lists each month's headline with a lean dot, and each opens that month. A look at next year.
  - **Decade:** the stretch's lead and cards. "Year by year" opens each year. A look at the next stretch, saying when it begins.
  - Acceptance: E2E reads all three zooms and moves decade → year → month.
- **R2. Any year** (trial R11). Year opens on a row of the reader's lifetime (birth year to 90 years on, within 1900–2100), scrolled to the current year.
  - Acceptance: E2E picks 2040 and reads it.
- **R3. Plan something, last** (trial R10, R12).
  - The ten activities as chips. Each opens Find a day with that activity chosen and the default window already searched (`/dates/?activity=<key>`).
  - "Choose your own dates" opens it blank.
  - Acceptance: E2E taps "Moving" and sees results. The seasons section comes before Plan something.
- **R4. No single days.** No ten-day strip or day lists, because days belong to Today (trial R10).
  - Acceptance: E2E finds no "The next ten days".
- **R5. Plain words.** Every lead and card passes the plain-terms check in all three spans.
  - Acceptance: a content test over every interaction × life area, every period character and every element.
- **R6. The engine's edges never crash.** Only periods the engine can read are offered. January 1900 and December 2100 sit outside its solar-term table, and a ten-year stretch running past 2100 lists its years up to 2100.
  - Acceptance: presentation tests at both edges and for a reader born in 2020.
- **R7. Proper homes, and ships on its own.**
  - Code lives in `content/src/banks/ahead/`, `content/src/readings/ahead/`, `presentation/src/ahead-screen.ts` and `web/src/components/ahead/`, with no trial names.
  - `/ahead/` is reachable by URL until M24-04 adds the tab.
  - Acceptance: `pnpm verify`, full E2E in every look, a live check in both themes, and deployed.

## Out of scope

- The tab (M24-04).
- Retiring Cycles (M24-12). Decade keeps the trial's "Your decades, the old way" link to it until then.

## Open questions

None.

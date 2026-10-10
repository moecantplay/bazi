# M24 — Reshape

Opened 2026-10-10. The owner approved the [reshape proposal](../_proposals/2026-10-05-reshape/proposal.md) after living with the [trial build](../_proposals/2026-10-05-reshape/trial-build/requirements.md) and chose the **full rebuild** (owner, 2026-10-10, chosen over "harden the trial and ship" and "ship the trial as-is").

## Goal

Rebuild the app around four questions: Today · Ahead · You · People, with Settings in the header. One plain voice everywhere, value-first onboarding, and three looks on Today only. Each ticket is built properly and ships to production on its own.

## How the trial is used

`trial/reshape` is a **reference, never merged** (trial R1). Each ticket below names the trial requirements it carries forward. It may lift trial code where that code meets the bar, but it goes through mockups, tests and review like any other ticket. The trial stays deployed at `daymaster-trial.vercel.app` until ticket 12 ships.

## Before M24

From the proposal's narrowed M20, these go first because they guard every screen the reshape touches: M20-21 (finish), M20-01 (widened), Today header in plain words, the VOICE.md character cleanup, M20-09 quality gates, M20-16 flaky test and M20-02 copy audit baseline. Ticket 01 below records that order in the M20 README.

## Tickets

Only ticket 01 is drafted. Each later ticket is drafted with `/spec new` once the one it depends on is approved, so it is written against decisions that are already settled.

| # | Ticket | Status | Depends on | Carries forward from the trial |
| --- | --- | --- | --- | --- |
| 01 | [Decisions and foundation specs](01-decisions-and-foundation-specs/requirements.md) | draft | — | the decisions behind R2–R17 |
| 02 | Mockups first: Today in three looks, every other screen in the base design | planned | 01 | the screens as built, R9–R17 |
| 03 | Facts carry their time scope (from M20-08) | planned | 01 | Ahead's period facts (R5, R9–R11) |
| 04 | Navigation and Settings in the header; Conditions retired | planned | 02 | R2 |
| 05 | Welcome and five-step onboarding (M20-18, look step removed) | planned | 02 | R3 |
| 06 | Today slimmed, with Today's colour | planned | 02 | R4, R17 |
| 07 | Ahead: your seasons, plan something, any year | planned | 02, 03 | R5, R9–R12 |
| 08 | You: portrait, your elements, your colours, "Your chart in full" | planned | 02 | R6, R15, R16 |
| 09 | People: saved people first | planned | 02 | R7 |
| 10 | First week (M20-11) | planned | 05, 06 | — |
| 11 | Words: no-repeat rotation, voice lint, copy rewrite over every screen (M20-12, 13, 14) | planned | 06–09 | — |
| 12 | Retire the legacy Trail composition (M19.9-11) and the trial branch | planned | 04–09 | — |

Topic-page depth (trial R13, R14) stays with [M20-22](../m20-clarity/22-topic-page-depth/requirements.md) and [M20-23](../m20-clarity/23-problem-and-remedy/requirements.md).

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- Every screen in one voice; the copy audit (M20-02) shows the agreed targets met.
- `pnpm verify`, full E2E (Today in every look × theme) and a live-app check green, with each ticket deployed to production when it lands.

# M24 — Reshape

Opened 2026-10-10. The owner approved the [reshape proposal](../_proposals/2026-10-05-reshape/proposal.md) after living with the [trial build](../_proposals/2026-10-05-reshape/trial-build/requirements.md) and chose the **full rebuild** (owner, 2026-10-10, chosen over "harden the trial and ship" and "ship the trial as-is").

## Goal

Rebuild the app around four questions: Today · Ahead · You · People, with Settings in the header. One plain voice everywhere, value-first onboarding, and three looks on Today only. Each ticket is built properly and ships to production on its own.

## How the trial is used

`trial/reshape` is a **reference, never merged** (trial R1). Each ticket below names the trial requirements it carries forward. It may lift trial code where that code meets the bar, but it goes through mockups, tests and review like any other ticket. The trial stays deployed at `daymaster-trial.vercel.app` until ticket 12 ships.

## Before M24

From the proposal's narrowed M20, these go first because they guard every screen the reshape touches: M20-21 (finish), M20-01 (widened), Today header in plain words, the VOICE.md character cleanup, M20-09 quality gates, M20-16 flaky test and M20-02 copy audit baseline. Ticket 01 below records that order in the M20 README.

## Standing instruction (owner, 2026-10-11)

"just do whatever is necessary until everything done on trial is reflected on production." From here, each ticket is drafted, approved under this instruction (recorded on its status line), built, verified and deployed without waiting for a separate approval. Requirements, design and tasks are still written first, tests still come first, and every ticket ships to production on its own.

What changes:

- **Order.** Screens are built before the navigation that links them, so production stays whole between tickets: You (08), Ahead (07), People (09), then navigation (04), onboarding (05), Today (06), then topic pages ([M20-22](../m20-clarity/22-topic-page-depth/requirements.md), [M20-23](../m20-clarity/23-problem-and-remedy/requirements.md); trial R13, R14), then retiring what's left (12).
- **Mockups (02).** The trial build was the on-device mockup, used for six days in both themes. Each screen ticket records screenshots in both themes instead of a separate mockup round.
- **Fact scope types (03)** is a type-safety guard the trial didn't need. It runs after the trial work is in production.
- **Narrowed M20** (01 widened, VOICE cleanup, 09, 16, 02) also runs after, except where a ticket here needs it.

**Trial parity reached, 2026-10-11.** Everything the trial built (R2–R17) is in production: You (08), Ahead (07), People (09), navigation (04), onboarding (05), Today (06), and the topic pages ([M20-26](../m20-clarity/26-topic-pages-from-the-trial/requirements.md)). A source diff against `trial/reshape` leaves only renames, comments and deliberate changes made since: the day's tone in Today's header (M20-24), Instrument as the default (M19.9-13), and the 1900/2100 edge guards on Ahead. What remains (03, 10, 11, 12) goes beyond the trial.

## Tickets

| # | Ticket | Status | Depends on | Carries forward from the trial |
| --- | --- | --- | --- | --- |
| 01 | [Decisions and foundation specs](01-decisions-and-foundation-specs/requirements.md) | done | — | the decisions behind R2–R17 |
| 02 | Mockups first: Today in three looks, every other screen in the base design | dropped — the trial build served as the mockup (standing instruction) | 01 | the screens as built, R9–R17 |
| 03 | Facts carry their time scope (from M20-08) | planned — after the trial work | 01 | Ahead's period facts (R5, R9–R11) |
| 04 | [Navigation and Settings in the header](04-navigation/requirements.md) | done | 07, 08, 09 | R2 |
| 05 | [Welcome and five-step onboarding](05-onboarding/requirements.md) | done | 04 | R3 |
| 06 | [Today slimmed, with Today's colour](06-today/requirements.md) | done | 04 | R4, R17 |
| 07 | [Ahead](07-ahead/requirements.md) | done | 08 | R5, R9–R12 |
| 08 | [You](08-you/requirements.md) | done | 01 | R6, R15, R16 |
| 09 | [People](09-people/requirements.md) | done | 08 | R7 |
| 10 | First week (M20-11) | planned | 05, 06 | — |
| 11 | Words: no-repeat rotation, voice lint, copy rewrite over every screen (M20-12, 13, 14) | planned | 06–09 | — |
| 12 | Retire the legacy Trail composition (M19.9-11) and the trial branch | planned | 04–09 | — |
| 13 | [Your best hour](13-your-best-hour/requirements.md) | done — live 2026-10-13 | 06 | — |
| 14 | [NOW pill covers an hour label](14-now-pill-covers-hour-label/requirements.md) | draft — found during 13 | — | — |
| 15 | [What the marks mean, per look](15-marks-explained-per-look/requirements.md) | in-progress — built, deploy pending | — | — |

Topic-page depth (trial R13, R14) stays with [M20-22](../m20-clarity/22-topic-page-depth/requirements.md) and [M20-23](../m20-clarity/23-problem-and-remedy/requirements.md).

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- Every screen in one voice; the copy audit (M20-02) shows the agreed targets met.
- `pnpm verify`, full E2E (Today in every look × theme) and a live-app check green, with each ticket deployed to production when it lands.

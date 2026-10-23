# Fix duplicated glosses

Status: draft · Milestone: M20 · Ticket: 01

> 2026-10-23: the chart page's star lines ("The an empty seat at the table — … sits in your roots — an empty seat at the table — …") printed their gloss twice too. [M24-11](../../m24-reshape/11-words/requirements.md) fixed that one (`natalStarLine` says the gloss once). Check the rest of this list against the app as it is now before running this ticket.
>
> Still live (found in M24-11 phase 3): Find a day's top result says the officer's description twice. `officerFrameRuns` in `content/src/day-guidance.ts` renders the officer term as its gloss, then fills `{officerGloss}` with the same gloss: "A the day the month's work likes to come together day: the day the month's work likes to come together."

## Problem

Several reading lines print their explanation twice and lose the name they are explaining. Live on 2026-09-29 for Fixture A:

- "Today lights your a drawn blade — decisive force that needs a sheath — a drawn blade — decisive force that needs a sheath."
- "The day sits at your 'noon sun — full power, nothing left in reserve' stage — noon sun — full power, nothing left in reserve."
- "The old calendars call today an insight from the odd angle day — put plainly, …"
- "A gathering-in day, taking in what's owed and offered day — gathering-in day, taking in what's owed and offered."

Root cause: a term run means two different things. For branches and stems, `term` holds the Chinese character and the app must show the `gloss` ("horse"). For stars, stages, ten gods and officers, `term` holds the English name ("Goat Blade") and the template already writes the gloss after it. The single renderer (`TokenText`, `plainGloss`) always shows the gloss, so the second kind loses its name and repeats its gloss.

## Goal

Every term run shows the name it stands for, exactly once, and every line reads as a correct English sentence.

## Requirements

- **R1.** A term run has one meaning everywhere: `term` is the English display name, `gloss` is the plain-language explanation, `han` is the optional character.
  - Acceptance: the `ContentRun` doc comment states this; every one of the 32 term-run constructions in `packages/content/src` follows it.
- **R2.** The renderer shows `term`.
  - Acceptance: `TokenText` and `plainGloss` (renamed to fit) render `term`; branches still read "horse", stems still read their English name.
- **R3.** No rendered line contains the same gloss twice.
  - Acceptance: a content test renders every daily, natal, horizon, luck and compare line across Fixtures A–D over 60 days and fails on any repeated gloss phrase in one line.
- **R4.** No rendered line contains an article mismatch ("your a", "an a", "a an").
  - Acceptance: same test, regex check.

## Out of scope

Rewording the lines (ticket 14). This ticket only makes the existing wording render as authored.

## Open questions

- [ ] None.

# Today's header in plain words

Status: done · Milestone: M20 · Ticket: 24

## Problem

VOICE.md rule 11 bans system terms on Today, but every look's header still names the day pillar:

- `apps/web/src/components/today/headline.tsx:27`: `dayMeta()` renders "yang fire · horse day".
- It is called by each look's hero:
  - Explorer: `looks/trail/route-hero.tsx:73`, top right.
  - Instrument: `looks/dial/today-instrument.tsx:28`, top right.
  - Editorial: `looks/almanac/poster-field.tsx:35`, the poster's second foot line, under "Day 283 of the year".
- The look previews in onboarding and Settings render these same heroes, so the onboarding look step shows a stranger "Yang Water · Rat Day" before they've seen any reading (proposal §1, step 6).
- Explorer's seven-day strip gives today's animal icon a screen-reader name (`elevation-profile.tsx:93`, `aria-label={cell.animal}`), so a screen reader says "rat" on Today.

The owner read a generated week on 2026-10-11 and the label was noted there ("yang metal · dog day"). The proposal lists this as the third item in the narrowed M20 ([proposal §6](../../_proposals/2026-10-05-reshape/proposal.md)). The trial build dropped it (trial R4) and the owner used that build for days.

## Goal

Today's header, in every look and in the look previews, says nothing a reader needs the system to understand.

## Requirements

- **R1. No pillar words in any look's header.**
  - The day-pillar label goes from Explorer's and Instrument's top row and from Editorial's poster foot.
  - The date stays, and Editorial keeps "Day 283 of the year".
  - `dayMeta()` is deleted.
  - Acceptance: an E2E check on Today in each look × theme finds no text matching the plain-terms list (`packages/content/test/plain-terms.ts`) in the hero.
- **R2. No animal names spoken on Today.**
  - Animal glyphs on Today (the strip icons, the dial's rim, the poster animal, the route's NOW disc) are decorative to screen readers (`aria-hidden`). Each day cell's own label, with date and tone, carries the meaning.
  - Acceptance: an E2E accessibility snapshot of Today in each look contains no animal-sign name.
- **R3. The look previews follow.** The onboarding and Settings previews show the same header without the label.
  - Acceptance: an E2E check on the onboarding look step finds no pillar words.
- **R4. The day's tone takes the label's place** (option (b)).
  - The freed slot shows the day's tone in a few plain words, from the same tone as the week strip and the route, so the header and the strip always agree.
  - Acceptance: a unit test checks every tone has a phrase that passes the plain-terms check. E2E finds the phrase in each look's header, and it matches the tone of the day's cell in the week strip.

## Out of scope

- The animal artwork itself: the glyphs stay as imagery, and only their spoken names go.
- Conditions' hero ("yin fire · pig day"). Conditions is retired in M24-04 (D4).
- Chart, Cycles and Compare, which keep the old voice until their M24 ticket (VOICE rule 11).

## Open questions

- [x] **What goes where the label was?** Choose one:
  - **(a) Nothing** (recommended). The header is the date alone. The trial ran this way, and the day's character is already a card below.
  - **(b) The day's tone in a word or two** ("A clear day", "Take it slow"), from the same tone the week strip uses.
  - **Answered: (b)** (owner, 2026-10-11: "let's go with b"). This becomes R4.
- [x] Approve this ticket (requirements and design). **Approved** with (b) (owner, 2026-10-11).

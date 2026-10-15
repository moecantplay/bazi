# First week

Status: in-progress · Milestone: M24 · Ticket: 10 · Carries [M20-11](../../m20-clarity/11-today-first-run/requirements.md) (dropped into this ticket 2026-10-10) · Approved by the owner 2026-10-15 ("i approve all your recommendations, run it")

## Problem

M20-11 was written on 2026-09-29 for a Today that no longer exists. Its list of unfamiliar things (day pillar, map, waypoints, fact tags, clash/combine/trine, palaces) is gone: Today has used everyday words since M20-21, and the reshape (M24-04 to 06) removed the jargon header, the look step and the reveal. The reader's first day is now covered by M24-06's first-day banner (`apps/web/src/components/today/first-day-banner.tsx`): on the date in `profile.createdAt`, one line gives their portrait and says what the page does each morning.

What a new reader still meets all at once on day one, in every look:

| On Today | What it is | Explained today? |
| --- | --- | --- |
| The look's visual (dial, route, poster) | the day's hours and marks | Instrument and Explorer have a "What the marks mean" link (M24-15). Nothing explains it unprompted. |
| Up to six kinds of plain card (`packages/content/src/readings/daily/cards.ts`) | "Also today", "The day's element", "The day's character", "Hours", "Your pace", "Small signs" | Only by tapping "Read more" into each topic page. The kickers don't say why a card is there or what it's for. |
| What the day suits | the activities chips | No. |
| Today's colour | a swatch and a line | No. |
| The journal ("rang true" / "didn't fit") | marking the day | No. |

That's up to ten new things below the first screen on day one, with nothing on day two or later to bring them in one at a time. This is M20-11's problem, unchanged: deeper layers arrive all at once and nothing introduces them.

**The proposal's mechanism doesn't work.** The reshape proposal (§4) said the first week would be "stepped by visit count (… using the existing `lead-visit` counter)". `leadVisit` (`packages/presentation/src/lead-visit.ts`) is computed from the date alone, with no stored history. It counts how often the day's *situation* has come up in the calendar, not how many times *this reader* has opened the app. It can't tell a first-week reader from a reader of two years. Introducing things to a reader needs stored state.

**"How this reading works" was meant to show on the first days** (proposal §4: "shown on a reader's first days, then under You"). M24-06 moved it to You only. Its copy (`packages/content/src/glossary.ts:40`) talks about "Four Pillars", "stems", "palace" and "the instrument this app reads", so on Today it would break VOICE rule 11.

## Goal

A new reader meets Today's layers one at a time: the first-day banner on day one, then one short note a day saying what one part of the page is for, across their first week. Readers who already have a chart never see it.

## Requirements

- **R1. One note a day, on the reader's first days.**
  - The note shows on Today, in the same spot as the first-day banner (after the first screen, before the cards). It's one or two sentences, names one part of the page, and says what that part is for.
  - Notes run from the second day the reader opens Today to the seventh. Day one keeps the existing first-day banner unchanged. Day eight onward, nothing shows.
  - A note shows only when the displayed date is today. Browsing to another date shows none.
  - Acceptance: an E2E test with a pinned clock onboards, then walks seven opened days. It sees the banner on day one, exactly one note on each of days 2–7, and none on day 8.
- **R2. Each part is introduced once, in a fixed order, only when it's on screen.**
  - The order: Hours, The day's character, Your pace, The day's element, Also today, Small signs, What the day suits, Today's colour, the journal.
  - Each day's note goes to the first part in that order that hasn't had one yet *and* is on that day's Today. A card kind missing that day (Small signs only appears on some days) waits for a later day.
  - Reloading the same day shows the same note. Once a part has had its note, it never gets another.
  - There are nine parts and six days, so some may never get a note. That's fine: every card already has "Read more".
  - Acceptance: presentation unit tests over Fixture A and the unknown-time fixture for a run of dates. One note a day, never a repeat, never for a part that isn't on screen, and the same answer on a reload.
- **R3. Readers who already had a chart skip it.**
  - Any store written before this ships reads as "first week finished". Only a profile created through onboarding after the ship starts a first week.
  - Restoring a backup keeps the backup's state. Editing birth details doesn't restart it. Delete-all followed by onboarding starts a new one.
  - Acceptance: the existing-profile E2E (seeded store) sees no note. Store tests cover the missing field, a malformed field, backup round-trip and edit-birth.
- **R4. The state lives in the single store.**
  - It's an additive field on `daymaster.store.v2`, shaped for sync, so a second device doesn't start the week over. No new localStorage key, and it stays out of the streak key.
  - Acceptance: the store sanitiser test drops malformed values. The backup envelope test round-trips the field.
- **R5. Same in every look.**
  - Explorer, Editorial and Instrument show the same note in the same place relative to the content (DESIGN.md: a look moves content, never drops it).
  - Acceptance: the first-week E2E runs day 2 in all three looks. Screenshots of 3 looks × 2 themes.
- **R6. The notes follow VOICE.md.**
  - No system terms (rule 11), no fatalism (rule 4), second person, plain verbs. A note may name a card by its kicker ("Hours", "Your pace"), because that's the word on screen.
  - Acceptance: the content voice tests run over the note bank. The owner reads every note in the mockups.
- **R7. Mockups first.** No trial screen covers this, so it gets a normal mockup round: day 1, day 2 and one later day, in each look, in both themes, with real notes for Fixture A. The owner signs off before app code.
  - Signed off 2026-10-15: style D (a sunken speech bubble with week dots, chosen from four) and the content-writer agent's copy (chosen over the in-thread draft).
- **R8. Ships.**
  - Acceptance: `pnpm verify`, full E2E in every look, the contrast check covering the note, and a live check of day 1 and a seeded day 2 on production after deploy.

## Out of scope

- Onboarding (M24-05) and the first-day banner's wording (M24-06).
- Rewriting "How this reading works" in plain words, or bringing it back to Today (see the open questions).
- Explaining the look's marks unprompted. The "What the marks mean" links (M24-15) stay the way in.
- Usage counts for the notes. Counting stays dormant until M21 (D6).

## Open questions

- [x] **Count opened days or calendar days?** **Opened days** (owner, 2026-10-15). Recommended: **opened days**. A reader who opens on day 1 and comes back on day 9 still gets their second note, and the window doesn't run out while they're away. The other option counts calendar days from `profile.createdAt` and needs less state, but a reader who skips days misses notes.
- [x] **Where the note sits.** **One note in the banner's slot** (owner, 2026-10-15). Recommended: **one note in the banner's slot** that names the part ("Hours, below, shows…"). One component works in all three looks. The other option is a line attached to the card itself, which reads more directly but breaks Instrument's half tiles (Hours and Your pace sit side by side at about 160px) and needs three layouts.
- [x] **The nine parts and their order (R2).** **As listed** (owner, 2026-10-15). Hours comes first because it's the most useful on day two, and the journal comes last. Confirm the list and order, or reorder it.
- [x] **"How this reading works" on the first days.** **Leave it on You only** (owner, 2026-10-15). The proposal put it there; M24-06 didn't. Recommended: **leave it on You only**. Its copy uses system terms that Today can't carry, and a plain rewrite belongs with the words ticket (M24-11). If you want it in the first week, it would come back as the day-7 note's link after a rewrite, which widens this ticket.
- [x] Approve the requirements and design. **Approved** (owner, 2026-10-15). Mockups (R7) come next, before any app code.

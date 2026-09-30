# Today reads as one written piece

Status: approved · Milestone: M20 · Ticket: 21

## Problem

Owner, 2026-09-29: "a lot of redundant wording/sentences (daily and from one topic to another). if we should change the approach of delivery then let's do it."

The daily reading is an inventory, not a piece of writing. `dailyReading` (`packages/content/src/daily-reading.ts`) emits one line per fact kind, every day, in a fixed order: up to two transit interactions, then element, ten god, star, stage, hours. Dos, don'ts, the headline, the agency line and the guidance prose (`day-guidance.ts`) are each drawn independently from the same facts. Rendered for Fixture A, 2026-09-29 → 2026-11-27 (`research/today-60d-fixture-a-before.txt`):

- **Same skeleton every day.** "The day sits at your '…' stage" opens a line on 60 of 60 days; "The old calendars call / The old books name today…" on 60; "Today lights your…" on 32. The element line is one fixed sentence pair per element ("A Fire day, and Fire tends to suit you. Warmth is on your side…").
- **One idea said three to five times.** 2026-09-29: the clash is the headline ("Something has to move today"), a line ("Something has to move, and you get to pick which"), a do ("clash days are for moving stuck furniture") and a don't ("leave room for something to move").
- **Terms explained twice, then paraphrased.** "…an insight from the odd angle day — put plainly, learning by your own strange route… Good for thinking sideways and learning strangely." VOICE.md rule 11 requires the "old calendars call… put plainly…" frame on every term in every line, so the frame repeats on every fact line.
- **Small pools.** 15 unique headlines, 19 agency lines, 13 don'ts, 26 dos in 60 days. "Say yes to the thing you've already half-decided" appears 30 times.
- **About 340 words a day** (293–389).
- **The first screen's "one idea" is the element line.** `grainLine` is the first `overall` line, so the day's strongest fact (the clash) isn't what the first screen says.

M20 tickets 10, 12 and 14 cap length, rotate banks and grow them. They keep the one-line-per-fact skeleton, so the reading would still walk the same six shapes with synonyms swapped in.

## Goal

Each day reads as a short piece built around one idea: the day's strongest fact, said once, turned into one thing to do. Every other fact is still there one tap away, as a label rather than a sentence.

## Requirements

- **R1. One lead fact per day.** The reading picks a lead fact: the strongest transit interaction (existing severity order, the day's own before year/month themes). When there are none, the ten-god day. It adds at most one modifier fact, only when the modifier changes the advice (proposal: the element day's suits/against tone).
  - Acceptance: a content test over 90 days × Fixtures A–D asserts exactly one lead and ≤ 1 modifier per day, and that the lead is the highest-severity fact present.
- **R2. The first screen is headline → body → agency, written as one piece.**
  - Headline: the day's consequence in the reader's terms, ≤ 12 words.
  - Body: 2–3 sentences. The lead fact is named and explained once, the modifier (if any) turns it, and nothing from the headline is restated.
  - Agency: follows from the lead (VOICE rule 6), closes the first screen.
  - Acceptance: over 90 days × Fixtures A–D, no two of headline/body/agency share a 4-word phrase; first-screen words/day within the budget agreed from the mockup (proposal: ≤ 70).
- **R3. Wording is keyed to the combination, not the fact alone.** Body and headline pools are indexed by lead × area × modifier tone (e.g. clash · career palace · element suits you), so two clash days read differently when their circumstances differ.
  - Acceptance: every reachable cell has a pool of ≥ 3 entries with different sentence shapes (ticket 14 grows them to ticket 12's window); a test enumerates the cells and fails on a pool under 3.
  - Variety (owner, 2026-09-30, on mockup v3: "needs more variety or choice of words to account for redundancy"): over 90 days × Fixtures A–D, no 4-word phrase on the first screen repeats within 7 days for the same chart. Repeated sentence shapes (e.g. "X may … today: a, b, or c") are capped by ticket 13's plain-writing rules.
- **R4. Everything else is a plain topic card; each card has its own topic page.** Owner, 2026-09-30: "a detailed page for each topic card" (a single catch-all detail page was rejected as unnecessary). Below the first screen, Today shows one card per non-lead fact (other sign links, element, the day's character, hours, pace, small signs), each a plain title and one plain sentence, in the look's approved layout (Explorer waypoints, Editorial rows, Instrument tiles), then "What the day suits". No old names and no sign mechanics on Today. Every card, and the reading itself (a "Read more" under the body), opens that topic's page.
  - Acceptance: a presentation test asserts each fact appears in exactly one of first screen / cards, over 90 days × Fixtures A–D; a content test fails if a card's title or sentence contains a system term (R10 list).
- **R11. Topic pages.** A topic page has: a plain title; the old name, introduced once as a name ("The old calendars call this a clash."); "For you today" (how it applies to this chart and date, including the sign mechanics in plain words); "How it tends to go"; "Working with it" (soft directives, VOICE rule 12); "Where the name comes from" (the system plumbing, from the glossary). The small-signs page lists each star with its plain title, one line and its old name. Route `/today/topic/?date=YYYY-MM-DD&topic=<key>` using the existing topic keys (`interaction:six-clash`, `ten-god:Friend`, …), static-export safe. Back returns to Today on the same date, so Today reads and writes `?date` (clamped to its range).
  - Acceptance: every topic key reachable from Today over 90 days × Fixtures A–D has page content (test); E2E opens a card's page and the reading's page in every look and returns to the same date; a bad `date` or `topic` falls back to Today.
- **R5. Nothing is lost.** Every fact the engine produces for the day stays reachable: in the first screen, in details, or in "What the day suits". The map/dial marks still show the day's all-day relations and timed hours.
  - Acceptance: presentation test: set of facts shown ⊇ set of facts produced; E2E map/dial specs green in all three looks.
- **R6. "What the day suits" says each reason once.** Chips stay (VOICE rule 12). Each Watch chip keeps exactly one short reason; guidance prose no longer restates the element or lead fact already on the first screen. Separate dos/don'ts lists retire (see Open questions).
  - Acceptance: no guidance line shares a 4-word phrase with the first screen, 90 days × Fixtures A–D; every Watch chip has its reason (existing rule-12 test).
- **R7. VOICE.md says how a composed reading works.** Rule 11 changes: reading text carries no system terms at all (R10); old names appear only in the details, as a tag under a plain title, with the glossary link. Rule 2 allows the 2–3 sentence body. A new rule: one idea per screen, each fact spoken once. Calibration examples updated.
  - Acceptance: VOICE.md amended in this ticket; existing voice tests updated to the new rules and green.
- **R8. Mockups before code**, all three looks × both themes, 390×844, real content for a week for Fixture A and for the unknown-time fixture (VOICE rule 9 holds: nothing hour-derived). Owner picks the budget and the details layout.
  - Acceptance: artifact + screenshots in `research/`, owner sign-off noted below.
- **R10. The reading says how the day could go and what helps; no system terms in it.** Owner, 2026-09-30, on mockups v1–v2: sign mechanics ("the day's sign, the rooster, brushes the dog in your chart's roots") lose them, and even a framed old name ("the old calendars call today a clash at work") should go: "if it's trying to say there would be a clash at work then just say how it could be and … how the person should act to help reduce or maybe prevent". Headline, body and agency use everyday words only: the life area (work, family, home and partner, long-term plans), how the day could show up there, and how to act to ease or head it off. The element is said as its effect ("you come across well today"), not by name. Old names and the sign mechanics live in the details: a "Why today" item in plain words, and every detail leads with a plain title and one plain sentence, with the old name as a small tag.
  - Acceptance: a content test fails if headline/body/agency contain an animal name, a palace word ("palace", "roots", "horizon"), an element name, an interaction name (clash, combine, trine, harm, punishment), a ten-god or star name, or "old calendars"/"old books"; owner signs off on mockup v3.
- **R9. Deterministic, on-device.** Same profile + date gives the same reading; no render-time randomness; no network.
  - Acceptance: existing determinism tests green; a same-input-twice test over the new builder.

## Out of scope

- Growing pools to the repeat window (ticket 14) and the no-repeat rotation (ticket 12). This ticket ships ≥ 2 entries per cell and the structure they plug into.
- Cycles, Chart and Compare copy. If the owner wants the same treatment there, it becomes a follow-up ticket once this pattern is proven on Today.
- First-run introduction (ticket 11).
- Engine changes: every fact used already exists.

## Open questions

- [x] **Run it now or after M19.9?** **Now** (owner, 2026-09-29). Today's three looks are done (M19.9-05) and the remaining M19.9 screens don't render the daily reading, so this doesn't collide with them.
- [x] **Retire the dos/don'ts lists?** **Yes** (owner, 2026-09-29). The agency line carries the "do", and the Watch chips with their reasons carry the "don't". Keeping them brings back the restating this ticket removes.
- [x] **First-screen budget:** ≤ 70 words (owner, 2026-09-30, from mockup v1).
- [x] **Details layout per look:** Explorer waypoints, Editorial rows, Instrument tiles (owner, 2026-09-30, from mockup v1).
- [x] **Old names in the reading text?** **No** — say how the day could go and how to act (owner, 2026-09-30, on mockup v2). Mockup v3 applies it.
- [x] **Mockup v3: reads like a person?** **Yes**, needs more variety of wording (owner, 2026-09-30). Folded into R3.
- [x] **Old-name tags in details:** middle option, but old names live on each topic's own page, reached by "Read more" from its card; Today stays plain (owner, 2026-09-30; a single detail page, mockup v4, was rejected). Mockup v5.
- [ ] **Mockup v5 sign-off:** topic page sections, and "Read more" as the way in.

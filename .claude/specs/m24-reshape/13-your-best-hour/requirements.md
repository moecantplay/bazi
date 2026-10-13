# Your best hour

Status: in-progress · Milestone: M24 · Ticket: 13 · Approved by the owner 2026-10-13 ("start")

## Problem

"I noticed that it is uniformed across different users … I was under the impression that it should be based on each individual's elements and/or chart" (owner, 2026-10-13).

The easy and rough hours never look at the chart. `hourInteractionFacts(dayBranch)` (`packages/bazi-engine/src/facts.ts:243`) takes only the day's branch. The rough hour is the block that clashes with it and the easy hour is the block that combines with it, so every reader in the same zone sees the same two hours. That is the almanac's 時辰吉凶 read, and it is meant to be general. But nothing on Today tells a reader which hour suits *them*.

[M19.5-06](../../m19.5-post-launch/06-honest-map-timing/design.md) rejected comparing the hour against the chart because of two problems. First, the block animals are fixed to the clock, so a natal clash lands on the same hours every day. Second, checking four natal branches lights up most of the twelve blocks. Both problems come from comparing **branches**. A block's **stem** does change: it follows the day stem (Five Rats, `FIVE_RATS`, already in `hourPillar`, `pillars.ts:135`). So a block's element can be checked against the reader's favourable elements, the same test the `element-day` fact already makes.

I prototyped this with the scoring in design.md, over 60 days from 2026-10-13 for three charts (scratch script, not committed):

| Chart | Favourable | Best hour, by window (days of 60) | Repeats after |
| --- | --- | --- | --- |
| Fixture A (戊, weak) | fire, earth | 7–9 am ×19, 5–7 pm ×12, 11–1 ×11, 7–9 pm ×7, other 3 windows ×11 | ≥ 60 days |
| B (丙, strong) | water, earth, metal | 1–3 pm ×29, 7–9 am ×12, 3–5 pm ×11, 7–9 pm ×5, 5–7 pm ×3 | 55 days |
| C (乙, weak) | wood, water | 7–9 pm ×21, 7–9 am ×12, 3–5 pm ×10, 11–1 ×10, other 2 windows ×7 | ≥ 60 days |

On the first test day, the three charts got three different hours, and none of them was the almanac's easy hour.

## Goal

Next to the day's easy and rough hours, Today shows **your best hour**: the two-hour block whose element suits your chart most, at any time of day or night. It is clearly labelled as yours, kept separate from the day's hours, and works the same in all three looks.

## Requirements

- **R1. The engine picks one best hour per chart and date.**
  - The engine emits a new `best-hour` fact from `dailyFacts`, using the scoring in design.md.
  - The day's rough hour is never picked.
  - All twelve blocks are considered, night ones included (owner, 2026-10-13).
  - When no block's stem element suits the chart, there is no fact that day.
  - The pick is deterministic: same chart, date and zone give the same fact.
  - Acceptance: engine tests written first.
    - A golden pick for Fixture A on dated cases worked by hand.
    - The rough hour is never chosen.
    - Ties break as specified.
    - The natal hour pillar is never read (VOICE rule 9): a chart with its hour removed gets the identical fact. (An unknown-time chart can still differ, because its favourable elements are computed without the hour.)
    - A 365-day sweep over every fixture shows no pick on the rough hour.
- **R2. Today keeps the day's hours and adds yours.**
  - The hours card keeps "Easiest …" and "Roughest …" word for word and adds "<window> suits you best."
  - When your best hour is the same block as the day's easy hour, the card says that once instead of listing it twice.
  - With no `best-hour` fact, the card reads as it does today.
  - Acceptance: content tests for all three cases; a 60-day render for Fixture A has no repeated window in one card.
- **R3. The hours topic page says why.**
  - The page gives one plain sentence on why the hour suits you (its element and what that element does for you).
  - The page keeps the day's easy and rough hours as they are.
  - Acceptance: content test. The voice check passes, and no system terms appear outside the old-name line.
- **R4. All three looks show it; a look moves content, never drops it.**
  - Explorer: a third timed mark on the route.
  - Instrument: your hour on the dial and in the key.
  - Editorial: the hours card.
  - The mark wears its own element's colours (style A, owner 2026-10-13), never cinnabar. On a wood or earth hour that colour matches the easy hour's wood or comes close to the rough hour's amber; the owner accepted this after seeing it (round 2, 2026-10-13). The star and the "SUITS YOU" label are what set the mark apart.
  - DESIGN.md is updated in this ticket, because it currently says "only the two timed marks" (Explorer) and "no more than three lit animals" (Instrument).
  - Acceptance: mockups of Today in all three looks × both themes, approved by the owner before any app code. E2E checks the mark and key in each look. Contrast is measured on rendered text in both themes.
- **R5. The scoring is flagged.**
  - The weights are our own interpretive choice, like day-quality's.
  - Acceptance: an entry in `flags.md`, and a source comment on the weights table.

## Out of scope

- Your *roughest* hour. The almanac's rough hour stays the only warning, so Today doesn't gain a second amber mark.
- Personalising the day's easy and rough hours themselves. They stay the almanac's, the same for everyone.
- Ahead and the week views (Ahead stays day-level).
- Late-zi (子 hour) handling beyond the engine default. Under `lateZiHour: "midnight"` both halves of the 子 block on a date take that date's Five Rats stem, as the existing easy and rough hours already assume.

## Open questions

- [x] 1. Which hours can be picked? **All twelve, night included: "if it's true like that"** (owner, 2026-10-13).
- [x] 2. What does the card's new line say? **"Easiest" and "Roughest" stay exactly as they are. The new line reads "1–3 pm suits you best." The reason (its element suits your chart) goes on the topic page** (owner, 2026-10-13; "Best for you" and "Your hour" were rejected because they leave unclear what the hour is for).
- [x] 3. No suiting block that day? **Show no personal hour; the card stays as it is today** (owner, 2026-10-13).
- [x] 4. Charts that land on one block often? **Keep it honest, no rotation** (owner, 2026-10-13).

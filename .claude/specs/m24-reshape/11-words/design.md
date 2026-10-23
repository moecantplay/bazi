# Design — Words

Three phases in one ticket, each committed and reviewed on its own, deployed once at the end (R10).

## Phase 1 — Rules (R1, R2)

- **VOICE.md** gains "Plain writing" after the hard rules, in the owner's approved wording. Each mechanical rule names its test. The metaphor rule goes on a review checklist.
- **`content/test/plain-writing.test.ts`** checks every line `test/plain-writing-rules.ts` collects:
  - every string reachable from every module under `src/banks/` (found on disk, so a new bank is checked without being listed) and from the reference copy readers see (`vocab.ts`, `glossary.ts`, `marks.ts`, `read-more.ts`), each run through `collect.ts`'s `render()` so templates are checked with sample values filled in;
  - every function those modules export. Line-building functions are called over their inputs (portrait, ease, colour lines, day-tone phrase, first-week kicker, welcome fallback, every star in every palace). Word and token helpers, and lookups of walked data, are listed as building no line. A test fails on any function export in neither list, so a new function bank can't slip past;
  - the chart page's composed lines (`natalReading` over `collect.ts`'s natal fact sets), where the strength tally and the star and interaction lines are assembled.

  `banks/compare.ts` is left out because its lines reach no screen since M24-12. Lines composed inside `readings/**` for Today, topic pages, Ahead and People are checked on rendered screens by `screen-repeats.test.ts` (task 8), which runs rules 1–4 over every collected sentence as well as rule 5. That's what stops phase 3 emptying this list while composed frames still break a rule.

  Checks, each pattern with its reason in the code:
  - rule 1: an em-dash, a hyphen dash (" - ", "--"), a spaced en-dash, or an en-dash not followed by a number ("5–7 pm" and "11 pm–1 am" pass, "Monday–Friday" fails). Checked on every string.
  - rule 2: at most 25 words per sentence, the same word count as the presentation tests.
  - rule 3: "It's not X, but Y" (a copula before "not": "do not rush the email, but do send it" passes, while "it is not much, but it helps" is flagged, as rule 3 intends), "Not X, it's Y" opening a sentence, "aimed…; unaimed…", "planned; unplanned".
  - rule 4: the opener and filler list, each entry with its reason.

  No allow-list was needed: the tightened patterns flag no legitimate line on the first run. One gets added, with a reason per entry, the first time a pattern over-matches.
- **Worklist.** The first run's failures (416 of 1,961 lines) are committed as `test/plain-writing-known.ts` (`rule | module | text`), summarised in `11-words/worklist.md`, and asserted as a known-failures list. The test passes while the list only shrinks, and fails if a new failure appears. Phase 3 empties the list, and the known-failures mechanism is deleted in the same commit. This keeps `pnpm verify` green between phases without `it.fails`, which can't say which entries still fail.

## Phase 2 — Rotation (R3–R5)

**One picker, slots as keys.** `content/src/rotation.ts` holds the picker every rotating line uses. A slot string names both the line and its situation (`card:stage:Peak`, `headline:six-clash:work`, `colour-line:steady`), and doubles as the key its visits are counted under. `DailySeed.visit: number` became `DailySeed.visits: Record<slot, number>`. A slot with no count steps by the day number, which keeps callers without visits working (welcome sample, previews).

**Visits, generalised (`presentation/src/slot-visits.ts`, replacing `lead-visit.ts`).** Every Today slot counted here depends only on the chart and the day pillar: the lead, the modifier and the cards on the day's facts, the best-hour note on the day's hours, the colour line on the day's element. So one scan of the date's 60-day pillar block counts them all: `block × times-per-block + rank-within-block`. Content's `dailySlots(facts, chartSeed)` runs the reading with a recording picker to list a day's slots; the slots depend only on the facts, never on the steps. `slot-visits.test.ts` checks, over 150 days and three fixtures, that every slot's count goes up by exactly one per occurrence, which holds only if the 60-day assumption does. The lead's counts equal what `leadVisit` gave (headline and agency identical over 450 fixture-days). The body changed only in its appended day-element sentence, which now steps by visit too.

**Pools.** `ELEMENT_CARDS`, `TEN_GOD_CARDS` and `STAGE_CARDS` hold pools of `[title, line]` pairs. `BEST_HOUR_LINES.card` and `.cardIsEasyHour`, `DAY_COLOUR_LINES` (replacing `dayColourLine`), the suits headings and `WATCH_REASONS` are pools whose placeholders (`{window}`, `{colour}`, `{acts}`) are filled after the pick. Each holds its old text as its only entry, so phase 2 changes no words, only which entry a pool of two or more shows. Interaction cards and the modifier moved from day-number to visit stepping.

**Day-type slots step by day number.** The suits heading and the Watch reason follow the day's officer, which depends on the solar month as well as the day, so they have no fixed cycle to count visits over. They step by day number, and the pool-minimum test finds sizes that avoid every gap they actually show within 14 days.

**Today's colour joins the screen model.** `todayScreenModel` computes `colour` with the same visits, so Today scans once per render. The web component reads `model.colour` and no longer needs a client hook.

**Topic pages mirror the card.** A topic page's title, and its opening line where the page has no fuller opening of its own, come from the same pool and visit as the card that opened it: `TopicContext.seed` carries the day's visits, and without it (existence checks) the pool's first entry heads the page. The explanations stay fixed. The page's "comes back on" look-ahead now reads facts only (`dailyFacts`), not full readings, which more than pays for the page's own visit scan.

**Ahead steps by period number, not visits.** Counting visits would mean a 60-period scan for every month and year on screen, and Ahead's lists show 12 months or 10 years at once. Each period instead steps by its own number (months since January 1970, the year, the decade's start year ÷ 10) through `steppedPicker`. Neighbouring periods then pick consecutive entries, and the pool-minimum test finds sizes that keep any 12 consecutive months, and any decade's years, free of repeats. Slots carry the span (`month:lead:…`, `year:element:…`), so months and years rotate independently.

**People: each line the screen hasn't shown.** `pairReading` takes the first pool entry not already on the screen (`firstUnused`) for link cards and for the two "brings out" lines, from a new `PAIR_BRINGS` bank (seeded from the period ten-god titles it used before). A pool of n keeps n links of one kind distinct.

**Pool minimums (R4, R5).** `presentation/test/pool-minimums.ts` lists each slot's occurrences with the step it picks by: visit count or day number on Today over a year, month number over ten years and year over a century on Ahead. A pool of size n repeats inside the window exactly when two occurrences inside it have steps differing by a multiple of n, so the test reads off each slot's smallest safe size. It runs over the five reading fixtures plus sixty pool charts (births 373 days apart from 1950: every day pillar, a spread of years, every two-hour block), because the fixtures alone missed short pools that ordinary charts hit (review, 2026-10-23). The 119 pools that repeat as they stand are the known list and phase 3's pool worklist.

**Topic pages without a card.** A quiet day's character page (opened from the lead) and an element page whose element joined the body have no card, so no visit. They take the pool's first entry, so their titles don't change day to day. `topic-card-mirror.test.ts` checks that every element, character and pace card shares its page's title over 60 days. The card's line opens the page only where the fuller page (M20-26) has no opening of its own.

**Render time.** Scanning every slot instead of just the lead first cost a day step on Today about 16 ms at 4× CPU throttle (about 82 ms median on the phase 1 build, about 98 ms after). It also tripled the copy audit's run time (21 s, against M20-02's 10 s), because every topic page re-scanned its block. So the block scan is memoized, like `chartFor`, on birth, config, zone and block: one entry, kept for the next date in the same block. After that, a day step takes about 70 ms median at 4× throttle, faster than before phase 2, and the copy audit runs in 2.4 s.

## Phase 3 — Words (R6–R9)

- **Order.** Worst offender first, by the copy audit and the two worklists: colour line, best-hour note, card pools, suits headings and Watch reasons, then Ahead, People, topic pages, and the chart banks (em-dashes).
- **Each bank** goes to the content-writer agent with a brief: what the slot is for, the facts it may cite, VOICE.md, its worklist entries, three good and three bad examples from the current bank, and the pool size R4 asks for. The agent returns the bank. Then run `voice`, `plain-writing` and the rotation tests, and re-run the copy audit.
- **Rendered tests (R6).** `presentation/test/screen-repeats.test.ts`, beside `today-composed.test.ts`: the 14-day window on Today, the within-view rules on every screen, and plain-writing rules 1–4 on every rendered sentence, over 90 days and every fixture. The rules moved from `content/test/plain-writing-rules.ts` into `content/src/plain-writing.ts`, which both packages' tests import. The test's known state is a ratchet of counts per surface (`screen-repeats-known.ts`), not a list of sentences: thousands of rendered sentences would be unreviewable. The test requires equality, so a count that drops gets written back down and can't creep up again. Phase 3 also gave rule 3 "X, not Y" (owner, 2026-10-23), with VOICE.md's verbatim disclaimer as the one allowed line, and made `natalStarLine` say its gloss once. It reuses the copy audit's collector and metrics (`scripts/copy-audit/surfaces.ts`, `metrics.ts`), so the test and the audit count the same way.
- **Sample (R9).** `copy-audit --sample <fixture>` prints a fixture's sample in reading order, from `collectSurfaces`. Fixtures A and D are published as one private page for the owner to read.
- **After.** Commit `after.json` and the before/after table (R8). Owner sign-off, then one deploy.

**What the rewrite changed in structure** (batches A to E, 2026-10-23):
- The chart page's strength explanation is two lines: the three checks, then the tally ("Only two of the three run in your favour…", with "by a narrow margin" when it was close). Three checks and a tally won't fit two sentences of 25 words, and `voice.test.ts` allows two sentences per line.
- Natal pattern lines write sign pairs out ("rat and horse") through a joiner in `natal-interactions.ts`, because `vocab.ts`'s "rat–horse" breaks rule 1. Captions keep "rat–horse".
- Star lines open "Your {palace}: {gloss}." The earlier "In your {palace}:" made two stars in one palace share a phrase.
- You's ease line has its own wording per element (`EASE_YOU` in `banks/you/you.ts`), so it never echoes the first "helps" line beside it.
- The topic-page closing reads "This describes how a day tends to lean; what it becomes is up to you." It keeps M20-26's meaning (tendencies, the reader's choice) without the "X, not Y" shape.
- The known-failures list and the screen ratchet are deleted now they're empty, and both tests require zero outright.
- VOICE.md's day-master example now matches its bank line, because the old one was a "never X, it is Y" contrast.
- Two em-dashes in fixed UI text on the chart page (`chart-view.tsx`) are outside this ticket (fixed UI strings are out of scope).
- Find a day's doubled officer gloss is noted on M20-01.

## Changes

| Area | Change |
| --- | --- |
| `.claude/specs/foundation/VOICE.md` | Plain writing section (R1) |
| `packages/content/test/plain-writing{.test,-rules,-known}.ts` | New test, rules and line walk, known-failures list |
| `packages/content/src/rotation.ts` | Picker, stepped picker, first-unused, placeholder fill |
| `packages/presentation/src/lead-visit.ts` → `slot-visits.ts` | One 60-day scan, a visit count per slot |
| `packages/presentation/src/{today-colour,today-screen,topic-page}.ts`, `apps/web/.../today-colour.tsx` | Colour in the screen model; topic pages mirror the card |
| `packages/content/src/types.ts` | `DailySeed.visits` |
| `packages/content/src/banks/**` | Pools in place of fixed lines; rewritten entries |
| `packages/content/src/readings/daily/{cards,day-colour,today-suits,daily-reading}.ts` | Pick by visit |
| `packages/content/src/readings/{ahead,people}/*`, `presentation/src/ahead-screen.ts` | Ahead steps by period number; People distinct lines |
| `packages/presentation/test/{slot-visits,pool-minimums,screen-repeats}.test.ts`, `pool-minimums{,-known}.ts` | New |
| `packages/presentation/scripts/copy-audit*` | `--sample` |
| this ticket | `worklist.md`, `after.json`, before/after table |

## Alternatives considered

- **Pick by day number with pool sizes chosen to avoid the cycle lengths.** No scan needed. But element days fall on days 0, 1, 10 and 11 of a cycle, so whether a pool repeats within the window depends on its size and the chart's offset in ways that are hard to see and easy to break when a pool grows. Visits make "no repeat until the pool runs out" true by construction.
- **Remember what was shown, in the store.** Breaks determinism across devices and after restore (M20-12 rejected it too).
- **Rotate topic-page explanations.** A reference page that changes each visit is harder to learn from. Left out (requirements, out of scope).
- **A prose-linting dependency.** Generic rules, not ours, and a new dependency (M20-13 rejected it too).

## Risks

- **Every reading changes on deploy.** Accepted once (R10). Same-day re-opens after the deploy show a different reading than before it. There's no store impact.
- **Pool sizes grow fast.** The colour line's situation (whole pillar, lean or steady) can come up most days, so its pool may need 10 or more entries. R4's test says exactly how many before any writing starts, so nothing is written blind.
- **Rendering cost.** Covered by the phone-profile check in Phase 2.
- **Copy written only by the agent may still read as generated.** That's the reason for the R9 owner read, and the open question on a later copywriter pass.

## Verification

- `pnpm verify` green after each phase. `plain-writing`, `pool-minimums` and `screen-repeats` pass with no known-failures left.
- Copy audit: R8 targets met, `after.json` committed.
- Owner sign-off on the R9 sample.
- E2E in all three looks (`e2e:looks`), then deploy and a live-app check of Today in each look × both themes, a topic page, Ahead and People.

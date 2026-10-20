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

**Visits, generalised.** `presentation/src/lead-visit.ts` counts how many times a day's lead situation has come up, from a 12- or 60-day block, with no history. Every Today slot in R3 is a pure function of the day pillar plus the chart: element and day's character follow the stem (10-day cycle), pace follows the branch (12), and the colour, suits heading and Watch reason follow the whole pillar (60). So one 60-day scan serves them all:

- `slotVisits(chart, zone, dateISO, chartSeed)`: for each day in the date's 60-day block, compute the day's facts once, derive every slot's situation key, and return `{ [slotKey]: visitCount }` for the displayed date.
- This replaces `leadVisit`, which becomes the `lead` entry, so Today still scans one block per render, not one per slot. `DailySeed.visit: number` becomes `DailySeed.visits: Record<string, number>`.
- The 60-day scan costs about 60 × `dailyFacts`. `leadVisit` already does that on quiet days, so the worst case on device doesn't change. Check render time on a phone-class CPU profile before and after.

**Pools.** In `content/src/banks/daily/cards.ts`, `ELEMENT_CARDS`, `TEN_GOD_CARDS` and `STAGE_CARDS` change from one `[title, line]` to a pool of pairs. `BEST_HOUR_LINES`, `dayColourLine`, the suits headings and `WATCH_REASONS` become pools. `cards.ts`, `day-colour.ts` and `today-suits.ts` pick with `cyclePick(pool, chart, slot, visits[slot])`. Interaction cards move from `dayNumber(seed.date)` to their visit count.

**Ahead.** `periodReading` gains the same visit stepping, counted in `presentation/src/ahead-screen.ts` the way `slotVisits` counts days: a block scan over the period's own cycle (months: 12 or 60 months; years: 12 or 60 years), depending on whether the period's lead follows only its sign or its whole pillar. Phase 2 confirms which, from `periodReading`'s lead choice, before writing the scan.

**People.** `pairReading` picks link-card lines with `pickDistinct` across the screen, instead of one fixed line per (link, area), so two cards on one screen can't share a line.

**Pool minimums (R4).** `presentation/test/pool-minimums.test.ts` walks two years of dates for every fixture, records each slot key's largest count within any 14-day window, and compares it with the pool's length. The failures it lists are Phase 3's pool worklist.

## Phase 3 — Words (R6–R9)

- **Order.** Worst offender first, by the copy audit and the two worklists: colour line, best-hour note, card pools, suits headings and Watch reasons, then Ahead, People, topic pages, and the chart banks (em-dashes).
- **Each bank** goes to the content-writer agent with a brief: what the slot is for, the facts it may cite, VOICE.md, its worklist entries, three good and three bad examples from the current bank, and the pool size R4 asks for. The agent returns the bank. Then run `voice`, `plain-writing` and the rotation tests, and re-run the copy audit.
- **Rendered tests (R6).** `presentation/test/screen-repeats.test.ts`, beside `today-composed.test.ts`: the 14-day window on Today, the within-view rules on every screen, and plain-writing rules 1–4 on every rendered sentence, over 90 days and every fixture. The rules move from `content/test/plain-writing-rules.ts` into one module both packages' tests import. It reuses the copy audit's collector and metrics (`scripts/copy-audit/surfaces.ts`, `metrics.ts`), so the test and the audit count the same way.
- **Sample (R9).** `copy-audit --sample <fixture>` prints a fixture's sample in reading order, from `collectSurfaces`. Fixtures A and D are published as one private page for the owner to read.
- **After.** Commit `after.json` and the before/after table (R8). Owner sign-off, then one deploy.

## Changes

| Area | Change |
| --- | --- |
| `.claude/specs/foundation/VOICE.md` | Plain writing section (R1) |
| `packages/content/test/plain-writing{.test,-rules,-known}.ts` | New test, rules and line walk, known-failures list |
| `packages/presentation/src/lead-visit.ts` → `slot-visits.ts` | One 60-day scan, a visit count per slot |
| `packages/content/src/types.ts` | `DailySeed.visits` |
| `packages/content/src/banks/**` | Pools in place of fixed lines; rewritten entries |
| `packages/content/src/readings/daily/{cards,day-colour,today-suits,daily-reading}.ts` | Pick by visit |
| `packages/content/src/readings/{ahead,people}/*`, `presentation/src/ahead-screen.ts` | Ahead visits; People distinct lines |
| `packages/presentation/test/{pool-minimums,screen-repeats}.test.ts` | New |
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

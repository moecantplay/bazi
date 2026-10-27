# Words

Status: in-progress · Milestone: M24 · Ticket: 11 · Approved by the owner 2026-10-20 ("approved", every recommendation below) · Carries [M20-12](../../m20-clarity/12-no-repeat-selection/requirements.md) (no repeats day to day), [M20-13](../../m20-clarity/13-voice-lint/requirements.md) (voice lint) and [M20-14](../../m20-clarity/14-copy-rewrite/requirements.md) (copy rewrite), all dropped into this ticket 2026-10-10. R11–R12 (word variety) added at the owner's request 2026-10-23, design approved 2026-10-27. Judged against the [M20-02 baseline](../../m20-clarity/02-copy-audit-baseline/requirements.md#baseline).

## Problem

The three M20 tickets were written on 2026-09-29 against the old Today, where the first screen was the problem: 15 headlines in 60 days, 685 em-dashes. M20-21 and the reshape fixed that part. The M20-02 baseline (2026-10-20) shows where the repetition is now, measured the way one reader meets it: one chart, day after day (Fixture A, 90 days from 2026-10-20).

| Today, Fixture A | Unique | Comes back within 7 days | within 14 days |
| --- | --- | --- | --- |
| Headline | 63 of 96 | 0 | 0 |
| Body | 135 of 218 | 0 | 4 |
| Agency | 60 of 90 | 0 | 0 |
| Card titles | 64 of 596 | 145 | 521 |
| Card lines | 49 of 411 | 25 | 351 |
| Best-hour note | 8 of 90 | 57 | 77 |
| "What the day suits" heading | 12 of 90 | 3 | 78 |
| Watch reason | 12 of 46 | 1 | 32 |
| Colour line | 9 of 180 | 138 | 159 |

The first screen is fine: it steps through its pools by how many times the day's situation has come up (`cyclePick` with `leadVisit`, M20-21). Everything below it either has one fixed text per fact or picks by day number from a small pool:

- **Fixed text per fact:** the element, day's-character and pace cards (`content/src/readings/daily/cards.ts:56-90`), the best-hour note, the colour line (two sentences in total, `banks/colours.ts:47`), the suits heading and the Watch reason frames.
- **Ahead, People and topic pages** have no selection at all (no `pick` or `cyclePick` in `readings/ahead`, `readings/people` or the topic-page readings), so every situation always reads the same. One chart's 24 months of Ahead use 85 distinct sentences out of 196.
- **Within one screen:** People repeats a sentence on the same screen (14 times across Fixture A's four pairings; "Together you move faster, and faster still with one more on board." up to 3 times on one screen). Fixture A's topic pages have 373 sentence pairs that share a 4-word phrase on the same page.
- **Plain-writing habits aren't checked anywhere.** VOICE.md has no rules on em-dashes, stock openers, contrast constructions or sentence length (M20-13's proposal was never adopted). The chart page shows 15 em-dashes for Fixture A; its banks hold 56 between them (`elements.ts` 28, `stars.ts` 11, `natal-interactions.ts` 10, `day-master.ts` 5, `natal-reading.ts` 2). Every other screen is already at or near zero.

## Goal

A reader who opens the app every day doesn't meet the same sentence again within two weeks anywhere on Today, and no screen says the same thing twice. Every bank passes written plain-writing rules that a test enforces, and the words read like a person wrote them.

## Requirements

### Rules

- **R1. Plain-writing rules in VOICE.md.** VOICE.md gains a "Plain writing" section. Proposed rules, for the owner to approve or edit:
  1. No em-dashes in reading copy. Use a full stop, a comma or a colon.
  2. Sentences of 25 words or fewer.
  3. No contrast constructions: "not X, but Y", "X; un-X, Y", "aimed, it…; unaimed, it…".
  4. No stock openers or filler from a named list. The list is drafted from the current banks (e.g. "Today's sign…", "The day sits at your…") and kept in the test with a reason beside each entry.
  5. A screen never says the same sentence twice, and two sentences on one screen never share a 4-word phrase. A title may echo the line it introduces.
  6. At most one metaphor or comparison per card. This can't be checked mechanically, so it goes on a review checklist in VOICE.md.
  - Acceptance: the section is in VOICE.md with the owner's wording, and rules 1–5 each name the test that enforces them.
- **R2. A test enforces the rules on every bank line.** `content/test/plain-writing.test.ts` renders every bank entry (the existing `collect.ts` enumeration, extended to the M24 banks) and checks rules 1–4. Rule 5 is checked on rendered screens over 90 days for every fixture (R6).
  - Acceptance: the test fails on today's banks. Its first run is committed as the rewrite's worklist; at the end of the ticket the worklist is empty and the test passes without exceptions.

### Rotation

- **R3. Today's lower half steps through pools the way the first screen does.** The element, day's-character and pace cards, the best-hour note, the colour line, the suits heading and the Watch reason pick by visit: how many times that card's situation has come up for this chart before, worked out with no stored history, as `leadVisit` does. Interaction cards, which pick by day number today, move to visits too. Star titles stay fixed: each one is the plain name of a sign, and it has to match that sign's entry on the small-signs page.
  - Acceptance: same chart and date give the same reading, whatever order days are viewed in (the existing determinism test, extended).
- **R4. Pools are big enough for the window.** A slot's minimum pool size is the most times its situation can come up within 14 days for any chart. A test measures that over two years of dates for every fixture, and fails with a list of short pools.
  - Acceptance: the test passes, with no exceptions.
- **R5. Ahead and People vary too.**
  - Ahead: a month or year reading steps by how many times its situation has come up for this chart. Target: within any 12 consecutive months, and within any decade's years, no lead sentence appears twice for one chart.
  - People: one screen never shows the same sentence twice. Two link cards in different parts of life get different lines.
  - Acceptance: tests over every fixture (and every fixture pairing, for People).

### Words

- **R6. Rendered-screen tests hold the targets.** Over 90 days from 2026-10-20 for every fixture:
  - Today: no sentence in any slot comes back within 14 days for the same chart, except star titles and the hours card (times, not prose). M20-21's first-screen guards stay.
  - Every screen: zero sentences said twice on one view (R1 rule 5). Zero 4-word phrase pairs within one view, except a title echoing its own line.
  - Acceptance: tests in `packages/presentation/test/`, beside `today-composed.test.ts`.
- **R7. The banks are rewritten to pass.** Every bank that R2, R4 or R6 flags is rewritten or extended, bank by bank, worst first by the copy audit. Drafts go through the content-writer agent. Every entry still passes the existing VOICE.md checks: no fatalism, the agency line, rule 11 (no system terms outside topic pages), rule 12 (layered guidance).
  - Acceptance: `voice.test.ts`, `plain-writing.test.ts` and the R4–R6 tests all pass.
- **R8. Copy-audit targets, against the M20-02 baseline.** Proposed, for the owner to approve:

  | Surface | Baseline (Fixture A) | Target |
  | --- | --- | --- |
  | Today, unique sentences | 22.7% | at least 45% |
  | Em-dashes per view, every surface | up to 15 (Your chart) | 0 |
  | Sentences said twice on one view | 14 (People) | 0 everywhere |
  | Phrase pairs within one view | 373 topic pages, 3 Your chart, 2 People | 0 outside title echoes |
  | Ahead, unique sentences | 36.3% | at least 60% |

  - Acceptance: `pnpm copy-audit --out` committed beside the baseline as `after.json`, with a before/after table in this ticket.
- **R9. The owner reads it before it ships.** A rendered sample for Fixtures A and D: 7 days of Today, the topic pages those days open, Ahead's 12 months of 2027, and People for two pairings, in reading order. `pnpm copy-audit --sample <fixture>` prints it from the same collector the audit uses. The owner signs off before deploy.
  - Acceptance: owner sign-off recorded here.
- **R10. Ships once.** Every reading changes on deploy, so the new voice arrives in one step, not bank by bank.
  - Acceptance: one production deploy at the end; live-app check of Today in all three looks × both themes, a topic page, Ahead and People.

### Word variety

Added 2026-10-23 at the owner's request after reading the R9 sample ("there could be more variety of word choices… mix and match different words to create different sentences so it's not tied as a sentence"). The sentence tests pass, but the same few words carry the sample. Counted over the R9 sample (7 days of Today with their topic pages, Ahead's 12 months, two People pairings), Fixture A / Fixture D: "this month" 32 / 35 (Ahead, about three a month), "plan" or "plans" 42 / 51, "small" 24 / 27, "same" 21 / 23, "tends to" or "tend to" 22 / 23, "something" 15 / 25, "things" 17 / 23, "early" 20 / 11, "rather than" 8 / 7. On Today alone, Fixture A says "work" 17 times in a week and Fixture D says "day" 12 times.

- **R11. Lines are built from interchangeable parts.** A rotating line may hold choice groups, written `[part|part|part]` inside the bank string, so one entry reads several ways. Each time the line comes back for a chart, it comes back in its next combination, and every combination is used before one repeats. A sentence holds at most 3 groups and a group at most 4 parts; every part fits the sentence around it. Topic-page explanations stay fixed (out of scope), so their banks hold no groups.
  - Acceptance: the determinism test, extended (same chart and date give the same text, whatever order days are viewed in); every combination of every bank line passes `plain-writing.test.ts` and `voice.test.ts` and an "a"/"an" check; no `[` or `|` reaches a rendered screen; a test that a line's combinations all appear before any repeats.
- **R12. No word carries the screen.** Over every fixture and 90 days, no content word or two-word phrase appears more than its cap per 7 days of Today, per 12 months of Ahead, or per screen on topic pages, People and the chart page. VOICE.md lists the overused words with plain alternatives. Name words (the part of life a line is about: work, family, home, plan; an element, animal sign or palace) get twice the cap. The fixed lines sit out: the hours card's times, star titles (on Today and on topic pages), and a topic page's old name, name origin, sore spot and closing. The rotating best-hour note counts.
  - Acceptance: `presentation/test/word-variety.test.ts` passes with no exceptions; caps and the exempt list approved by the owner before the rewrite starts.

R9 applies again: a fresh sample with R11 and R12 in, read and signed off before the one deploy (R10).

### Before and after (R8, R12), 2026-10-27

`after.json` beside this ticket, regenerated after phase 4; before is [M20-02's baseline](../../m20-clarity/02-copy-audit-baseline/baseline.json). Fixture A unless noted.

| Target | Before | After phase 3 (2026-10-23) | After phase 4 | Met |
| --- | --- | --- | --- | --- |
| Today, unique sentences ≥ 45% | 22.7% | 37.7% | 49.0% (49.0–51.5% across fixtures) | Yes |
| Em-dashes per view, every surface: 0 | up to 15 (Your chart) | 0 | 0 | Yes |
| Sentences said twice on one view: 0 | 14 (People) | 0 | 0 | Yes |
| Phrase pairs within one view, outside title echoes: 0 | 373 topic pages, 3 Your chart, 2 People | 0 | 0 (`screen-repeats.test.ts`). The audit counts 105 on Fixture A's topic pages (500 over all fixtures), every one a star or card title echoing its own line, or the hours card's times | Yes |
| Ahead, unique sentences ≥ 60% | 36.3% | 58.2% | 64.6% (62.4–68.8% across fixtures) | Yes |
| Words over their cap (R12): 0 | — | 78 | 0 (`word-variety.test.ts`) | Yes |

Every window target holds in tests: no Today line back within 14 days, no Ahead line twice within 12 months or a decade's years, no screen saying a thing twice, no rule broken on any rendered line or any wording of a bank line, no word over its cap. Choice groups lifted both ratios past their targets: a returning line comes back in other words. Star titles and the hours times still repeat by design ("Drawn to the big questions" 30 times in Fixture A's 90 days).

## Out of scope

- **Topic pages stay reference pages.** Their explanations don't rotate: a page should read the same each time a reader comes back to learn what the sign means. They're in scope for the plain-writing rules and for the within-page repeat targets.
- **The sore-spot block on every topic page.** It is the same for a chart on every page (one line appears 795 times across the fixtures' pages). That's structure (M20-26), not wording; worth its own ticket if the owner wants it changed.
- **First-week notes, the streak line, Find a day's verdict, fixed UI labels.** These are covered by the plain-writing test as bank entries (R2), but not by rotation or window targets, for the reasons in M20-02.
- **Layout or structure changes** to any screen. Text only, so no mockup round.
- **A human copywriter.** M20-14 asked; see the open questions.

## Open questions

- [x] **One ticket or three?** Recommendation: one ticket, worked in three phases (rules → rotation → rewrite), deployed once. The phases can't ship separately in a useful way: the rules alone are a failing worklist, rotation without bigger pools changes little, and the rewrite needs both. Each phase gets its own commits and its own review. The alternative is three tickets (11 rules, 16 rotation, 17 rewrite) behind one release. Answer (owner, 2026-10-20): one ticket, three phases, one deploy.
- [x] **Approve the R1 rule list, or edit it.** In particular, rule 1 bans em-dashes outright, where M20-13 proposed at most one per line. They're already gone everywhere except the chart page, so a ban costs little and is simpler to check. Answer (owner, 2026-10-20): approved as written, em-dashes banned outright.
- [x] **Window: 14 days?** M20-12 proposed 21. 14 covers two weeks of daily opens. 21 needs roughly half as many entries again in every pool. Recommendation: 14. Answer (owner, 2026-10-20): 14 days.
- [x] **Card titles rotate with their lines?** Recommendation: yes, as [title, line] pairs (interaction cards already work this way), except star titles and the hours card (R3). Answer (owner, 2026-10-20): yes, except star titles and the hours card.
- [x] **Who writes?** M20-14 recommended a human copywriter for the core banks. Since then you've chosen the content-writer agent's draft over copy written in the main conversation (M24-10) and have no budget for paid services yet. Recommendation: content-writer drafts every bank, and you read the R9 sample before ship. A copywriter can still take one pass later over the banks the sample flags. Answer (owner, 2026-10-20): the content-writer agent drafts, the owner reads the R9 sample.
- [x] **Approve the R8 targets**, or set others. Answer (owner, 2026-10-20): approved as proposed.
- [x] **Add word variety to this ticket?** Answer (owner, 2026-10-23): yes, as R11 and R12, deploy held until they're done; lines may mix and match parts so they aren't tied to one sentence.
- [x] **Approve the R11 design** (`design.md`, Phase 4): choice groups inside bank strings, at most 3 per sentence and 4 parts per group, stepped so a returning line comes back in its next combination. Recommendation: approve. Answer (owner, 2026-10-27): approved.
- [x] **R12 caps and exempt list.** Answer (owner, 2026-10-27): approved as proposed. Measured 2026-10-27 (task 15) over every fixture, 90 days of Today, 24 months and a decade of years on Ahead, every topic page, People pairing, You and chart page. A "name word" (the part of life a line is about: work, family, home, plan; an element, animal sign or palace) gets twice the cap. Proposed:

  | Window | Cap | Name words | Over the cap now | Worst now |
  | --- | --- | --- | --- | --- |
  | Today, any 7 days | 7 (about once a day) | 14 | 22 | "today" 32, "day" 20, "thing" 20, "work" 18, "good" 12, "keep" 12 |
  | Ahead, any 12 months | 6 (every other month) | 12 | 16 | "this month" 36, "plan" 20, "work" 19, "tend" 12, "small" 12 |
  | Ahead, a decade's years | 5 | 10 | 13 | "this year" 30, "plan" 17, "work" 16, "tend" 13 |
  | One screen: a decade, topic page, People, You, chart | 3 | 6 | 27 | "plan" 7 and "day" 6 on a topic page, "tend" 6 on the chart page |

  Counting: words with a plain "-s" folded off ("plans" is "plan") and two-word phrases; function words skipped; the fixed lines (hours times, star titles, a topic page's old name, name origin, sore spot and closing) sit out. 78 words and phrases over in all: the rewrite's worklist.
- [x] **The two R8 ratios** (Today 37.7%, Ahead 58.2%). Choice groups count toward unique sentences, so both should rise; decide at the new R9 sign-off. Resolved 2026-10-27: both met after phase 4 (Today 49.1%, Ahead 62.3%).

Raised during the build (2026-10-20, phase 1 review):

- [x] **Does "X, not Y" count as a contrast construction?** For example "a hinge, not a wound", "light, not lacking", "a season, not a verdict". It shows up about 49 times in the reference copy and the chart banks. The approved rule 3 doesn't list it, so the test doesn't flag it. Recommendation: yes. It's the most common version of the habit M20-13 described. If you agree, rule 3 gains it and those lines join the worklist. Answer (owner, 2026-10-23): yes; rule 3 gains it.
- [x] **The chart page prints each star's gloss twice** (live, see worklist.md). M20-01 covers this class of bug. Recommendation: fix it inside this ticket when `stars.ts` is rewritten in phase 3, and note it on M20-01, rather than running M20-01 separately. Answer (owner, 2026-10-23): yes, fixed here in phase 3, noted on M20-01.


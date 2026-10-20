# Copy audit baseline

Status: done · Milestone: M20 · Ticket: 02 · Approved by the owner 2026-10-20

> Revised 2026-10-20 after the reshape shipped. The 2026-09-29 draft measured the old Today (dos, donts, lines, guidance), which no longer exists, and only Today. The M20 README had already widened the ticket to every screen on 2026-10-10. With the reshape live, the "before" this baseline records is the copy [M24-11](../../m24-reshape/README.md) (Words) starts from, not the pre-reshape app.

## Problem

Repetition and wordiness were only visible because someone happened to read 60 days in a row (M20 README, "Evidence"). Nothing measures them now. M20-21's 90-day tests guard the Today first screen (≤ 70 words, no 4-word phrase back within 7 days), but nothing measures the topic cards, "What the day suits", topic pages, Ahead, You or People. A copy change to any of those can make things worse and nobody would notice. M24-11 (no-repeat rotation, voice lint, copy rewrite over every screen) needs a number to beat on every screen, and that number doesn't exist yet.

## Goal

One command that measures how every screen reads, with a committed baseline that M24-11 and later copy tickets are judged against.

## Requirements

- **R1. One command, every screen.** `pnpm copy-audit` renders the copy of every screen through the real view-models for the five reading fixtures (A, unknown time, B, C, D) and measures it, from a fixed start date of 2026-10-20 (never the clock):
  - **Today**, 90 consecutive days: headline, body, agency, each card's title, line and note, the "What the day suits" heading, the Watch reason and Today's colour line. (The colour line was added during the build, 2026-10-20: the live-app spot check found it on screen but missing from this list. It's generated copy, so it falls within the approved goal of covering every screen.)
  - **Topic pages**, every topic that one of those 90 days puts on screen, rendered for that day: every text field on the page.
  - **Ahead**: every month of 2026 and 2027, every year of the current decade, every decade.
  - **You**: once per fixture.
  - **Your chart** (the chart page behind You): every section of the natal reading, once per fixture. Added during the build, 2026-10-20, after review found the page unmeasured.
  - **People**: each fixture compared with each of the others.
  - Acceptance: every surface above shows up in the report; a slot with no text on a given view is skipped, not counted as empty.
- **R2. The same metrics on every surface**, overall and per slot (e.g. Today's headline, a topic page's "how"):
  - unique-sentence ratio
  - the 25 most repeated sentences, with counts
  - words per view (min / average / max), where a view is one day's Today, one topic page, one Ahead period, one You screen, one chart page or one People screen
  - em-dashes per view (average, max)
  - within-view repeats: pairs of different sentences on the same view that share a 4-word phrase, counted the way M20-21's tests count them
  - within-view duplicates: the same sentence shown more than once on one view (added during the build: review found identical sentences being counted as phrase pairs, so they are now counted separately)
  - Acceptance: a unit test checks each metric against hand-counted sample text.
- **R3. Readable report, JSON output, deterministic.** It prints a short report per surface. `--out <file>` writes the full JSON.
  - Acceptance: runs in under 10 seconds; two runs write byte-identical JSON.
- **R4. Measures the real pipeline.** The audit calls the same view-models the screens render from (`todayScreenModel`, `todayColourFor`, `topicPageFor`, Ahead's period views, `youScreenFor`, `youElementsFor`, `youColoursFor`, `natalReadingFor`, `pairScreenFor`) and turns token runs into text with the same `plainGloss` the app uses.
  - Acceptance: the audit contains no reading selection or content logic; it collects text and counts it.
- **R5. Baseline committed and summarised.** The JSON is committed as `baseline.json` in this ticket folder, and the table below is filled in from it.
  - Acceptance: file exists; table filled.

## Out of scope

- Pass/fail thresholds. M24-11 sets its own targets against this baseline; a target that should hold permanently becomes a unit test there.
- First-week notes ([M24-10](../../m24-reshape/10-first-week/requirements.md)). Which note shows depends on the reader's visit history, not on the chart and date, and M24-10's tests already cover every step.
- Today's streak line and Find a day's verdict. Like first-week notes, they depend on what the reader has done or asked (their streak count, the date and activity they picked), not on the chart and date. Each is one line from a small bank. M24-11's voice lint covers them as bank entries.
- Fixed UI strings (button labels, section titles, Settings, onboarding). These are a handful of lines written once, not generated combinations, so they can't repeat across days.
- A compare-to-baseline mode. M24-11 can add one if it needs it.

## Baseline

Measured 2026-10-20 (commit of this ticket), `pnpm copy-audit`. Full numbers per slot and fixture in [`baseline.json`](baseline.json). Fixture A first, then the range of the unique-sentence ratio across all five fixtures.

| Surface (views for A) | Unique sentences (A) | Words/view avg (A) | Em-dashes/view avg (A) | Phrase pairs within a view (A) | Duplicates within a view (A) | Unique sentences, all fixtures |
| --- | --- | --- | --- | --- | --- | --- |
| Today (90) | 412 of 1,817 (22.7%) | 138.3 | 0 | 0 | 0 | 22.7–24.6% |
| Topic pages (594) | 554 of 9,928 (5.6%) | 159.2 | 0 | 373 | 0 | 5.4–5.8% |
| Ahead (42) | 124 of 342 (36.3%) | 66.8 | 0 | 0 | 0 | 36.2–43.0% |
| You (1) | 22 of 22 (100%) | 190 | 1 | 1 | 0 | 100% |
| Your chart (1) | 28 of 28 (100%) | 455 | 15 | 3 | 0 | 100% |
| People (4) | 35 of 86 (40.7%) | 159.3 | 0 | 2 | 14 | 35.6–42.5% |

What it shows, for M24-11 to work from:

- **Today's first screen holds up; the cards don't.** Headline, body and agency are 24–27% unique, with no repeats inside a day (M20-21's guards). Card titles, card lines, the best-hour note and the "What the day suits" heading are each about 3% unique: the top card title ("Drawn to the big questions") appears 104 times across the 450 Today views (90 days × 5 fixtures), and the best-hour note 113 times. The colour line is 1.8% unique ("A little goes far: a scarf, a mug, a pen." ×234).
- **Topic pages are almost entirely fixed text.** 1.4% unique across all fixtures. The closing line is on every page by design (VOICE.md), and the name origin is fixed per topic, but "how", "work" and the sore-spot body also barely change (one sore-spot line appears 795 times across the five fixtures' pages). 373 sentence pairs on Fixture A's pages share a 4-word phrase, e.g. "Your birth chart runs better with more Fire…" beside "Your birth chart runs better with more of some…".
- **People says the same sentence twice on one screen.** Fixture A's four pairings show 14 duplicate sentences. "Together you move faster, and faster still with one more on board." appears 52 times across the 20 pairings, up to 3 times on one screen.
- **The chart page is where the em-dashes are.** 15 on Fixture A's page (17.6 per page on average across fixtures), most in the stars and elements sections. Everywhere else they are gone except one on Fixture A's You screen (two across all five fixtures). The 2026-09-29 audit counted 685 in 60 days of the old Today.

## Open questions

- [x] Start date 2026-10-20 and the Ahead span (2026–2027 months, current decade's years, all decades): approve, or name others. — Approved as written (owner, 2026-10-20).
- [x] First-week notes and fixed UI strings left out (reasons above): agree? — Agreed (owner, 2026-10-20).

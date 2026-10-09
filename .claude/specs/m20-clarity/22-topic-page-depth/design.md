# Design — Topic pages say enough to be worth the tap

## Approach

There are four layers, each in the package it belongs to. The content is written source first: classical passage → translation → plain lines, with a variant for each combination the source distinguishes (R12, R13).

0. **Sourcing workflow (per topic family, before any wording).**
   1. Find the passage on the topic in the family's source work, in a public-domain full text that allows reading. Record the URL.
   2. Quote it verbatim and translate it into English.
   3. Note which chart conditions the passage distinguishes (strong/weak self, helps or strains the chart, which pillar).
   4. Write the plain lines for each condition. Log whatever is dropped or reframed.
   5. A second reader checks the translations (R13, open question).

   The classics read birth charts, years and luck periods, not single days. Applying a passage to one day is this app's extension, and the source comment says so. Worked example (the reference entry for every family), *Zi Ping Zhen Quan* ch. 33 論財, from [東里書齋](https://www.donglishuzhai.net/chapter/3746.html):

   ```ts
   "Direct Wealth": {
     source: {
       work: "Zi Ping Zhen Quan (Shen Xiaozhan), ch. 33 論財",
       url: "https://www.donglishuzhai.net/chapter/3746.html",
       passages: [
         { quote: "財爲我尅，使用之物也，以能生官，所以爲美。", translation: "Wealth is what I control, the things I put to use; it is good because it gives rise to standing.", supports: "how: effort earns standing" },
         { quote: "財喜根深，不宜太露", translation: "Wealth likes deep roots and should not be too exposed.", supports: "how: rooted, unshowy work" },
         { quote: "有財旺生官者，身强而不透傷官，不混七煞，貴格也。", translation: "Strong wealth feeding standing, with a strong self, is a noble pattern.", supports: "strong variant" },
         { quote: "蓋孤財不貴，佩印幫身，即以取貴", translation: "Wealth alone isn't noble; carrying support to back the self brings nobility.", supports: "weak variant: lean on help" },
       ],
       dropped: ["爲妻妾 (wealth as wives, male charts): gendered", "財 as money: VOICE rule 12, read as effort and what you handle"],
     },
     forYou: { strong: "…", weak: "…" },
     how: { strong: […], weak: […] },
     …
   }
   ```


1. **Content banks (packages/content).** The writing goes in banks, one entry per topic key. Today's single `how`/`work` strings become structured entries:

   ```ts
   interface TopicDepth {
     how: readonly string[];          // 2–3 paragraphs (R2)
     where: Record<"work" | "people" | "home", string>;  // R3
     goodFor: readonly string[];      // 2–3 (R4)
     holdOff: readonly string[];      // 1–2 (R4)
     work: readonly [string, string, string];  // R5
   }
   ```

   - Ten-gods carry `forYou`, `how`, `goodFor` and `holdOff` as `{ strong, weak }` pairs (R6, R12).
   - Every entry has a `source: TopicSource` (R13). It's typed in `types.ts` and never passed into a `TokenLine`.
   - Stages get `before`/`after` phrasing for the arc sentence (R6).
   - Stars get `{ paragraph, step }` (R9).
   - Sign links reuse the `read-more.ts` dives as raw material, rewritten to the M20-21 voice (no em-dash runs, everyday words). They get per-area `where` lines, so the affected area can lead (R3).
   - The bank files are split by topic family to keep each under ~200 lines: `banks/topics/ten-gods.ts`, `elements.ts`, `stages.ts`, `stars.ts`, `interactions.ts`, `hours.ts`. `day.ts` is retired once it's empty.

2. **Page builder (packages/content `readings/topic-page.ts`).** `topicPage(topic, facts)` gains the chart facts it needs: `strength`, `element-balance` and natal `life-stage` already exist in the natal fact list. It returns an extended `TopicPage`:

   ```ts
   interface TopicPage {
     title; oldName; forYou; how; work; nameOrigin; stars;  // as today
     where: { area: string; line: TokenLine }[];             // ordered; affected area first
     goodFor: TokenLine[];
     holdOff: TokenLine[];
     visual: TopicVisual | null;                             // data only, no markup
   }
   type TopicVisual =
     | { kind: "balance"; counts: Record<Element, number>; today: Element }
     | { kind: "stage-arc"; stages: string[]; index: number }   // plain stage titles from STAGE_CARDS
     | { kind: "hours"; blocks: { startHour: number; endHour: number; mark: "easy" | "rough" | null }[] }
     | { kind: "signs"; signs: { area: LifeArea; animal: string; met: boolean }[] };
   ```

   - The R1 rule is enforced here: the builder never puts the card line into `forYou` or `how`.
   - Stage order comes from the engine's `LIFE_STAGES` table, not a new constant.
   - Hour blocks come from the engine's existing hour-block windows.

3. **Presentation (packages/presentation `topic-page.ts`).** `topicPageFor` passes the natal facts through. A new `topicRecurrences(profile, date, today, topic)` scans Today's ±30-day range with the memoised `dailyBundleFor` and returns up to three later dates carrying the key (R8). It returns ISO dates only; the view formats them.

4. **UI (apps/web `components/topic/`).** `topic-page-view.tsx` is split to stay under ~200 lines.
   - Sections in order: tagline (R15) → For you today → visual → How it tends to go → Where it shows up → Your sore spot and what eases it (R14) → Good for / Hold off on → Working with it → When it comes back → Where the name comes from → the description-not-prediction line (R15).
   - The four visuals live in `topic-visual.tsx`. They're inline SVG or CSS on existing tokens (element tints, `--ink`, `--ink-soft`), with no new colour mass; cinnabar stays seal-only.
   - Each look moves sections; it never drops one (DESIGN.md v5).

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/banks/topics/*` | New per-family bank files with `TopicDepth` entries, each with its `source`; `day.ts` emptied and removed; `suits.ts` (trial R13) folded in if kept |
| `.claude/specs/flags.md` | New "Content without a source" section (R13) |
| `packages/content/src/readings/topic-page.ts` | Builds the extended page, the visual data and the personal For you today; never echoes the card |
| `packages/content/src/types.ts` | `TopicPage` gains `tagline`, `where`, `remedy`, `goodFor`, `holdOff`, `visual`, `closing`; adds the `TopicVisual` union |
| `packages/content/test/` | Bank shape tests (R2–R5, R9), the no-echo test (R1), the length test (R10), voice on all lines (R11) |
| `packages/presentation/src/topic-page.ts` | Passes natal facts; adds `topicRecurrences` |
| `packages/presentation/test/topic-page.test.ts` | Strong vs weak For you today (R6), recurrence dates (R8), unknown-time signs (R7) |
| `apps/web/src/components/topic/` | `topic-page-view.tsx` split; new `topic-visual.tsx`, `topic-sections.tsx` |
| `apps/web/src/app/looks.css` | Section and visual styles for each look, with `[data-theme]` twins |
| `apps/web/e2e/` | Recurrence link lands on the right topic page; all sections render |

## Alternatives considered

- **Render the existing read-more dives as they are.** Lost: they only cover the five sign links, and they predate the M20-21 voice (em-dash heavy, abstract). They're raw material, not finished copy.
- **Good for / Hold off on taken from the day's activity chips.** Lost (pending the owner's answer): Today already shows them, so every topic page would repeat the same list. Topic-specific lists say something new on each page.
- **Writing only, no visuals or recurrence.** The owner chose deeper + personal (2026-10-05).
- **Keep writing without sources (options 2 and 3 alone).** Lost (owner chose 1 + 3, 2026-10-06): a practitioner review alone still leaves nothing to trace, and more combinations without sources multiply unsourced claims.
- **ctext.org as the text source.** Lost: its terms forbid scraping. Other public-domain full texts are used, with the URL recorded.
- **Generate copy at runtime with an LLM.** Ruled out by the non-negotiables: on-device, deterministic, no backend for readings.

## Writing in borrowed styles (R15)

The 2026-10-09 comparison (scratchpad `xcheck/`: Master Sean Chan, BaZi Script, fate-craft, Eastern Fate, BaZi Wealth) is a reference for **formats only**:

- Copy the shape: the length of a tagline, a Do/Hold pairing, problem then remedy, a closing disclaimer.
- Don't copy the sentence: write each line from the classical passage (R13) and the chart condition, then run the four-word overlap check against the saved excerpts before the family ships.
- Rewording a competitor's sentence (synonym swaps, reordered clauses) is still that sentence, and still off limits. If a line started from their text, it's rewritten from the source passage instead.

## Risks

- **Volume of writing.** About 10 ten-gods × 2 strengths, 10 element tones, 12 stages, 5 sign links × 4 areas, 19 stars and the hours page, each with its source. That's roughly 12–15k words of plain copy plus the source notes, and quality varies across a bank that size.
- **Translation accuracy.** Classical BaZi prose is terse, and the commentaries disagree. Mitigation: quote verbatim, translate literally first, then derive the plain line; a second reader checks each family before it ships (R13).
- **Day-scale is an extension.** The sources read natal and period pillars. Each entry's source note says the day reading is an extension, so nobody mistakes it for a direct citation. Mitigation: write one family at a time (`content-writer`), with voice tests per family. The owner reads Fixture A's week before the ticket closes.
- **Repetition across days.** One fixed entry per key means the same ten-god page reads the same every time it comes back. That's acceptable for a reference page (it's an article, not a daily line). M20-12 (no-repeat selection) can add variants later.
- **Strong/weak edge cases.** `strength.narrow` charts may read either way (Fixture A is weak by a margin of 1). Use the verdict as given; don't hedge in copy.
- **Merge into trial/reshape.** The trial branch also edits Today's components. The merge is expected to be clean because this ticket touches only `components/topic/` and the topic banks; checked in the last task.

## Verification

- `pnpm verify` green on `main`.
- E2E green: the topic-page spec, plus the existing Today specs.
- Live app (`next dev` on 3001): open every topic type for Fixture A on three dates, in all three looks, light and dark. Measure contrast on rendered text.
- Merge `main` into `trial/reshape`, run `pnpm verify` there, and deploy the preview for the owner to read on device.

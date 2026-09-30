# Design — Today reads as one written piece

This describes what shipped. Where it differs from the approved draft, the difference is called out.

## Approach

### 1. Mockups first (R8)

Five rounds on `research/composed-week.html` (https://claude.ai/artifact/3CMt1mepeFPMG1B2dUV7Lw): a composed week for Fixture A and the unknown-time fixture, three looks × two themes. v5 approved 2026-09-30. Its copy seeded the pools.

### 2. Content: compose, don't enumerate (R1–R4, R9, R10)

`dailyReading(facts, { chart, date })` in `packages/content/src/readings/daily/daily-reading.ts` returns:

```ts
interface DailyReading {
  headline: ReadingLine;
  body: ReadingLine;             // 2–3 sentences
  agency: ReadingLine;
  leadTopic: string;             // topic key: the body's "Read more"
  modifierTopic: string | null;  // "element:fire" when the element joined the body
  cards: TopicCard[];            // every other fact, plain
}
interface TopicCard { topic: string; kicker: string; titles: TokenLine[]; line: TokenLine | null }
```

- **Seed.** The daily seed is split into `{ chart, date }` (was one `seedKey` string) so each slot can step through its pool by date.
- **Lead** (`lead.ts`): `rankTransits` orders the day's transits clash → punishment → harm → combine → trine (stable by topic key; unknown interaction kinds are dropped); ties at the top are broken by the seed. No transit → the day's character (ten god) leads.
- **Modifier:** the element joins the body when it pulls against the lead (a grinding lead on a day that suits you, a helping lead on a day against your grain), and always on a quiet day. Otherwise it's a card.
- **Composition, not whole cells** (differs from draft). The body is a base (interaction × life area, or the day's character on a quiet day) plus, when there is one, the element's sentence (element × suits/against). The element sentence is said as its effect and never by name. So variety multiplies: 3 bases × 3 element sentences per situation. Pools in `banks/daily/`: `friction.ts` (clash, punishment, harm), `support.ts` (combine, trine), `quiet.ts` (10 day characters), `modifiers.ts` (5 elements × 2 tones): 3 entries per cell, 300 lines in all. `readings/daily/pools.ts` indexes them.
- **Life areas** (`life-areas.ts`): year → family, month → work, day → home, hour → plans. Palace names never reach Today.
- **`cyclePick`** (`hash.ts`): index = (hash(chart + slot) + step) mod pool size. For the first screen the step is the **visit count** of the day's situation (`seed.visit`); element sentences and cards step by day number. Ticket 12 builds on it for the other banks.
- **Visit counting** (`presentation/src/lead-visit.ts`, added after the before/after dump showed 12/60 unique headlines): a day's lead situation (`leadCellOf`) depends only on its animal sign, so which days share it repeats every 12 days (60 for a quiet day, which also depends on the stem). Within any block of that length the situation comes up the same number of times, so `block × times-per-block + rank-in-block` is a running visit count with no stored history. Costs 12 fact computations per reading (~2 ms), 60 on a quiet day. Ties between equal-strength transits are broken by the day's branch, not the date, so a branch's lead never changes between visits. Pools: 5 entries per sign-link cell, 3 per quiet cell (420 lines).
- **Cards** (`cards.ts`, wording in `banks/daily/cards.ts`): other transits (2 variants per interaction × area), element, day's character, hours, pace, small signs. Plain titles and one sentence, no system terms.
- **Topic pages** (`readings/topic-page.ts`, wording in `banks/topics/`): `topicPage(key, facts)` finds the fact under a card's key and returns title, old name once ("The old calendars call this a clash."), "For you today" (sign mechanics in plain words from `BRANCH_ANIMALS` and the life-area map), how it tends to go, working with it, where the name comes from; the small-signs page lists each star with its plain title, a line and its old name.

### 3. What the day suits (R6)

New `todaySuits(quality)` (`readings/daily/today-suits.ts`, wording in `banks/daily/suits.ts`): plain heading per day type ("A day for setting things up"), the existing chips, and one reason for the whole Watch group (a part of life still moving, or what the day type favours). `dayGuidance` is unchanged and still serves Dates and Conditions (differs from draft, which rewrote it in place).

### 4. Presentation (R4, R5)

- `todayScreenModel` exposes `reading` (new shape) and `suits`; `guidance` stays for Conditions and the activity manifest. `grainLine`, `branchByArea` and `readingSections` are gone.
- `routeWaypointsFor(facts)`: the day's two strongest transits (same ranking as the lead) plus the timed hours. Rail numbering (`waypointNumber`) is gone with the rail.
- `topicPageFor(profile, date, today, topic)`: null outside Today's ±30-day range or for a topic the day doesn't carry.

### 5. Web (R2, R4, R5, R11)

- Each look's Today: hero → headline → `ReadingBody` (body + "Read more" to the lead's page) → pull-quote agency → `TopicCards` in the look's layout (Explorer waypoints on a dashed trail, Editorial tonal rows, Instrument tiles with hours and pace side by side) → `TodaySuits` → "How this reading works" → footer.
- `TodaySuits` replaces the trail-signs card on Today: heading, Favors/Watch chips, the Watch reason, "All ten activities" disclosure (the activity manifest), "Find a day". The skyline plot above the chips is not on Today any more (not in the approved mockup); it stays on Conditions.
- Route `app/today/topic/page.tsx`: `ProfileGate` + `AppShell` + `Suspense`; `TopicPageView` reads `date` and `topic` with `useSearchParams`, stamps the date's terrain, and replaces itself with `/today/?date=…` when the page is null. "‹ Today" links back with the date.
- `use-today-screen.ts` seeds its offset from a valid `?date` (Today renders only behind ProfileGate, client-side) and keeps it in the URL with `history.replaceState` (differs from draft's `router.replace`, which would refetch the route).
- The bottom nav marks a tab active on its nested routes too, so Today stays lit on a topic page.
- Service worker (`public/sw.js`): page navigations with a query match their cached document ignoring the query and aren't cached per query, so topic pages and dated Today links work offline and don't grow the cache.
- Conditions (M20-04's decision still open) is kept working: its reading fold shows the new body and cards, its hours note reads the hours card, and `TrailSigns` loses the dos/don'ts rows.
- Removed: `reading-chapters.tsx`, `idea-cards.tsx`, `waypoint-rail.tsx`, the chapter and idea-card styles. The map's ALL DAY labels lose their rail numbers.

### 6. VOICE.md (R7)

Rules 2, 6, 11 and 12 amended, rule 13 added, calibration examples and palace note updated (commit 013d3ac).

## Dependencies

Drafted as depending on 01 and 02; neither blocks it. The daily lines 01 fixes (star, stage, officer templates) are retired here, so 01 stays for Chart and Cycles. The variety and budget checks are this ticket's own tests over the real pipeline; 02's audit script measures the result once it exists.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/readings/daily/` (new) | Lead, cards, pools index, composer, today's suits, life areas |
| `packages/content/src/readings/topic-page.ts` (new) | Topic pages |
| `packages/content/src/banks/daily/`, `banks/topics/` (new) | First-screen pools, card wording, suits wording, topic page wording |
| `packages/content/src/daily-reading.ts`; `banks/agency, dos-donts, headlines, hour-interactions, transit-interactions, transit-days, stages` | Removed; `stars.ts` keeps only the natal line; `transitWhen` removed |
| `packages/content/src/hash.ts`, `types.ts`, `index.ts`, `day-guidance.ts` | `cyclePick`, new types, exports; `buildChips` exported |
| `packages/content/test/` | New: `composed-daily`, `topic-pages`, `plain-terms`; old daily tests updated or removed |
| `packages/presentation/src/` | `reading.ts` seed, `lead-visit.ts` (new), `today-screen.ts`, `route-waypoints.ts`, `topic-page.ts` (new); `reading-sections.ts` removed |
| `packages/presentation/test/` | `today-composed` (90 days × 5 fixtures), `topic-page`; waypoint and screen tests updated; fixtures B–D |
| `apps/web/src/components/today/` | `reading-body`, `topic-cards` (new), `today-suits` (rewritten), `use-today-screen` (`?date`) |
| `apps/web/src/components/looks/*/today-*.tsx` | Composed first screen, cards, suits |
| `apps/web/src/app/today/topic/page.tsx`, `components/topic/topic-page-view.tsx`, `lib/topic-href.ts` (new) | Topic page route |
| `apps/web/src/components/conditions/conditions-view.tsx`, `trail-signs.tsx`, `map-hero.tsx`, `bottom-nav.tsx`, `app/looks.css`, `public/sw.js` | As above |
| `apps/web/e2e/` | Today, glossary, dates-guidance, conditions specs updated; `openReading` helper removed |
| `.claude/specs/foundation/VOICE.md` | Rules 2, 6, 11, 12 amended; rule 13; examples |
| `.claude/specs/decisions.md` | "Today is composed around one lead fact, in everyday words" |

`read-more.ts` and the glossary stay: Chart, Compare and Dates still open them (differs from draft, which retired `read-more.ts`).

## Alternatives considered

- **Current M20 plan (10 + 12 + 14):** budget, rotation and bigger banks over the one-line-per-fact skeleton. Lower risk, but the six fixed shapes stay, and larger pools only rotate synonyms through them. Superseded: 10 folds in here, 12 and 14 now work on this ticket's pools.
- **Whole-cell bodies (lead × area × modifier written as one piece):** reads slightly more naturally than base + element sentence, but triples the writing for the same variety. The mockup read fine composed.
- **One catch-all detail page:** built as mockup v4, rejected by the owner in favour of a page per card.
- **Generate copy with an LLM at runtime:** breaks "readings computed on-device" and determinism. Offline drafting with owner review stays open for ticket 14.

## Risks

- **Every reading changes at once.** Intended, and it ships in one release.
- **Five entries per situation is thin over months.** A situation now reads differently on every visit and cycles all five; the 7-day window holds for five fixtures over 90 days; ticket 14 grows pools further.
- **Old names are now one tap away, not on Today.** The owner asked for this; the topic pages carry them.

## Verification

- Content: `composed-daily` (lead, modifier, cards, every pool combination within budget and without shared 4-word phrases, plain-words lint), `topic-pages`, voice/coverage/determinism.
- Presentation: `today-composed` over 90 days × Fixtures A, B, C, D and unknown-time: ≤ 70 words, no first-screen 4-word phrase within 7 days (within sentences), a situation never repeats its headline on its next visit, every fact exactly once, Watch reason present and never restating the first screen; `topic-page`.
- Before/after: `research/today-60d-fixture-a-before.txt` vs `-after.txt`, Fixture A, 60 days: unique headlines 15 → 60, actions 19 → 60, bodies 60/60; first screen 44 words avg (34–55); whole screen ~128 words (was ~340).
- `pnpm verify`; E2E in every look × three browsers; live-app check of Today and a topic page in all three looks, both themes; owner reads a generated week for two fixtures.

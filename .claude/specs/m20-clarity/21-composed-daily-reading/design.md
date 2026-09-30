# Design — Today reads as one written piece

## Approach

### 1. Mockups first (R8)

Hand-compose a week of first screens + details from real facts for Fixture A and the unknown-time fixture, using the fact dump the builder will consume. Render in Explorer, Editorial and Instrument, both themes, 390×844, as one artifact. Owner picks the budget and details layout; the chosen copy becomes the first entries of each pool.

### 2. Content: compose, don't enumerate (R1–R4, R9)

`dailyReading(facts, seedKey)` returns a new shape:

```ts
interface DailyReading {
  headline: ReadingLine;
  body: ReadingLine;          // 2–3 sentences, lead (+ modifier) once
  agency: ReadingLine;
  details: DetailLabel[];     // every non-lead fact, as a label
  lead: FactRef;              // which fact the first screen owns
}
interface DetailLabel {
  runs: TokenLine;            // "Fire day · suits you"
  topic: string;              // glossary key, as today
  fact: FactRef;
  area: ReadingArea;          // for looks that group by area
}
```

- **Lead selection** reuses `INTERACTION_SEVERITY` and `chooseTransits`: first the day's own transit, then year/month themes, then the ten-god day. The modifier is the element day. It's used only when its tone disagrees with the lead (a friction lead on a day that suits you, or a support lead on a day against your grain), because that's when it changes the advice. Otherwise it goes to details.
- **Cells.** A body pool is keyed `lead-kind × natal palace × modifier` (`clash · month · suits`, `trine · year · none`, …). Each entry is written as one piece in everyday words: how the day could show up in that life area, then how to act to ease or head it off, with the modifier said as its effect. No system terms (R10); the cell key supplies the life area, so entries don't template over branches. Headline pools use the same key; agency pools key on lead-kind × palace (today they key on palace only).
- **Details** lead with a plain title and one plain sentence per fact kind (new plain maps beside the vocab glosses), with the old name as a tag and the glossary link. A "Why today" item states the lead's sign mechanics in plain words ("Today's sign, the horse, sits opposite the rat, your birth chart's sign for work"), built from `BRANCH_ANIMALS` and a palace-to-life-area map.
- New files under `packages/content/src/readings/daily/`: `compose.ts` (lead/modifier), `details.ts`, and `banks/daily-*.ts` for the cell pools. The old per-fact day banks (`transit-days.ts` element/ten-god lines, the `stars`/`stages` day lines, `dos-donts.ts`) are removed once nothing references them. Natal/horizon builders that share banks keep their parts.

### 3. Guidance (R6)

`dayGuidance` keeps chips. Its prose becomes one short reason per Watch chip, and it no longer emits the officer-restatement and element lines. The element is already in details or the body. The builder takes the lead `FactRef` so it can skip anything the first screen owns.

### 4. Presentation (R4, R5)

- `todayScreenModel` exposes `headline`, `body`, `agency`, `details`, `guidance`. `grainLine` and `readingSections` go. Looks that group by area group `details` by `area`.
- `routeWaypointsFor` takes facts directly (chosen transits + hour facts) instead of matching lines back to facts, which removes its dependency on reading lines.
- Conditions (`conditions-view.tsx`) reads the same model; if M20-04 drops Conditions first, nothing to do.

### 5. Web (R2, R4, R5, R11)

- Each look's Today renders headline → body → "Read more" (the lead's topic page) → pull-quote agency → topic cards in the look's layout, each ending "Read more" → "What the day suits".
- New route `apps/web/src/app/today/topic/page.tsx`: `ProfileGate` + `AppShell`, reads `date` and `topic` with `useSearchParams` inside `Suspense` (static export), validates both, recomputes the day's facts for that date, renders the topic page. "‹ Today" links to `/today/?date=…`.
- `use-today-screen.ts` seeds `offset` from a valid `?date` and keeps it in the URL with `router.replace`.
- The caption-to-glossary sheet leaves Today: the topic page's "Where the name comes from" replaces it. The glossary stays for Chart and Cycles. "How this reading works" stays in Today's footer.
- Specs that asserted dos/don'ts, chapters or `[data-go-deeper]` are updated.

### 5b. Topic page content (R11)

`packages/content/src/topics/`: one entry per topic key with `plainTitle`, `forYou(fact)` (plain mechanics built from `BRANCH_ANIMALS` and a palace-to-life-area map), `how[]`, `work[]`, `nameOrigin`. Interactions adapt the five `read-more.ts` dives (rewritten to R10's plain rules; `read-more.ts` retires); `nameOrigin` adapts the glossary leads. New writing: 10 ten gods, 12 stages, ~19 stars, element suits/against, hours: about 45 short entries, drafted from the mockup's samples.

### 6. VOICE.md (R7)

Amend rules 2, 6, 11 and 12, add "one idea per screen", replace calibration examples with composed ones from the approved mockup.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/daily-reading.ts` → `readings/daily/` | Composer, details, new `DailyReading` shape |
| `packages/content/src/banks/` | Cell pools (headline, body, agency); retire per-fact day lines and dos/don'ts |
| `packages/content/src/day-guidance.ts` | One reason per Watch chip; skip lead-owned facts |
| `packages/content/test/` | R1–R4, R6, R9 tests; voice tests to new rules |
| `packages/presentation/src/today-screen.ts`, `route-waypoints.ts`, `reading-sections.ts` | New model; waypoints from facts; sections removed |
| `apps/web/src/components/looks/*/today-*.tsx`, `components/today/*` | Render composed first screen, suits and the link card per look |
| `apps/web/src/app/today/topic/page.tsx` (new), per-look card components | Topic cards and topic pages (R4, R11) |
| `packages/content/src/topics/` (new); `read-more.ts` retired | Topic page content |
| `apps/web/src/components/today/use-today-screen.ts` | `?date` in and out |
| `apps/web/e2e/` | Today, glossary, dates-guidance specs updated |
| `.claude/specs/foundation/VOICE.md` | Rules 2, 6, 11, 12 amended; new rule; examples |
| `.claude/specs/decisions.md` | "Daily reading is composed around one lead fact" |

## Alternatives considered

- **Current M20 plan (10 + 12 + 14):** budget, rotation and bigger banks over the one-line-per-fact skeleton. Lower risk, but the six fixed shapes stay, and larger pools only rotate synonyms through them. Superseded: 10 folds in here, 12 and 14 now work on this ticket's pools.
- **Headline + one sentence only (Co-Star minimal):** smallest screen, but a single sentence can't name a term, translate it and turn it into advice without jargon. The mockup can still pick this if the budget comes in lower.
- **Generate copy with an LLM at runtime:** breaks "readings computed on-device" and determinism. Offline drafting with owner review stays open for ticket 14.

## Risks

- **Every reading changes at once.** Intended, and it ships in one release, not piecemeal.
- **Cell count.** 5 interactions × 4 palaces × 3 modifier states = 60 body cells, plus ten-god leads. ≥ 3 entries each is about 180+ short pieces of writing. Mitigation: cells share a template skeleton per interaction, so the palace and modifier supply clauses, not whole new pieces. The mockup week tests whether that still reads as written.
- **Lost facts.** A fact that used to be prose becomes a label, and the owner may miss the prose for some kinds (the stage line, say). R5's test proves nothing vanishes; the mockup shows what the label version feels like.
- **Tickets 12/14 rebased.** Their bank lists come from this ticket's cells.

## Verification

- Content and presentation tests for R1–R6, R9 over 90 days × Fixtures A–D.
- Before/after: rerun the 60-day dump; compare with `research/today-60d-fixture-a-before.txt`, words/day and repeated openings. Copy-audit (02) against its baseline once it exists.
- `pnpm verify`; full E2E in every look × theme; live-app check of Today in all three looks, both themes; owner reads a generated week for two fixtures.

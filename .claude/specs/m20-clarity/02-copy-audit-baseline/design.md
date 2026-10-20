# Design — Copy audit baseline

## Approach

A Node script in `packages/presentation/scripts/`, run with `tsx`. It's built from three small parts so each stays under ~200 lines and the counting can be tested on its own:

| File | Responsibility |
| --- | --- |
| `scripts/copy-audit/surfaces.ts` | Calls the view-models and returns a `Surfaces` record: per surface, every view as `{ fixture, key, slots: { slot, text }[] }`. Tokens become text through `plainGloss`. This file only collects; it holds no content logic (R4). |
| `scripts/copy-audit/metrics.ts` | Pure functions over those views: sentence split, unique ratio, top repeats, words, em-dashes, within-view 4-gram pairs (different sentences only) and within-view duplicates (the same sentence again on one view) (R2). Ties in the repeat list sort in code-point order, not `localeCompare`, so output doesn't depend on the machine's locale. The 4-gram rule matches `test/today-composed.test.ts` (lower-case, strip punctuation, within sentences only). |
| `scripts/copy-audit/report.ts` | Turns the metrics into the printed report and the JSON object (R3). Writes with `process.stdout.write`, because the package's lint bans `console`. |
| `scripts/copy-audit.ts` | Entry point: parses `--out`, runs the three parts above, writes the file. |

Inputs per surface (R1), all from `test/fixtures.ts` `READING_FIXTURES` and a fixed `START = "2026-10-20"`:

- **Today:** `todayScreenModel(profile, date, date)` for 90 days. Slots: `reading.headline`, `reading.body`, `reading.agency`, `card.titles[]`, `card.line`, `card.note`, `suits.heading`, `suits.watchReason`, and `todayColourFor(profile, date).line` (Today's colour has its own view-model; added after the spot check found it on screen).
- **Topic pages:** for each Today view, `topicPageFor(profile, date, seenFrom, topic)` for the lead, the modifier and every card topic (a topic Today shows without a page throws, rather than quietly shrinking the surface), where `seenFrom` is `date` minus `TODAY_RANGE_DAYS`. Seen from the start of Today's range, the page is still in range and its text is the same, but its "comes back on" dates have no later days to scan. Those dates aren't text, and content passes them through untouched. With `todayISO = date`, each page scanned up to 30 days of full readings, about 12 ms a page, and the run took 50 s. With `seenFrom` it takes 5 s, and the JSON is byte-identical to the 50 s run (checked 2026-10-20). Slots: every `TokenLine` field (`title`, `tagline`, `oldName`, `forYou`, `how[]`, `goodFor[]`, `holdOff[]`, `work[]`, `where[]` lines, `sore`, `nameOrigin`, `stars[]`, `closing`).
- **Ahead:** `monthView` for each month of 2026 and 2027, `yearView` for each year of the decade that contains 2026 (`decadesOf` → `yearsOfDecade`), `decadeView` for every decade. Slots: the `PlainReading` fields.
- **You:** `youScreenFor(profile)` (lead and cards), `youElementsFor` (helps, wears, ease) and `youColoursFor` (where, fix). **Your chart:** `natalReadingFor(profile)`, every line of every section, slotted by section key. **People:** `pairScreenFor(profile, other.birth)` for every ordered pair of different fixtures.

`pnpm copy-audit` at the root runs `pnpm --filter @daymaster/presentation copy-audit`, which runs `tsx scripts/copy-audit.ts`. It is not part of `pnpm verify` because it measures and doesn't gate. The scripts are still typechecked and linted by `verify`: `scripts` is added to the package's tsconfig `include`.

A unit test, `test/copy-audit-metrics.test.ts`, checks `metrics.ts` against hand-counted sample text. It tests the counting, not the copy, so it belongs in `pnpm test`.

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/scripts/copy-audit.ts` and `scripts/copy-audit/*` | New |
| `packages/presentation/test/copy-audit-metrics.test.ts` | New |
| `packages/presentation/package.json` | `copy-audit` script; `tsx` devDependency (same `^4.19.2` the engine already uses, already in the lockfile) |
| `packages/presentation/tsconfig.json` | `include` gains `scripts` |
| root `package.json` | `copy-audit` script |
| this ticket | `baseline.json`, summary table |

`test/fixtures.ts` needs no change: Fixtures B–D landed with M20-21.

## Alternatives considered

- **A vitest file that writes the report.** Mixes measuring with testing and runs on every `pnpm test` (the 2026-09-29 draft rejected it too).
- **Running vitest as a runner** (`vitest run copy-audit`), which avoids adding tsx. It still needs a separate config to stay out of `pnpm test`, and the output goes through vitest's reporter. tsx is already used in the monorepo.
- **Rendering the built app and scraping the DOM.** Closer to what the reader sees, but it needs a browser, takes minutes rather than seconds, and depends on the look. The view-models are the single source every look renders from (DESIGN.md: a look moves content, never drops it), so measuring them covers all three looks.

## Risks

- `tsx` has to resolve the engine's `createRequire` load of astronomy-engine and its `.js` → `.ts` import specifiers. The engine's own scripts already run under tsx, so this should work. If it doesn't, the vitest-runner alternative is the fallback.
- Topic pages dominate the run time (2,979 pages). Deduping wouldn't have helped, because each (fixture, date, topic) is rendered once already. The cost was the recurrence scan, handled with `seenFrom` above. If topic-page wording ever starts to depend on the reader's today, `seenFrom` has to go. The byte-identical check against `todayISO = date` is how to tell.
- Sentence splitting on `.!?` breaks on abbreviations. The copy contains almost none, and the same rule is applied to every run, so comparisons between runs stay fair.

## Verification

- `pnpm verify` green, including the metrics unit test.
- Run `pnpm copy-audit --out` twice: the JSON is byte-identical (R3), and each run finishes in under 10 s.
- Spot check against the running app (dev server, Fixture A, clock pinned to 2026-10-20 09:00 Asia/Jakarta, Instrument look). Every line the audit collects for that day's Today and its lead topic page is on the page. Every line on the page that the audit skips is a fixed label, a chip or part of a drawing. This replaced the planned hand count: it checks the same thing, line by line, in both directions.
- The 2026-09-29 cross-check is dropped. That audit measured the pre-reshape Today, which no longer exists.

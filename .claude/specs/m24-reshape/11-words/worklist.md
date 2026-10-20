# Worklist — plain writing

The first run of `packages/content/test/plain-writing.test.ts` (2026-10-20): 1,961 lines checked, 416 failures. The full list, line by line, is `packages/content/test/plain-writing-known.ts`. It may only shrink: phase 3 rewrites each line and removes it.

| Source | Em-dash | Long sentence | Contrast | Stock phrase | Total |
| --- | --- | --- | --- | --- | --- |
| `function banks` | 77 | 34 | 4 | 4 | 119 |
| `glossary.ts` | 76 | 9 | 0 | 29 | 114 |
| `rendered: chart page` | 40 | 10 | 0 | 1 | 51 |
| `vocab.ts` | 41 | 0 | 0 | 1 | 42 |
| `banks/elements.ts` | 24 | 1 | 0 | 0 | 25 |
| `read-more.ts` | 12 | 3 | 0 | 0 | 15 |
| `banks/day-guidance.ts` | 11 | 0 | 0 | 0 | 11 |
| `banks/natal-interactions.ts` | 9 | 0 | 0 | 2 | 11 |
| `banks/horizons.ts` | 10 | 0 | 0 | 0 | 10 |
| `banks/stars.ts` | 7 | 0 | 1 | 1 | 9 |
| `banks/day-master.ts` | 5 | 0 | 0 | 0 | 5 |
| `banks/topics/depth.ts` | 0 | 3 | 0 | 0 | 3 |
| `marks.ts` | 0 | 1 | 0 | 0 | 1 |
| **Total** | 312 | 61 | 5 | 38 | 416 |

- **function banks**: mostly `natalStarLine`, rendered for every star in every palace (21 × 4). It also prints each star's gloss twice, live on the chart page ("The an empty seat at the table — … sits in your roots — an empty seat at the table — …"). That's the bug class [M20-01](../../m20-clarity/01-fix-duplicated-glosses/requirements.md) covers.
- **rendered: chart page**: the strength tally and composed star and interaction lines in `natal-reading.ts`.
- `glossary.ts` builds many entries from `vocab.ts` glosses and shared frames (one frame per officer, stage and star), so fixing a gloss or a frame clears several lines at once.
- `banks/compare.ts` is left out: since M24-12 its lines reach no screen. Its removal is [M24-16](../16-remove-compare-reading/requirements.md) (draft).
- The pool worklist (R4) is added here in phase 2.

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

## Pools (R4, R5)

`packages/presentation/test/pool-minimums.test.ts` (2026-10-23) runs over the five reading fixtures plus sixty pool charts (births 373 days apart from 1950: every day pillar, a spread of years, every two-hour block). The fixtures alone missed short pools ordinary charts hit. Today: 170 rotating slots over a year, of which 63 repeat a line within 14 days as they stand. Ahead: 138 slots over ten years of months and a century of years, of which 56 repeat within 12 consecutive months or a decade's years. Known list: `packages/presentation/test/pool-minimums-known.ts`. Each pool below has to reach the size shown.

### Today

| Slot | Lines now | Lines needed |
| --- | --- | --- |
| `best-hour:easy` | 1 | 10 |
| `best-hour:window` | 1 | 14 |
| `card:element:earth:against` | 1 | 4 |
| `card:element:earth:suits` | 1 | 3 |
| `card:element:fire:against` | 1 | 4 |
| `card:element:fire:suits` | 1 | 3 |
| `card:element:metal:against` | 1 | 4 |
| `card:element:metal:suits` | 1 | 3 |
| `card:element:water:against` | 1 | 4 |
| `card:element:water:suits` | 1 | 3 |
| `card:element:wood:against` | 1 | 4 |
| `card:element:wood:suits` | 1 | 3 |
| `card:interaction:trine:day` | 2 | 3 |
| `card:interaction:trine:hour` | 2 | 3 |
| `card:interaction:trine:month` | 2 | 3 |
| `card:interaction:trine:year` | 2 | 3 |
| `card:stage:Bath` | 1 | 2 |
| `card:stage:Coming of Age` | 1 | 2 |
| `card:stage:Conception` | 1 | 2 |
| `card:stage:Decline` | 1 | 2 |
| `card:stage:Growth` | 1 | 2 |
| `card:stage:Illness` | 1 | 2 |
| `card:stage:Nurture` | 1 | 2 |
| `card:stage:Peak` | 1 | 2 |
| `card:stage:Severance` | 1 | 2 |
| `card:stage:Stillness` | 1 | 2 |
| `card:stage:Storage` | 1 | 2 |
| `card:stage:Taking Office` | 1 | 2 |
| `card:ten-god:Direct Officer` | 1 | 2 |
| `card:ten-god:Direct Resource` | 1 | 2 |
| `card:ten-god:Direct Wealth` | 1 | 2 |
| `card:ten-god:Eating God` | 1 | 2 |
| `card:ten-god:Friend` | 1 | 2 |
| `card:ten-god:Hurting Officer` | 1 | 2 |
| `card:ten-god:Indirect Resource` | 1 | 2 |
| `card:ten-god:Indirect Wealth` | 1 | 2 |
| `card:ten-god:Rob Wealth` | 1 | 2 |
| `card:ten-god:Seven Killings` | 1 | 2 |
| `colour-line:lean` | 1 | 10 |
| `colour-line:steady` | 1 | 10 |
| `modifier:earth:against` | 3 | 4 |
| `modifier:earth:suits` | 3 | 4 |
| `modifier:fire:against` | 3 | 4 |
| `modifier:fire:suits` | 3 | 4 |
| `modifier:metal:against` | 3 | 4 |
| `modifier:metal:suits` | 3 | 4 |
| `modifier:water:suits` | 3 | 4 |
| `modifier:wood:against` | 3 | 4 |
| `modifier:wood:suits` | 3 | 4 |
| `suits-heading:bi` | 1 | 5 |
| `suits-heading:cheng` | 1 | 5 |
| `suits-heading:chu` | 1 | 5 |
| `suits-heading:ding` | 1 | 5 |
| `suits-heading:jian` | 1 | 5 |
| `suits-heading:kai` | 1 | 5 |
| `suits-heading:man` | 1 | 5 |
| `suits-heading:ping` | 1 | 5 |
| `suits-heading:po` | 1 | 5 |
| `suits-heading:shou` | 1 | 5 |
| `suits-heading:wei` | 1 | 5 |
| `suits-heading:zhi` | 1 | 5 |
| `watch:officer` | 1 | 14 |
| `watch:unsettled` | 1 | 14 |

- The colour line, best-hour note and Watch reason come up nearly every day, so their pools are the biggest. The suits heading and Watch reason step by day number (their day type follows the solar month), which pushes the Watch reason's need up to the whole window.
- The slot counts a template as one line even when what's filled in differs ("5–7 pm suits you best." and "1–3 pm suits you best." share a slot). That's the strict reading of the target. If those pools get too big to write well, splitting the slot by its filled-in value is the lever. The rendered test (R6) checks actual sentences.

### Ahead

Most leads are safe, but a quiet month's lead comes back 10 months later (same character), and a few links recur within a year.

| Slot | Lines now | Lines needed |
| --- | --- | --- |
| `month:card:interaction:trine:day` | 1 | 3 |
| `month:card:interaction:trine:hour` | 1 | 3 |
| `month:card:interaction:trine:month` | 1 | 3 |
| `month:card:interaction:trine:year` | 1 | 3 |
| `month:card:ten-god:Direct Officer` | 1 | 3 |
| `month:card:ten-god:Direct Resource` | 1 | 3 |
| `month:card:ten-god:Direct Wealth` | 1 | 3 |
| `month:card:ten-god:Eating God` | 1 | 3 |
| `month:card:ten-god:Friend` | 1 | 3 |
| `month:card:ten-god:Hurting Officer` | 1 | 3 |
| `month:card:ten-god:Indirect Resource` | 1 | 3 |
| `month:card:ten-god:Indirect Wealth` | 1 | 3 |
| `month:card:ten-god:Rob Wealth` | 1 | 3 |
| `month:card:ten-god:Seven Killings` | 1 | 3 |
| `month:element:earth:against` | 1 | 4 |
| `month:element:earth:suits` | 1 | 4 |
| `month:element:fire:against` | 1 | 4 |
| `month:element:fire:suits` | 1 | 4 |
| `month:element:metal:against` | 1 | 4 |
| `month:element:metal:suits` | 1 | 4 |
| `month:element:water:against` | 1 | 4 |
| `month:element:water:suits` | 1 | 4 |
| `month:element:wood:against` | 1 | 4 |
| `month:element:wood:suits` | 1 | 4 |
| `month:lead:quiet:Direct Officer` | 1 | 3 |
| `month:lead:quiet:Direct Resource` | 1 | 3 |
| `month:lead:quiet:Direct Wealth` | 1 | 3 |
| `month:lead:quiet:Eating God` | 1 | 3 |
| `month:lead:quiet:Friend` | 1 | 3 |
| `month:lead:quiet:Hurting Officer` | 1 | 3 |
| `month:lead:quiet:Indirect Resource` | 1 | 3 |
| `month:lead:quiet:Indirect Wealth` | 1 | 3 |
| `month:lead:quiet:Rob Wealth` | 1 | 3 |
| `month:lead:quiet:Seven Killings` | 1 | 3 |
| `month:lead:trine:family` | 1 | 3 |
| `month:lead:trine:home` | 1 | 3 |
| `month:lead:trine:plans` | 1 | 3 |
| `month:lead:trine:work` | 1 | 3 |
| `year:card:interaction:trine:day` | 1 | 3 |
| `year:card:interaction:trine:hour` | 1 | 3 |
| `year:card:interaction:trine:month` | 1 | 3 |
| `year:card:interaction:trine:year` | 1 | 3 |
| `year:element:earth:against` | 1 | 2 |
| `year:element:earth:suits` | 1 | 2 |
| `year:element:fire:against` | 1 | 2 |
| `year:element:fire:suits` | 1 | 2 |
| `year:element:metal:against` | 1 | 2 |
| `year:element:metal:suits` | 1 | 2 |
| `year:element:water:against` | 1 | 2 |
| `year:element:water:suits` | 1 | 2 |
| `year:element:wood:against` | 1 | 2 |
| `year:element:wood:suits` | 1 | 2 |
| `year:lead:trine:family` | 1 | 3 |
| `year:lead:trine:home` | 1 | 3 |
| `year:lead:trine:plans` | 1 | 3 |
| `year:lead:trine:work` | 1 | 3 |

### People

People has no time window: one screen never says a line twice (R5). A screen holds at most one link card of a kind per part of life, so each `PAIR_INTERACTION_CARDS` pool needs up to 4 lines (one per part of life). Each `PAIR_BRINGS` pool needs 2, for when both day-masters see the same character in each other. Today every pool has 1. Within-screen repeats are checked on rendered screens by `screen-repeats.test.ts` (task 8).

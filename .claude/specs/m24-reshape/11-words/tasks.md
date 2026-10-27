# Tasks — Words

Check a task only with a one-line evidence note.

## Phase 1 — Rules

- [x] 1. VOICE.md "Plain writing" section in the owner's wording (R1) — rules 1–5 as approved, each naming its test; five example lines that broke rule 1 rewritten
- [x] 2. `plain-writing.test.ts` over every bank line (walked from disk, rendered), every function bank and the chart page's composed lines, with the known-failures list; commit `worklist.md` (R2) — 1,961 lines, 416 known failures; a planted em-dash fails the test; review round 1 fixed (functions, rendering, chart page, tighter patterns); content 151/151

## Phase 2 — Rotation

- [x] 3. `slot-visits.ts` replaces `lead-visit.ts`; `DailySeed.visits`; tests first (R3) — `slot-visits.test.ts` (count +1 per occurrence over 150 days × 3 fixtures, order-independent) and `rotation.test.ts`; headline and agency identical to before over 450 fixture-days
- [x] 4. Today's lower half picks by visit: card pools, best-hour note, colour line, suits heading, Watch reason; interaction cards move to visits (R3) — suits heading and Watch reason step by day number (no fixed cycle, design); only interaction cards and the body's modifier sentence changed text (pools of 2–3); colour in the model; topic pages mirror the card
- [x] 5. `pool-minimums.test.ts` with its short-pool list (R4) — fixtures plus 60 pool charts (added after review): 170 Today slots, 63 short; a removed list entry fails the test; sizes in worklist.md
- [x] 6. Ahead steps by period number; People distinct lines per screen (R5) — period number instead of visits (design); 138 Ahead slots, 56 short, including every quiet-month lead; People `firstUnused` + `PAIR_BRINGS`, its within-screen check in task 8; memo and card-mirror tests added after review
- [x] 7. Phone-profile render time before and after (design, Risks) — Playwright, 4× CPU throttle, day step on Today: ~82 ms (phase 1) → ~98 ms → ~70 ms median once the block scan is memoized; copy audit 2.4 s (was 21 s before the memo)

## Phase 3 — Words

- [x] 8. `screen-repeats.test.ts` over every screen, reusing the audit collector: window, within-view rules, and plain-writing rules 1–4 on rendered sentences (R6, R2) — counts per surface as a ratchet that may only go down (`screen-repeats-known.ts`): Today 3,732 window repeats, People 66 said twice, topic pages 1,456 phrase pairs and 3,778 contrast breaks, and so on; rules now in `content/src/plain-writing.ts`, shared by both packages
- [x] 9. Rewrite banks with the content-writer agent, worst first, until the known-failures list, the pool list and R6 are empty; delete the known-failures mechanism (R7) — five batches (A Today pools, B Ahead and People, C reference copy, D chart banks, E same-screen repeats): 498 plain-writing failures → 0, 119 short pools → 0, every screen count → 0 (Today window repeats 3,732 → 0, topic-page phrase pairs 1,456 → 0, People said twice 66 → 0); all three known lists deleted; four tests that pinned old strings updated
- [x] 11. `after.json` and the before/after table; R8 targets met (R8) — committed; three of five targets met, two ratios missed (Today 37.7% overall, 45.5% on rotating copy; Ahead 58.2%), owner decides at sign-off

## Phase 4 — Word variety (added 2026-10-23; runs 13–18, then 10 and 12)

- [x] 13. Choice groups resolved in `pickerFor` and `steppedPicker`, next combination per comeback; tests first: determinism, every combination before a repeat, no bracket on a rendered screen (R11) — `src/choices.ts`, `choices.test.ts` (11 tests, 4 failing before the pickers were wired); `screen-repeats` counts unresolved choices: a planted People group gave 4, the same group in a Today bank resolved and topic pages still mirrored their cards
- [x] 14. `collect.ts` expands every combination; plain-writing, voice and "a"/"an" checks on each; group limits; no groups in topic-page or fixed banks; test time measured (R11) — one planted bad line failed all four checks (rule, limits, article, banned word); non-picker banks are guarded by the rendered leak count (design); `pnpm verify` green, voice 179 → 295 ms with no groups yet, re-measured in task 17
- [x] 15. Measure word and phrase counts per surface over every fixture; propose caps and the exempt list for owner approval; VOICE.md overused-word list with alternatives (R12) — `test/word-variety.ts` measures in ~1.1 s; caps approved 2026-10-27 (table in requirements); VOICE.md rules 6 and 7 plus the overused-word table
- [x] 16. `word-variety.test.ts` with the approved caps; first failing run committed as the worklist (R12) — 78 terms in `word-variety-known.ts`, which the test requires exactly (a ratchet, as phase 3's was); deleted when empty
- [x] 17. Rewrite with the content-writer agent, worst first, adding choice groups, until 16 passes and every earlier test stays green (R11, R12) — three writers in parallel on separate files: Today 22 → 0 (about 470 entries with groups), Ahead 31 → 0 (149 of 156), topic pages, People, You and chart 25 → 0 (no groups: they don't rotate); worklist deleted, the test requires zero; `composed-daily` now checks real wordings (it counted every part of a group toward the 70-word budget); palace names joined the name words (owner's rule: "an element, animal sign or palace"); 12 star titles reworded, still fixed and still shared with their topic page; `pnpm verify` green
- [x] 18. Re-run the copy audit; refresh `after.json` and the before/after table with word counts (R8, R12) — every R8 target met: Today 49.0%, Ahead 64.6%; words over cap 78 → 0. Review round 1 (2026-10-27, fix first): Ahead wordings now step by the branch cycle, star titles sit out on Today (12 rewordings restored), groups allowed only in picked banks, word folding fixed; 4 broken and about 30 awkward wordings fixed by the Today and Ahead writers; `DAY_COLOUR_LINES` export kept (pool-minimums reads it); re-review: Ahead's character slots step on the ten-stem cycle (0 early repeats over 2026–2029 on every fixture), two Today nits fixed; `pnpm verify` green

## Ship

- [x] 10. `copy-audit --sample`; publish the A and D sample for the owner; record sign-off (R9) — first sample (https://claude.ai/artifact/T1t6dN9dLh455hnWbp5K6B) read 2026-10-23: owner asked for more word variety (R11, R12); second sample after phase 4 and two review rounds published 2026-10-27 (https://claude.ai/artifact/5CzrtKbMunsmBoC4DxPr7C, private); "niggle" banned and replaced at the owner's request after reading it; signed off by the owner 2026-10-27 ("signed off")
- [ ] 12. `pnpm verify`, `e2e:looks`, one deploy, live-app check of Today in each look × both themes, a topic page, Ahead and People (R10)

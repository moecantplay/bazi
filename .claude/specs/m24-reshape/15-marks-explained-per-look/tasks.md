# Tasks — What the marks mean, per look

Check a task only with a one-line evidence note.

- [x] 1. Owner answers the open questions; owner approves (R1–R4) — one sheet; two links; approved "ok" 2026-10-13
- [x] 2. Draft the entries; owner reads the copy (R1–R4) — draft in design.md, approved with the ticket; dark-theme wording fixed after task 3
- [x] 3. Screenshots: each look's page and sheet, both themes (R1–R3) — 16 shots at 390×844; "dark disc/cell" wrong in dark theme, copy fixed and re-shot
- [x] 4. Failing content tests, then the entries (R1, R2, R4) — marks.test.ts failed (no MARKS_TOPIC), then 149/149 green with glossary voice checks
- [x] 5. Link takes a topic; each look passes its own; route link on Explorer (R1–R3) — MarksLegendLink; e2e glossary.spec 4 marks tests × 3 projects green
- [x] 6. DESIGN.md §Explorer, §Editorial, §Instrument (R3) — four link lines updated
- [x] 7. Verify: `pnpm verify`, E2E, deploy (R1–R4) — verify green; full E2E 305 passed, then glossary/looks/best-hour/look-picker 105 passed on final copy
  - Deployed 2026-10-14 (`6226b9f`; production serves sw `daymaster-4b07878a028e`, matching the build). Production check, both themes × three looks: all four sheets open with their titles, Ahead/You/People/Settings return 200, no console errors.
  - Reviewer pass 2026-10-14: requested changes. Fixed: "grey" → "faint" (the even mark is the terrain-tinted hairline), the star moved to the rim animal where it's drawn, both best-hour lines give the on-screen label Suits you, Explorer's three heights, Editorial's plain dot on the highlighted day, a template literal for the rough/easy line, a typed `MarksTopic` prop, tests banning grey everywhere and dot/dash on Instrument and the route, and the E2E for Instrument now finds "best hour" (R2). Content 151/151, `pnpm verify` green, glossary + today-looks E2E 50/51 with the one failure an unrelated topic-page test that passed 9/9 on rerun (M20-25 flake).
  - Owner read the copy as it now stands and approved it, 2026-10-14 ("ok, deploy"). Redeployed `efcbbee` 2026-10-14: production serves sw `daymaster-d3b54c64f9cf`, matching the build. Production check, both themes × three looks: every sheet opens with its title and the corrected copy, Ahead/You/People/Settings return 200, no console errors.

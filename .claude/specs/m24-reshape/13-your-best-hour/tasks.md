# Tasks — Your best hour

Check a task only with a one-line evidence note.

- [x] 1. Engine tests first: Fixture A goldens worked by hand, rough-hour exclusion, gate, tie-break, unknown-time parity, 365-day sweep (R1) — `test/best-hour.test.ts`, 10 tests written first and failing (7 failed before the implementation existed)
- [x] 2. Engine: `best-hour` fact, `data/best-hour-tables.ts` with source comment, wired into `dailyFacts` (R1, R5) — `src/best-hour.ts`; engine typecheck + lint clean, 191/191 tests pass
- [x] 3. `flags.md` entry for the scoring; `decisions.md` row (R5) — both added 2026-10-13
- [x] 4. Content: hours card line with the easy-hour merge and the no-fact case; topic-page sentence; voice check (R2, R3) — `content/test/best-hour.test.ts` 7 tests; card notes added to the composed-daily voice sweep; content 141/141, presentation 220/220, web typecheck clean
- [x] 5. Mockups: Today in Explorer, Editorial and Instrument × light and dark, including a worst-case crowded route; owner approval recorded (R4) — mockups published privately 2026-10-13 (https://claude.ai/artifact/H5fJF3Ud7A7Dhso5bRsPaq), the real static build with the mark drawn in, styles A/B × 3 days × both themes; owner picked style A (the hour's element colour + four-point star) and accepted three marks on a crowded route, 2026-10-13
- [x] 6. DESIGN.md: Explorer timed marks and Instrument lit-animal budget updated to the approved mockups (R4) — v6 revision note 2026-10-13; Explorer: three timed marks, style A, merged easy mark; Instrument: outer arc at radius 133, four lit animals, key line
- [x] 7. Presentation: best-hour mark on the Today model, two-sided `spreadTimed` with tests (R4) — `bestHourMarkFor`, 365-day × every-fixture spread test; presentation 225/225; Conditions left alone (unlinked, retiring in M24-12)
- [x] 8. Web: route hero and day dial render the mark and key; E2E per look × theme; rendered contrast both themes (R4) — `e2e/best-hour.spec.ts` 10 tests × 3 browsers pass, today-looks green after the dial fit fix (272px, key 8px under it); design-system check: 4000 rendered runs × both themes × 5 terrains, 0 AA failures, theme parity clean
- [x] 9. Verify: `pnpm verify`, full E2E, live-app check with two profiles on one date, reviewer pass, deploy (R1–R5)
  - Progress 2026-10-13: `pnpm verify` green (engine 192, content 141, presentation 225, web 38).
  - Full E2E per look: trail 295/296, almanac 293/296, dial 294/296. All 6 failures were scattered Chromium-only tests that passed on rerun (the M20-25 crash flake, under extra load from a screenshot run).
  - Reviewer: minor fixes 2–11 done. Issue 1 (style A matches the easy hour on wood hours and the rough hour on earth hours) went back to the owner with round 2 mockups; the owner chose A as built, 2026-10-13. R4, design.md and DESIGN.md now record the overlap as accepted.
  - Live-app check 2026-10-13: production build, Fixture A and a wood-favouring chart on the same date, all three looks. Both get the same easy and rough hours (9–11 am, 3–5 am) and different best hours (1–3 am Fire; 3–5 pm Wood). The topic page says why for each, with no console errors.
  - Committed `8666c67`; deployed to production 2026-10-13 (daymaster-nu.vercel.app serves sw `daymaster-fbf175c26858`, matching the build). Production smoke check: both profiles × three looks show the right card and topic page, with no console errors.

# Tasks — First week

Check a task only with a one-line evidence note.

The mockups (task 2) are taken from the real static build, as in M24-13, so tasks 3–7 ran first. Nothing deploys before the owner signs off.

- [x] 1. Draft the nine notes and run them through the voice checks (R6). Two drafts: one in-thread, and one written from scratch by `content-writer`. The owner chose content-writer's, 2026-10-15. `banks/first-week.ts` is in `allBankLines` and `test/first-week.test.ts`; content 146/146.
- [x] 2. Mockups: day 1, day 2 and day 5 in Explorer, Editorial and Instrument, both themes, Fixture A. The owner signs off on placement and copy (R5, R7). Published privately at https://claude.ai/artifact/86MFZScbVmvfYaPZLkPhKz:
  - v1: 18 shots of the week as first built.
  - v2: four note styles on day 2 and the two copy drafts side by side.
  - v3: the week re-shot in the chosen style.
  - The owner chose style D (a sunken speech bubble with week dots) and content-writer's copy, 2026-10-15.
- [x] 3. `first-week.ts`, tests first (R1, R2).
  - `test/first-week.test.ts` failed 10/10 before `src/first-week.ts` existed, then passed. Added: an `INTRO_ORDER` ↔ `FIRST_WEEK_NOTES` test.
  - After review: a note whose card has left the screen is dropped on reload; walks assert every shown part is on screen; `partsOnScreen` is checked for every part. Presentation 12/12 in this file.
- [x] 4. Store field, sanitiser, `setFirstWeek`, onboarding starts the week. Tests for a missing or malformed field, backup round-trip and edit-birth (R3, R4). `store-first-week.test.ts` failed 7/7 first, then passed. After review, the sanitiser dedupes and caps `opened` at seven (one more test); 8/8.
- [x] 5. `FIRST_WEEK_NOTES` bank and voice test (R6). Shipped with task 1; `FirstWeekPart` is the content type that presentation's `IntroPart` uses.
- [x] 6. `FirstWeekNote` and its hook (`use-first-week-note.ts`), placed in all three compositions after `FirstDayBanner` (R1, R5).
  - Style D in `globals.css` (`.first-week-note`, `.first-week-dots`).
  - DESIGN.md line under §Shared surfaces.
  - Design-system card `components/first-week-note`. The contrast check found the kicker at 4.07:1 on the tint in light themes; it now moves 40% toward ink. 4030 runs, 0 failures, theme parity clean.
- [x] 7. E2E `first-week.spec.ts`: Fixture A's real week with a gap and a skipped part, a reload, three looks, a seeded old store (R1–R3, R5).
  - First version: 18/18 across chromium, mobile-chromium and mobile-webkit. One Chromium "browser has been closed" crash on the first run passed 6/6 on a rerun.
  - After review, the reload and next-day checks moved into the unseeded onboarding walk, because a seeded store re-seeds on reload.
- [x] 8. `pnpm verify`, full E2E in every look, contrast check, screenshots in 3 looks × 2 themes, deploy, live check (R8)
  - `pnpm verify` green 2026-10-15 after the review fixes: engine 199, content 146, presentation 219, web 50.
  - Full E2E per look: trail 317/320, almanac 319/320, dial 319/320 (1 skipped each).
    - All five failures were Chromium "browser has been closed" crashes (M20-25).
    - After the review fixes and a rebuild, the first-week, look-preference, error-recovery and navigation specs ran in all three looks. Dial 51/51. Trail and almanac each had look-preference crash again; that spec then passed 15/15 alone in both.
  - Contrast check: 4030 rendered runs × 2 themes × 5 terrains, 0 failures, theme parity clean.
  - Screenshots: the week in style D, 3 looks × 2 themes (mockup v3).
  - Reviewer: approved with 7 minor issues. Fixed 1–5 and 7. Issue 6 (the What the day suits note promises picking a day) is the owner's approved copy, so it went back to the owner; the stale "date finder" comment in `today-suits.tsx` is fixed.
  - Committed `086e76b`; deployed to production 2026-10-15. daymaster-nu.vercel.app serves sw `daymaster-41eb7f2cb075`, matching the build.
  - Live check on production:
    - A fresh onboarding shows the banner, no note, and stores `{"opened":["2026-10-15"],"noted":{}}`.
    - A seeded day 2 shows the Hours note, "day 2" and two dots in 3 looks × 2 themes, with the sunken fill.
    - No console errors; Ahead, You, People and Settings return 200.

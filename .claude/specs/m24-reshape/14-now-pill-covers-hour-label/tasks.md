# Tasks — NOW pill covers an hour label

Check a task only with a one-line evidence note.

- [x] 1. Owner picks the approach; design written (R1–R3) — mockups 2026-10-14 (https://claude.ai/artifact/8bHzRgAQ2mJB42dd6SJawc): as shipped vs a fixed pill vs a fixed caption, six moments × both themes; owner chose the fixed pill bottom right, 2026-10-14
- [x] 2. Failing geometry sweep, then `NOW_PILL` and the pill moved (R1, R2) — `route-geometry.test.ts` failed (no `NOW_PILL`), then 3/3: 661 mark positions × 48 labels clear by ≥4px, MORNING/EVENING/route clear, inside the viewBox
- [x] 3. E2E: the pill holds still across the day (R1) — `e2e/now-pill.spec.ts`, 6:30/10:00/18:00 × 3 projects, 9/9 (polls past the pop-in animation)
- [x] 4. DESIGN.md §Explorer (R3) — the route hero paragraph records the fixed pill
- [x] 5. Verify: `pnpm verify`, E2E, deploy, live-app check both themes (R1–R3)
  - `pnpm verify` green (engine 192, content 151, presentation 225, web 41). Full E2E 313 passed, 1 skipped, 1 failed: Editorial's best-hour card on Chromium, untouched here, 9/9 on rerun (M20-25 flake).
  - Committed `081a76a`; deployed 2026-10-14 (production serves sw `daymaster-6c1590d39278`, matching the build). Production check: Explorer at 6:30 and 10:00 on 2026-10-13, both themes, the pill sits bottom right, clear of MORNING and SUITS YOU · 1–3 AM; all tabs 200, no console errors.

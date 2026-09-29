# Tasks — Choose your look: onboarding step and Settings option

Check a task only with a one-line evidence note.

- [x] 1. Mock the onboarding step, Settings control and existing-user note, both themes (R4) — `research/look-picker.html` (https://claude.ai/artifact/JdjweEDzxxWB4pFB6hHLgi)
- [x] 2. Owner review (R4) — "approved" 2026-09-29
- [x] 3. Store: `lookPromptSeen` + save look with the profile, tests first (R1, R5) — `saveOnboardingResult`, `shouldShowLookIntro`, `answerLookIntro`; 4 new tests red → green, web unit 21/21
- [x] 4. `LookPreview` + `LookPicker` (R3) — live heroes from `usePreviewScreen` (no streak, no terrain stamp), scaled by ResizeObserver; `RouteHero` mask id via `useId`
- [x] 5. Onboarding `LookStep` before the reveal (R1) — step 6 of 6; draft carries `look` (old drafts restore as trail); reveal saves profile + look together
- [x] 6. Settings Look section (R2) — `settings-look-section.tsx` under Appearance
- [x] 7. `LookIntroSheet` for existing users (R5) — shown after mount when `shouldShowLookIntro()`; every answer final
- [x] 8. E2E + contrast + DESIGN.md (R1–R5) — `look-picker.spec.ts` (5 specs) + onboarding spec's look step; rendered step/Settings/note, both themes: 212 runs, 0 failures (previews excluded as decorative); DESIGN.md §Shared surfaces + §Layout
- [x] 9. Verify: pnpm verify, E2E matrix, live app (R1–R5) — see commit; E2E 49/49 in each look; live: onboarding, Settings, note in both themes, 0 console errors (`research/app-*.png`)

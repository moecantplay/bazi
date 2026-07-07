# Daymaster — PROGRESS

Living checklist. Every checked task carries a one-line evidence note.

## M0 — Scaffold
- [x] git init (main branch) — repo initialized
- [x] pnpm workspace: apps/web, packages/bazi-engine, packages/content — pnpm-workspace.yaml
- [x] Root `pnpm verify` script (typecheck+lint+test+build) — package.json
- [x] pnpm install green — pnpm 9.15.9, Next 15.5.20 resolved
- [x] PLAN.md / PROGRESS.md / CLAUDE.md written
- [x] 5 subagents defined in .claude/agents/ — engine-dev, content-writer, ui-dev, reviewer, test-runner
- [x] Initial commit on green verify — full `pnpm verify` green (typecheck+lint+test+build, static export OK)

## M1 — Engine core
- [x] Types + reference tables in data/ — char-by-char reviewer-verified vs §11
- [x] Solar-term generator + data/solar-terms.json (1900–2100) + anchor tests — 2412 entries, strictly increasing, anchors within ±1d
- [x] sexagenary / yearPillar / monthPillar / dayPillar / hourPillar / annualPillar / dailyPillar — 50 tests green
- [x] EngineConfig (lateZiHour, trueSolarTime) — fixture D + EoT bounds tested
- [x] Golden fixtures A–D green — reviewer independently recomputed boundaries (立春 2000 to the ms)

## M2 — Engine derived
- [x] hiddenStems / tenGods — reviewer re-derived full 10×10 matrix, exact match
- [x] interactions (combines/clashes/trines/punishments/harms + palaces) — duplicate-branch pairs verified
- [x] luckPillars (direction + start age + 8 pillars) — fixture A: 114 months → age 9 / 2004, recomputed by reviewer
- [x] strength / favorableElements — labeled interpretive, one school; fixture A weak, [fire, earth]
- [x] ReadingFacts emitted — natalFacts + dailyFacts deterministic, annual+daily transits
- [x] ≥20 total fixtures, coverage ≥90% — 90 tests, 97.7% lines
- [ ] Follow-ups: >2100 RangeError guard + backward-luck startAge assertion (engine-dev running)

## M3 — Content
- [x] VOICE.md — packages/content/VOICE.md (hard rules, calibration, palace vocab, disclaimer copy)
- [ ] Natal bank (~120) / daily bank (~150) / luck transitions
- [ ] Deterministic seeded selection
- [ ] Disclaimer copy

## M4 — UI shell + onboarding
- [x] DESIGN.md + reviewer critique — reviewer APPROVE after 6 fixes (AA element-hue rule, seal-only cinnabar, ink-soft input borders)
- [ ] Onboarding flow incl. unknown-time + city picker (cited dataset)
- [x] City dataset — 2000 cities from GeoNames cities15000 (CC BY 4.0, cited), 180KB, generator script apps/web/scripts/generate-cities.mjs
- [ ] Seal component
- [ ] localStorage persistence

## M5 — Chart + Today
- [ ] Chart screen (grid, day-master, balance, favorable, seal)
- [ ] Today screen (±30d nav, palace touches)
- [ ] Fixture A renders 甲戌 丙子 戊辰 庚申 + trine + Eating God

## M6 — Cycles + settings + PWA
- [ ] Cycles screen (Fixture A start years correct)
- [ ] Settings (toggles, disclaimer, delete data)
- [ ] PWA manifest + SW, no console errors

## M7 — E2E + README + DoD audit
- [ ] 3 Playwright flows green
- [ ] README + clean-clone verify
- [ ] Full DoD re-audit green

## Flags / unverifiable values
- Equation of time uses the sun's geometric mean longitude from the standard Meeus polynomial (280.46646 + 36000.76983·T + 0.0003032·T², Astronomical Algorithms ch. 25) because astronomy-engine exposes only apparent RA. ACCEPTED: standard published constants, source-commented in src/true-solar-time.ts, validated against known EoT extremes (±20 min bound, Nov ≈ +16.5 min).

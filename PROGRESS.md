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
- [x] Follow-ups: >2100 RangeError guard + backward-luck startAge assertion — 98 tests green, committed

## M3 — Content
- [x] VOICE.md — packages/content/VOICE.md (hard rules, calibration, palace vocab, disclaimer copy)
- [x] Natal bank (114) / daily bank (62 templates → ~139 rendered variants) / luck transitions (10) — reviewer APPROVE, committed
- [x] Deterministic seeded selection — FNV-1a, determinism tests
- [x] Disclaimer copy — byte-identical to VOICE.md, asserted in tests

## M4 — UI shell + onboarding
- [x] DESIGN.md + reviewer critique — reviewer APPROVE after 6 fixes (AA element-hue rule, seal-only cinnabar, ink-soft input borders)
- [x] Onboarding flow incl. unknown-time + city picker (cited dataset) — reviewer APPROVE; 14/14 headless flow checks, zero console errors
- [x] Seal component — pure FNV-1a/mulberry32-seeded SVG, cinnabar-only mass
- [x] localStorage persistence — daymaster.profile.v1 via single lib/profile.ts gateway
- [x] Settings screen (full) — toggles persist immediately, delete-my-data with confirm (built early, ahead of M6)
- [x] City dataset — 2000 cities from GeoNames cities15000 (CC BY 4.0, cited), 180KB, generator script apps/web/scripts/generate-cities.mjs
- [ ] Seal component
- [ ] localStorage persistence

## M5 — Chart + Today
- [ ] Chart screen (grid, day-master, balance, favorable, seal)
- [ ] Today screen (±30d nav, palace touches)
- [ ] Fixture A renders 甲戌 丙子 戊辰 庚申 + trine + Eating God

## M6 — Cycles + settings + PWA
- [x] Cycles screen (Fixture A start years correct) — headless-verified 丁丑@9/2004, 己卯 decade highlighted, 2026=丙午; reviewer APPROVE
- [x] Settings (toggles, disclaimer, delete data) — shipped in M4
- [x] PWA manifest + SW, no console errors — trailingSlash export, route precache verified, installability basics green

## M7 — E2E + README + DoD audit
- [ ] 3 Playwright flows green
- [ ] README + clean-clone verify
- [ ] Full DoD re-audit green

## Flags / unverifiable values
- Equation of time uses the sun's geometric mean longitude from the standard Meeus polynomial (280.46646 + 36000.76983·T + 0.0003032·T², Astronomical Algorithms ch. 25) because astronomy-engine exposes only apparent RA. ACCEPTED: standard published constants, source-commented in src/true-solar-time.ts, validated against known EoT extremes (±20 min bound, Nov ≈ +16.5 min).

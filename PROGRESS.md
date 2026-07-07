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
- [ ] Types + reference tables in data/
- [ ] Solar-term generator + data/solar-terms.json (1900–2100) + anchor tests
- [ ] sexagenary / yearPillar / monthPillar / dayPillar / hourPillar / annualPillar / dailyPillar
- [ ] EngineConfig (lateZiHour, trueSolarTime)
- [ ] Golden fixtures A–D green

## M2 — Engine derived
- [ ] hiddenStems / tenGods
- [ ] interactions (combines/clashes/trines/punishments/harms + palaces)
- [ ] luckPillars (direction + start age + 8 pillars)
- [ ] strength / favorableElements
- [ ] ReadingFacts emitted
- [ ] ≥20 total fixtures, coverage ≥90%

## M3 — Content
- [ ] VOICE.md
- [ ] Natal bank (~120) / daily bank (~150) / luck transitions
- [ ] Deterministic seeded selection
- [ ] Disclaimer copy

## M4 — UI shell + onboarding
- [ ] DESIGN.md + reviewer critique
- [ ] Onboarding flow incl. unknown-time + city picker (cited dataset)
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
(none yet)

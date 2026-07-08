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
## M5 — Chart + Today
- [x] Chart screen (grid, day-master, balance, favorable, seal) — reviewer APPROVE; stable section keys
- [x] Today screen (±30d nav, palace touches) — UTC-safe date math, agency line last/distinct
- [x] Fixture A renders 甲戌 丙子 戊辰 庚申 + trine + Eating God — headless-verified on the built export

## M6 — Cycles + settings + PWA
- [x] Cycles screen (Fixture A start years correct) — headless-verified 丁丑@9/2004, 己卯 decade highlighted, 2026=丙午; reviewer APPROVE
- [x] Settings (toggles, disclaimer, delete data) — shipped in M4
- [x] PWA manifest + SW, no console errors — trailingSlash export, route precache verified, installability basics green

## M7 — E2E + README + DoD audit
- [x] 3 Playwright flows green — onboarding→chart, chart→today→date-nav, settings-toggle-changes-output; 3/3 against the built static export, re-run by orchestrator
- [x] README + clean-clone verify — fresh clone → pnpm install → pnpm verify GREEN (scratchpad clean-clone)
- [x] Full DoD re-audit green — see DoD audit below

## DoD audit (final, 2026-07-07)
1. [x] pnpm verify green from clean clone — fresh clone in scratchpad, README steps, GREEN
2. [x] §5 golden tests pass; fixtures ≥20; engine coverage ≥90% — 98 engine tests green; 97.77% lines / 96.44% branch (threshold enforced in vitest config)
3. [x] Fixture A renders 甲戌 丙子 戊辰 庚申 + Water trine + Eating God — E2E onboarding-to-chart.spec.ts
4. [x] 3 consecutive daily readings differ, each cites ≥1 computed fact — E2E chart-today-datenav.spec.ts (data-fact-tag assertions)
5. [x] Unknown-time → 3-pillar chart, no hour-dependent copy — engine unknown-time fixtures (no hour palace/facts), content tests (no hour phrasing), UI "hour unknown" frame verified headlessly
6. [x] Cycles shows Fixture A luck pillars with correct start years — 丁丑@2004 … verified headlessly against engine goldens
7. [x] 3 Playwright smoke flows green — 3/3, single worker, pinned clock, real static export
8. [x] PWA installable + no console errors — manifest + SW verified on the served export (fetchable manifest, SW controls page, icons resolve, offline fallback); zero console/page errors across every headless drive (14/14, 10/10, 8/8 checks)
9. [x] Disclaimer in onboarding + settings; VOICE holds on 20-line random sample — disclaimer byte-identical (tested); reviewer sampled 20 lines across banks, all compliant
10. [x] README: what/quickstart/architecture/doctrine/screenshot — docs/screenshot-chart.png captured from the real /chart

## M9 — Dark mode
- [x] DESIGN.md dark section — token table with computed WCAG ratios (ink 14.40:1, ink-soft 7.87:1, element hues 5.87–6.90:1), seal-only cinnabar preserved via new `--seal-paper` token (interior stays stamped-paper white; corner notches follow the page)
- [x] CSS-variable dark theme: `prefers-color-scheme` default, `data-theme` pin from Settings (System/Light/Dark radiogroup), `daymaster.theme.v1` in localStorage, pre-paint inline script so pinned themes never flash, PWA theme-color per scheme, delete-my-data clears it
- [x] Playwright theme spec — pin dark, survive reload, Light beats dark OS, System follows OS; 4/4 E2E green, verify green

## M10 — Plain-meaning voice pass
- [x] VOICE.md rule 11: every system term followed by a plain-life gloss — calibration examples added, "naked jargon" listed as a wrong
- [x] Central gloss maps in vocab.ts (INTERACTION_GLOSSES, TEN_GOD_GLOSSES, DAY_MASTER_GLOSS, LUCK_PILLAR_GLOSS), exported from the package
- [x] Banks rewritten against the rule: transit/natal interactions, ten-god day lines, strong/weak day-master, luck templates — day-master archetypes already compliant
- [x] Chart jargon translated in UI: ten-god captions under pillar stems get short glosses, day-master heading gets its gloss, Cycles timeline opens with the luck-pillar gloss
- [x] Voice test asserts every gloss exists and is voice-clean; 45 content tests green, verify green, 3/3 E2E

## M8 — Compare (stretch, done)
- [x] Engine: compareInteractions + compareFacts — cross-chart PAIR relations only (combines/clashes/harms/子卯 punishment/mirror self-punishments/trine pairs), day-master ten gods both directions, element support; 12 tests written first, hand-derived vs the 1949-10-01 甲子 anchor chart; 110 engine tests green
- [x] Content: compare bank + compareReading — relation lines per element cycle, seen-as lines reusing TEN_GOD_GLOSSES, cross-interaction templates with M10 glosses, mirror-punishment phrasing, ≤3 seeded interaction lines; all templates in the voice sweep; 51 content tests green
- [x] Web: /compare screen (5th tab) — compact second-birth form (unknown-time path, city picker, sex), companion persisted at daymaster.compare.v1, same engine config as primary, both pillar grids + cited reading cards, change-person clears; delete-my-data clears companion too; SW precaches /compare/ (cache bumped v2)
- [x] E2E compare flow (fill → read pair → reload persists → change person clears); 5/5 flows green, verify green

## M11 — Master-reading parity (life stages, stars, na yin, strength detail, do's/don'ts)
- [x] Golden fixtures transcribed from a professional charting app's reading of Fixture A (test/master-reading.test.ts, 18 tests): life stages incl. 自坐 and transit stages, per-pillar 神煞, 空亡=戌亥, strength 失令/得地/失勢, luck start 9y5m25d, na yin, 胎元 丁卯
- [x] Engine: twelve life stages (day-master + self-sitting per pillar), 納音 30-name table, 神煞 module (19 stars incl. 空亡; dual year/day keying for trine-group stars per classical practice), 胎元, strength breakdown (seasonalSupport/rooted/backed = 令/地/勢), luck start to day precision (3d=1y → 6h=1m → 1h=5d), transitBranch on transit facts; 128 engine tests green
- [x] Content: STAR_GLOSSES/LIFE_STAGE_GLOSSES/STRENGTH_CHECK_GLOSSES in vocab, stars + stages banks, strength why-line (three checks in plain words), transit templates rewritten to name which branch is today's vs yours (how/why/what), do's & don'ts (1–2 each, fact-cited, generic fallback, postponement-not-prohibition); 56 content tests green
- [x] Web: per-pillar stage/sound/star captions with glosses, Your stars section, 胎元 line, precise 起運 line on Cycles, Worth doing / Worth postponing cards on Today; verify green, 5/5 E2E

## Flags / unverifiable values
- Equation of time uses the sun's geometric mean longitude from the standard Meeus polynomial (280.46646 + 36000.76983·T + 0.0003032·T², Astronomical Algorithms ch. 25) because astronomy-engine exposes only apparent RA. ACCEPTED: standard published constants, source-commented in src/true-solar-time.ts, validated against known EoT extremes (±20 min bound, Nov ≈ +16.5 min).
- 神煞 學堂, 詞館, 血刃 are OMITTED: the reference app (master-reading screenshot, 2026-07-08) places 學堂@卯, 詞館@申, 血刃@戌 for Fixture A, and none of the classical rule variants I could verify (三命通會 day-stem or nayin-命 keyings) reproduce those placements. Rather than guess a school, they're left out; add once the app's rule can be confirmed (its 神煞 help screen, or more example charts).
- 命宮/身宮 (life/body palace) OMITTED: the formula is school-variant (month/hour indexing differs by lineage) and the reference screenshot doesn't show the 命身胎息 tab, so no golden value exists to pick a school against. 胎元 (single unambiguous rule) IS implemented.
- Luck-start day precision matches the reference app exactly (9y5m25d) when the birth wall-clock is UTC+8; at Asia/Jakarta (UTC+7) the same rule yields 9y5m20d. Both asserted in tests. The pillars, stages, and stars are timezone-insensitive for this chart; only the 起運 day count shifts.

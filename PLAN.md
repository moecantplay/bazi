# Daymaster — PLAN

Milestone plan expanded from the project brief. Tasks get checked off in PROGRESS.md.

## M0 — Scaffold + tooling + state files
- pnpm monorepo: `apps/web` (Next.js 15, TS strict, Tailwind, static export), `packages/bazi-engine`, `packages/content`
- `pnpm verify` = typecheck + lint + unit tests + build (all packages)
- git init, conventional commits
- State files: PLAN.md, PROGRESS.md, CLAUDE.md
- Subagents in `.claude/agents/`: engine-dev, content-writer, ui-dev, reviewer, test-runner

## M1 — Engine core
- Types: Stem, Branch, Pillar, Chart, LuckPillar, EngineConfig
- Reference tables in `data/` (stems, branches, five tigers, five rats, hidden stems, combines/clashes/trines/punishments/harms) with source comments pointing at brief §11
- Solar-term generator (astronomy-engine): jié instants 1900–2100 → `data/solar-terms.json`; generator unit-tested against anchors (立春 1994 = Feb 4 ±1d, 大雪 1994 = Dec 7 ±1d, 立春 2026 = Feb 4 ±1d)
- `sexagenary`, `yearPillar` (Li Chun boundary), `monthPillar` (jié boundaries + Five Tigers), `dayPillar` (anchor 1949-10-01 = 甲子, lateZiHour config), `hourPillar` (Five Rats), `annualPillar`, `dailyPillar`
- trueSolarTime config (longitude offset + equation of time)
- Golden tests A–D written FIRST; unknown-time (hour: null) accepted

## M2 — Engine derived
- `hiddenStems`, `tenGods` (element relation × polarity; Chinese + English labels)
- `interactions` (six combines, six clashes, trines full/half, punishments, harms; reports involved palaces)
- `luckPillars` (direction rule, start age from days-to-jié ÷ 3, 8 pillars with Gregorian start years)
- `strength` heuristic (documented, constants file), `favorableElements` (climate-first)
- ReadingFact emission for content layer
- ≥15 extra fixtures (jié-edge ±2min, Feb 29, 23:00/01:00 exact, 11:59/12:00, unknown-time, backward luck)
- Coverage ≥90% lines

## M3 — Content
- VOICE.md first
- Line bank: ~120 natal + ~150 daily + luck-transition lines
- Deterministic selection seeded by hash(birth data + ISO date)
- Disclaimer copy
- Content layer does zero chart math (facts in, prose out)

## M4 — UI shell + onboarding + DESIGN.md
- DESIGN.md (ink & cinnabar tokens, type roles, layout, seal spec) → reviewer critique → implement
- App shell, routing, localStorage persistence
- Onboarding: date, time + unknown-time path, offline city picker (bundled dataset, cited source), sex, chart reveal
- Cinnabar seal component (deterministic from pillars)

## M5 — Chart + Today wired end-to-end
- Chart screen: pillar grid hero, day-master card, element balance viz, favorable elements, seal
- Today screen: daily reading, ±30-day nav, today's pillar + touched palaces

## M6 — Cycles + settings + polish
- Cycles: luck timeline, current decade highlighted, annual pillars
- Settings: late-Zi toggle, true-solar-time toggle, disclaimer, delete-my-data
- PWA: manifest + service worker, installable
- A11y/responsive pass (360px, focus, AA contrast)

## M7 — E2E + README + DoD audit
- 3 Playwright flows: onboarding→chart, chart→today→date-nav, settings toggles change output
- README (what/quickstart/architecture/doctrine/screenshot); clean-clone verify
- Re-run every DoD checkbox, fix, re-audit

## M8 (stretch) — Compare
- Second birth entry, two-chart interaction reading, local only

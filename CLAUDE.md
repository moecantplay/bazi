# Daymaster — project conventions

Co-Star-style daily-reading app on a BaZi (Four Pillars) engine. Local-only, no backend, installable PWA.

## Commands
- `pnpm verify` — typecheck + lint + unit tests + build across all packages (commit only on green)
- `pnpm --filter @daymaster/bazi-engine test` — engine unit tests
- `pnpm --filter @daymaster/bazi-engine generate:solar-terms` — regenerate data/solar-terms.json
- `pnpm --filter @daymaster/web dev` — dev server
- `pnpm --filter @daymaster/web e2e` — Playwright smoke flows

## Architecture
- `packages/bazi-engine` — pure TS. Deps: luxon + astronomy-engine only. All exported functions pure/deterministic. Emits typed ReadingFacts. Zero UI imports.
- `packages/content` — zero-dep line bank + deterministic seeded selection. Phrases facts; NEVER does chart math.
- `apps/web` — Next.js 15 App Router, static export, Tailwind, localStorage state. No runtime network calls.

## Non-negotiables
- Never invent calendrical/astronomical constants: every table is embedded in `packages/bazi-engine/data/` with a source comment, computed via astronomy-engine, or copied from the brief §11. Unverifiable → flag in PROGRESS.md.
- Golden fixtures (brief §5) are authoritative; write tests first for engine work.
- Voice rules in VOICE.md bind all user-facing copy: no fatalism, no medical/financial/legal directives, agency line ends every daily reading.
- Deterministic reading selection: hash(birth data + ISO date). No render-time randomness.

## Decisions Log
- 2026-07-07 Tailwind 3.4 (not v4) — stable PostCSS pipeline with Next 15 static export, no relitigation of stack.
- 2026-07-07 Packages ship raw TS (`main: src/index.ts`) transpiled by Next via `transpilePackages` — no build step per package; `build` = `tsc --noEmit`.
- 2026-07-07 Day-pillar anchor: 1949-10-01 = 甲子 per brief §4.4.
- 2026-07-07 apps/web has no unit tests by design; logic lives in packages, web is covered by Playwright E2E.
- 2026-07-07 City dataset: GeoNames cities15000 (CC BY 4.0), top 2000 by population, regenerate via `node apps/web/scripts/generate-cities.mjs <cities15000.txt>`.
- 2026-07-07 VOICE.md written by orchestrator (register + hard rules); content-writer must comply, not rewrite it.
- 2026-07-07 Fire element accent (#D0662A, orange) deliberately distinct from cinnabar (#BF3A2B) so the seal stays the only cinnabar mass.
- 2026-07-07 Dark mode out of scope for v1 (one light theme done properly).
- 2026-07-07 Engine input conventions: instant = JS Date (absolute UTC); IANA zone string for local reading; dailyPillar takes "YYYY-MM-DD"; longitude east-positive; out-of-table years (pre-1900/post-2100) throw RangeError.
- 2026-07-07 EoT mean longitude from Meeus polynomial (source-commented) — accepted exception to "astronomy-engine only", see PROGRESS.md flags.
- 2026-07-07 astronomy-engine loaded via createRequire to dodge ESM/CJS dual-build inconsistency between vite and tsx.
- 2026-07-07 apps/web webpack config: extensionAlias .js→.ts (engine uses NodeNext specifiers) + NormalModuleReplacementPlugin shims node:module→shims/node-module.mjs so the engine's createRequire bundles for the browser.
- 2026-07-07 Post-review design decisions: cinnabar strictly seal-only (buttons = ink fill/paper text; day-column marker = ink underline); element hues never normal-size text (fills/swatches or ≥19px bold); input borders = --ink-soft (hairline is dividers only).

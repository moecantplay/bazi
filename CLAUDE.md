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

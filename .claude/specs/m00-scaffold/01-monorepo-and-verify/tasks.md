# Tasks — Monorepo and verify pipeline

Reconstructed 2026-09-29 from: `_sources/plan.md` §M0, `_sources/progress.md` §M0, `_sources/decisions-log.md` 2026-07-07 entries, commit `8cea896`. Records only what those sources say; anything they don't record is marked "Not recorded."

- [x] 1. git init (main branch) — repo initialized
- [x] 2. pnpm workspace: apps/web, packages/bazi-engine, packages/content — pnpm-workspace.yaml
- [x] 3. Root `pnpm verify` script — package.json
- [x] 4. pnpm install green — pnpm 9.15.9, Next 15.5.20 resolved
- [x] 5. Initial commit on green verify — full `pnpm verify` green (typecheck+lint+test+build, static export OK)

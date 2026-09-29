# Design — Monorepo and verify pipeline

Reconstructed 2026-09-29 from: `_sources/plan.md` §M0, `_sources/progress.md` §M0, `_sources/decisions-log.md` 2026-07-07 entries, commit `8cea896`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Packages ship raw TypeScript and are transpiled by Next rather than having their own build step; each package's `build` is `tsc --noEmit`.

## Changes

| Area | Change |
| --- | --- |
| repo root | pnpm workspace, root scripts |
| `apps/web` | Next.js 15 static export, Tailwind 3.4 |
| `packages/*` | engine and content packages, raw TS |

## Alternatives considered

Tailwind v4 (rejected for pipeline stability with static export).

## Risks

Not recorded.

## Verification

`pnpm verify` green including static export.

## Decisions

- 2026-07-07 Tailwind 3.4, not v4: stable PostCSS pipeline with Next 15 static export; no relitigation of stack.
- 2026-07-07 Packages ship raw TS (`main: src/index.ts`) transpiled by Next via `transpilePackages` — no build step per package; `build` = `tsc --noEmit`.

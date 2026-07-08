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
- 2026-07-07 Dark mode out of scope for v1 (one light theme done properly). SUPERSEDED same day: product owner promoted dark mode to M9 — bright-only background is off-putting; same design bar as light (AA contrast, seal-only cinnabar).
- 2026-07-07 Voice direction (M10): system jargon never stands alone — every mechanic term in user-facing copy is followed in-line by a relatable gloss (metaphor or everyday situation). Product-owner feedback: current copy reads too mysterious.
- 2026-07-07 Engine input conventions: instant = JS Date (absolute UTC); IANA zone string for local reading; dailyPillar takes "YYYY-MM-DD"; longitude east-positive; out-of-table years (pre-1900/post-2100) throw RangeError.
- 2026-07-07 EoT mean longitude from Meeus polynomial (source-commented) — accepted exception to "astronomy-engine only", see PROGRESS.md flags.
- 2026-07-07 astronomy-engine loaded via createRequire to dodge ESM/CJS dual-build inconsistency between vite and tsx.
- 2026-07-07 apps/web webpack config: extensionAlias .js→.ts (engine uses NodeNext specifiers) + NormalModuleReplacementPlugin shims node:module→shims/node-module.mjs so the engine's createRequire bundles for the browser.
- 2026-07-07 Post-review design decisions: cinnabar strictly seal-only (buttons = ink fill/paper text; day-column marker = ink underline); element hues never normal-size text (fills/swatches or ≥19px bold); input borders = --ink-soft (hairline is dividers only).
- 2026-07-08 "Show Chinese characters" settings toggle (product-owner choice over an English-first redesign): default on; off swaps glyphs for their English glosses and strips Han from reading text via content's stripHanCharacters (branch runs become animal names). The seal keeps its characters — it's the signature artwork, not copy. Stored at daymaster.han.v1 ("hide" = off, absence = on).
- 2026-07-08 Service worker is build-finalized: scripts/generate-sw.mjs (postbuild, wired into `pnpm build`) injects the precache list (every file in out/) and a content-hash cache version into out/sw.js. Never hand-bump a version. Updates install-and-wait; only a user-accepted "Refresh" may reload (clients.claim on first install fires controllerchange too — guard stays).
- 2026-07-08 Push notifications are structurally out (web push requires an app server on both platforms; no backend). Retention = local streak (daymaster.streak.v1) + come-back-tomorrow chrome line. Chrome lines around readings are UI copy, not reading copy — the agency line still ends every reading.
- 2026-07-08 Share links encode the birth details in the URL (base64url JSON, /onboarding/?share=); a shared chart is always "someone to compare with", never a replacement profile. Share card is canvas-drawn on device in the current theme; cinnabar appears only inside the redrawn seal.
- 2026-07-08 Compare people: daymaster.people.v1 (named list) + daymaster.people-active.v1; legacy daymaster.compare.v1 auto-migrates to a person named "Them" on first Compare load. Backup JSON (versioned envelope, v1) is the local-only account substitute and carries profile + people + preferences; streak is deliberately excluded.
- 2026-07-08 iOS splash images (apple-touch-startup-image) deliberately skipped: dozens of viewport-pinned PNGs for one launch frame. Revisit only if installed-app polish becomes a priority.
- 2026-07-08 Icon pipeline: public/icon.svg is the single artwork source; scripts/generate-icons.mjs rasterizes any (192/512), maskable (content scaled to 0.78 safe zone), and opaque 180px apple-touch. scripts/generate-manifest-screenshots.mjs regenerates the install-sheet screenshots from the built export.

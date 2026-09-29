# Tasks — Anonymous usage counts (dormant until configured)

Check a task only with a one-line evidence note.

- [x] 1. Stub script, static-server route, `build:e2e`; `usage-counts.spec.ts` — failing first (R2–R4) — 6/7 failed before the gateway existed (the never-counted case passed trivially)
- [x] 2. `lib/analytics.ts` + unit tests (R1–R4) — 10 unit tests (config, store choice, GPC/DNT, no store creation, route-only page views, buckets)
- [x] 3. `usageCounts` store field + store test (R4) — additive, default true; `peekStore` added (see As built)
- [x] 4. `UsageCounts` component in layout; page views (R1, R2) — page view test: `/chart/?from=somewhere#section` → `/chart/`
- [x] 5. Events at each source (R2) — spec covers reading-opened, look-chosen (settings, onboarding), onboarding-step ×7, onboarding-finished, reading-marked, chart-shared, screen-error; backup-downloaded/data-deleted wired at `downloadBackup()` and both delete paths
- [x] 6. Settings toggle / GPC note (R4, R5) — spec: toggle off stops events and the script; GPC shows the note and no switch
- [x] 7. CSP origins in `write-deploy-config.mjs` when configured (R2) — script-src/connect-src gain `https://cloud.umami.is` (and a host URL's origin) only when set
- [x] 8. README privacy section (R5) — "What leaves your device"; "no network calls" removed from README and apps/web/CLAUDE.md
- [x] 9. Default build has no analytics reference; full E2E in all looks; `pnpm verify` green (R1–R5) — default build: 0 script tags, no `window.umami`, no switch, 0 foreign requests over Today/Chart/Settings; E2E with stub trail 69/69, almanac 68/69 (Chromium SEGV flake), dial 69/69

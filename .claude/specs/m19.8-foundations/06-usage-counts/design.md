# Design — Anonymous usage counts (dormant until configured)

## Approach

**Configuration (build time).** `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL`, `NEXT_PUBLIC_ANALYTICS_SITE_ID`, and optional `NEXT_PUBLIC_ANALYTICS_HOST_URL` (Umami's `data-host-url`, used when events go to a different origin from the script). The owner puts them in `apps/web/.env.production.local` (already gitignored by `.env.*`). Unset → `isAnalyticsConfigured()` is false, and nothing below runs. Ticket 05's `write-deploy-config.mjs` adds the script and host origins to CSP `script-src`/`connect-src` only when set.

**`lib/analytics.ts`** — the single gateway:
- `analyticsAllowed()`: configured, `loadStore().usageCounts !== false`, and neither `navigator.globalPrivacyControl === true` nor `navigator.doNotTrack === "1"`.
- `track(event)`: `event` is a discriminated union, so no call site can invent keys. No-ops when not allowed. Queues until the script has loaded (flushed on `load`, dropped on `error`) and forwards to `window.umami.track(name, data)`.
- `trackPageview(pathname)`: `umami.track((props) => ({ ...props, url: pathname }))`, so only the route is sent.
- Bucket helpers: streak `1 | 2-6 | 7-29 | 30+`; days since `profile.createdAt` `0 | 1-6 | 7-29 | 30-89 | 90+`; `installed` from `display-mode: standalone` or `navigator.standalone`; theme resolved from `data-theme` or `prefers-color-scheme`.

**`components/usage-counts.tsx`** (client, mounted once in `layout.tsx`): on mount, if allowed, injects the script (`defer`, `data-website-id`, `data-auto-track="false"`, `data-do-not-track="true"`, optional `data-host-url`) and sends a page view whenever `usePathname()` changes.

**Store.** `usageCounts: boolean` joins `DaymasterStore` as an additive field, like `journal` and `look`: `emptyStore()` sets true, and `loadStore()` fills `fields.usageCounts !== false`. No version bump or migration. Backups carry it.

**Events at their one source each:**
- `reading-opened` — `use-today-screen.ts`, only when `streak.ts`'s new `hasOpenedToday(today)` was false before `recordTodayOpen`.
- `look-chosen` — the three places a look is saved (onboarding look step, Settings look section, the one-time note).
- `onboarding-step` / `onboarding-finished` — `onboarding/page.tsx` step changes and save.
- `reading-marked` — `day-journal.tsx` mark only; note text is never read.
- `chart-shared` — `share-actions.tsx`; `backup-downloaded` — `downloadBackup()`; `data-deleted` — `deleteAllData()` callers (sent before the store is cleared).
- `screen-error` — `RecoveryScreen` (ticket 01): `usePathname()` and `error.name`.

**Settings.** In "Your data", only when configured: a `Toggle` row "Share anonymous usage counts" — "Counts which screens and looks get used, so the app can get better. Never your birth details, notes, or anything that identifies you. No cookies." When GPC/DNT is on, the row is replaced by "Your browser asks sites not to track, so nothing is counted."

**E2E stub.** A new `build:e2e` script builds with `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=/__e2e/analytics.js` and `NEXT_PUBLIC_ANALYTICS_SITE_ID=e2e`. `static-server.mjs` serves `e2e/fake-analytics.js` at that path: a fake `window.umami` that appends calls to `window.__analyticsCalls`. The whole suite then runs with counting on, as production would, and `usage-counts.spec.ts` inspects the calls. The `e2e`, `e2e:looks` and `e2e:ci` scripts use `build:e2e`.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/analytics.ts` (+ `.test.ts`) | New gateway, buckets |
| `apps/web/src/components/usage-counts.tsx` | New; mounted in `app/layout.tsx` |
| `apps/web/src/lib/store.ts` | `usageCounts` field; `data-deleted` sent before clearing |
| `apps/web/src/lib/streak.ts` | `hasOpenedToday` |
| Event call sites | as listed above |
| `apps/web/src/components/settings-content.tsx` | Toggle row / GPC note |
| `apps/web/scripts/write-deploy-config.mjs` | CSP origins when configured |
| `apps/web/e2e/fake-analytics.js`, `static-server.mjs`, `usage-counts.spec.ts` | Stub + spec |
| `apps/web/package.json` | `build:e2e`; E2E scripts use it |
| `README.md` | "What leaves your device" |

## Alternatives considered

- **Vercel Web Analytics (Hobby)** — free and already on the host, but custom events need a paid plan, so it can't answer the look question.
- **Plausible** — paid; the owner declined subscriptions.
- **Cloudflare Web Analytics** — free but page views only.
- **Our own endpoint** — needs the M21 backend. Self-hosted Umami there is the planned end state; this code doesn't change when that happens, only the env vars.
- **An npm SDK** — unnecessary: one script tag and a typed wrapper.

## Risks

- Ad blockers drop the script. Counts undercount, evenly across looks, which is good enough for a relative comparison.
- Umami's cookieless visitor count uses a daily-rotating hash, so cross-day retention isn't measurable by visitor. The streak and days-since-first-chart buckets carry that signal without any identifier.

## Verification

Unit tests (buckets, allowed()); `usage-counts.spec.ts` (events, keys, PII guard, cookies, opt-out, GPC); full E2E with the stub in all looks; default build contains no analytics reference; `pnpm verify`.

## As built

- **`peekStore()`** (store.ts) — found by the full E2E run: `loadStore()` runs the legacy migration when no store exists, and that migration *saves* an empty document. Page views run on every screen, including right after "Delete my data", so counting recreated the store the reader had just erased (both delete E2E flows failed in every look). `peekStore()` reads without migrating or writing; `loadStore()` is now `peekStore() ?? migrateLegacyStore()`, and the analytics gateway reads only `peekStore()`. Unit test "never creates a store just by checking".
- The Settings switch lives in its own `components/settings-usage-counts.tsx` (Settings was already past ~200 lines), like `settings-look-section.tsx`.
- `look-chosen` from Settings fires only when the look actually changes.
- The E2E "no identifiers" check asserts every local/session storage key starts with `daymaster.` (the streak key is written by Today itself, not by counting).
- The three copies of the unit tests' `FakeStorage` became `src/lib/testing/fake-storage.ts` before a fourth was added.
- `apps/web/CLAUDE.md` no longer says "no runtime network calls" without the exception.
- An image share dismissed at the share sheet now returns `"dismissed"` from `shareChartCard` and is not counted; before, it returned `"shared"`, which would have overcounted `chart-shared` (the link path already skipped dismissals). The reader sees no difference.

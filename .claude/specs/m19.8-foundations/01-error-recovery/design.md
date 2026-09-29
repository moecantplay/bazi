# Design — Recover from a broken screen

## Approach

- `app/error.tsx` (client): Next's segment error boundary for everything under the root layout, so fonts, the pre-paint theme/look script and the service worker stay in place. Renders `RecoveryScreen` with Next's `reset`.
- `app/global-error.tsx`: the last-resort boundary if the root layout itself throws. It must render its own `<html>`/`<body>`, imports `globals.css`, and renders the same `RecoveryScreen`.
- `components/recovery-screen.tsx`: a full-viewport column in the onboarding frame's shape (display title, helper line, stacked buttons) — base tokens and `Button` only, so the looks and themes restyle it for free.
  - **Try again** → `reset()`.
  - **Download my data** → shared `downloadBackup()` helper (moved from `settings-content.tsx` into `lib/backup.ts` so both screens use one path). Shown only when `serializeBackup()` returns a file; wrapped so a failure to serialize hides the button rather than throwing inside the boundary.
  - **Start over** → confirm step ("This erases your chart…" — Settings' wording) → `deleteAllData()` → `window.location.assign("/onboarding/")`. A hard navigation, not `router.replace`, so no half-broken client state survives.
- Copy: title "This screen didn't open"; helper "Something in the saved data or the app stopped it. Your chart is still on this device."

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/error.tsx` | New |
| `apps/web/src/app/global-error.tsx` | New |
| `apps/web/src/components/recovery-screen.tsx` | New |
| `apps/web/src/lib/backup.ts` | `downloadBackup()` moved here from Settings |
| `apps/web/src/components/settings-content.tsx` | Uses `downloadBackup()` |
| `apps/web/e2e/error-recovery.spec.ts` | New |

## Alternatives considered

- **Validate the profile deeply in `loadStore()` and treat a bad one as absent** — would silently send a reader with a damaged chart back to onboarding and lose their people and journal. The boundary keeps the choice with the reader.
- **A boundary component inside `ProfileGate`** — misses errors outside gated screens (onboarding, compare form); Next's file convention covers every route.

## Risks

- `reset()` re-renders with the same data, so "Try again" only helps transient errors. That's why the screen also offers the two data actions.

## Verification

`pnpm verify`; `e2e/error-recovery.spec.ts` in all three looks; screenshots look × theme; live static export shows no console errors on healthy screens.

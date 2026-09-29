# Design — Share links keep birth details off the server

## Approach

- `share-link.ts`: `buildShareUrl` writes `#share=`. New `readSharePayload(location)` returns the fragment's `share` value, falling back to the query's (legacy links).
- `onboarding/page.tsx`: intake uses `readSharePayload(window.location)`; its existing `history.replaceState(null, "", "/onboarding/")` already clears both parts on a fresh device. The compare path uses `router.replace("/compare")`, which drops both too.
- The service worker is unaffected: fragments never reach `fetch`.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/share-link.ts` | Fragment form; `readSharePayload` |
| `apps/web/src/app/onboarding/page.tsx` | Intake via `readSharePayload` |
| `apps/web/src/lib/store.ts` | Comment names both forms |
| `apps/web/e2e/share.spec.ts` | Fragment form, legacy form, cleared address bar |

## Alternatives considered

- A short opaque ID — needs a server (M21).
- Dropping `?share=` support — breaks links people have already sent.

## Risks

Some chat apps trim fragments when they unfurl links. The link still opens: the payload is read client-side, and an unfurl preview never included the chart anyway.

## Verification

Share E2E (new, legacy, cleared bar) in all looks; `pnpm verify`.

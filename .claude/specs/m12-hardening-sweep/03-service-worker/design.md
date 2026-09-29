# Design — Self-versioning service worker

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 SW entry, commit `e00a173`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

`scripts/generate-sw.mjs` runs postbuild and injects the precache list and a content-hash version into `out/sw.js`.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/scripts/generate-sw.mjs` | generator |
| `apps/web/public/sw.js` | template |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E offline.

## Decisions

- 2026-07-08 Service worker is build-finalized: generate-sw.mjs (postbuild) injects the precache list and a content-hash cache version. Never hand-bump a version. Updates install-and-wait; only a user-accepted Refresh may reload (clients.claim on first install fires controllerchange too — guard stays).

# Design — Retire the legacy screens and the trial

## Approach

Deletion in small commits, each green on its own, so a failure points at one removal.

1. **Rehome `hourBlocks`** (and `currentHourBlockIndex` if anything live uses it) into `presentation/src/hour-blocks.ts`, with its tests moved beside it. Welcome-sample tests stay untouched.
2. **Conditions out.** Delete the route, `components/conditions/`, `condition-icon-paths.ts`, `use-day-progress.ts`, `conditions-screen.ts` and its test, and `e2e/conditions.spec.ts`. `/conditions/` becomes a static page that replaces itself with `/today/`, the same way the root page sends readers on, so installed PWAs and bookmarks don't 404.
3. **Legacy Trail out.** Delete `map-hero.tsx`, `signpost.tsx`, `trail-signs.tsx`, `compass-mark.tsx`, `datebar.tsx`, `legend-tags.tsx`; drop `ROUTE_TOPIC` and its entry; update the comments that cite them (`button.tsx`, `bottom-nav.tsx`, `luck-timeline.tsx`, `activity-terrain.tsx`, `date-results.tsx`, two E2E headers).
4. **Reachability check.** A vitest test (`apps/web/src/orphans.test.ts`, so `pnpm verify` runs it with no wiring) walks imports from every `app/**` route file and fails on any unreached module under `src/` (tests and `lib/testing/` excepted). It keeps this from growing back. Exports a live file no longer needs (the terrain plot, the stepper's long date, the seal's CompassMark exports) are removed by hand alongside.
5. **Cycles / Compare** per the owner's answers: the same pattern as Conditions.
6. **Full E2E** (every look × theme), then deploy and the live check.
7. **Trial:** `git tag archive/trial-reshape trial/reshape`, push the tag, delete the branch; `vercel alias rm daymaster-trial.vercel.app`.
8. **Docs:** M24 README, DESIGN.md mentions of the legacy composition, `decisions.md` row if Cycles or Compare retire.

## Alternatives considered

- **One big deletion commit.** Rejected: if E2E goes red, nothing says which removal unmasked it.
- **Leave `/conditions/` to 404.** Rejected: the installed PWA's precache and old bookmarks would show a dead page; a one-line redirect page costs nothing.
- **Use a dependency tool (knip) for orphans.** Rejected for now: a new dependency for one check; a 40-line script over the `@/` imports covers it.

## Risks

- A deleted file was quietly holding up something live (CSS classes, a shared constant). The per-step commits and full E2E catch it; the reachability script lists what's reached before deleting.
- The service worker precaches the old routes; the build-finalized SW (m12/03) drops them on the reader's next accepted Refresh.

## Verification

`pnpm verify` (with the orphan check) per step; full E2E × look × theme after the last deletion; deploy; live-app check of every tab, Settings, onboarding and the `/conditions/` redirect, both themes.

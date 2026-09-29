# Look preference: store, pre-paint and component switch

Status: done · Milestone: M19.9 · Ticket: 03

## Problem

The app has one appearance axis, `theme` (`apps/web/src/lib/store.ts:49`, stamped as `data-theme` by `applyThemePreference` and a pre-paint script in `app/layout.tsx`). There is no way to hold or apply a look, and no pattern for rendering a different composition per look.

## Goal

A persisted `look` preference (`"trail" | "almanac" | "dial"`) applied before first paint, readable by components, synced with the rest of the store later.

## Requirements

- **R1.** `DaymasterStore` gains `look: LookPreference`; old stores migrate without a version bump if the field is additive, else v3 with a migration and backup-envelope support.
  - Acceptance: store and migration unit tests; `store-migration.spec.ts` covers a store without `look`.
- **R2.** `data-look` is stamped on `<html>` before first paint, like `data-theme`.
  - Acceptance: E2E: no flash of the wrong look on reload (screenshot at first paint).
- **R3.** ~~A `useLook()` hook and a `<LookSwitch />` helper~~ **Moved to 05 (2026-09-29):** nothing renders per look until Today does, so building them here would ship dead code. What this ticket guarantees instead: `data-look` is always present on `<html>`, so look-keyed CSS works from day one.
  - Acceptance: E2E asserts `data-look` on every route; `useLook`/`LookSwitch` land with their first consumer in 05.
- **R4.** Existing users (store without `look`) get a default without being forced through onboarding again.
  - Acceptance: E2E: seeded old store opens Today in the default look.
- **R5.** E2E can run any spec under a look (`seedStore({ look })`).
  - Acceptance: `seedStore` already merges any field, so no new helper was needed; `look-preference.spec.ts` uses it.

## Out of scope

The choice UI (04). Any screen's per-look design (05–10).

## Open questions

- [x] Default look for existing users who never pick one: **A, `trail`** (owner approved the recommendation, 2026-09-29).
- [x] Should existing users see a one-time 'Choose your look' prompt on next open? **Moved to 04**, which owns the choosing UI.

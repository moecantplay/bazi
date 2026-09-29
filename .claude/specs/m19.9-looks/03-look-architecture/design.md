# Design — Look preference: store, pre-paint and component switch

## Approach

Mirror the theme path:

- `store-types.ts`: `LookPreference = "trail" | "almanac" | "dial"` (stable ids, not letters; the names users see are decided in 02/04) and `parseLookPreference`.
- `store.ts`: `look` is an **additive v2 field**, exactly like `journal`: no version bump, no migration step. `loadStore` fills it with `DEFAULT_LOOK` (`"trail"`) when absent or unknown, so old stores, old backups and legacy migrations all read complete. `loadLookPreference` / `applyLookPreference` / `saveLookPreference` mirror the theme trio.
- `layout.tsx`: the server HTML carries `data-look="trail"`; the pre-paint script (renamed `PREFERENCES_INIT_SCRIPT`, it now does theme and look) overwrites it only for a stored `almanac`/`dial`. So the default never changes at hydration, and a chosen look is on `<html>` by DOMContentLoaded.
- Backup: the envelope is the store, so `look` rides along with no code change; a pre-look backup restores as `trail`.

`useLook()` and `LookSwitch` are deferred to 05 (see requirements R3).

## Changes

| Area | Change |
| --- | --- |
| `lib/store-types.ts` | `LookPreference`, `parseLookPreference` |
| `lib/store.ts` | additive `look` field, `DEFAULT_LOOK`, load/apply/save |
| `app/layout.tsx` | `data-look` default on `<html>`; pre-paint script stamps a stored look |
| `lib/store-look.test.ts` | new: defaults, old store, unknown value, save, old backup |
| `e2e/look-preference.spec.ts` | new: look at parse time, reload, old store, unknown value |

## Alternatives considered

Look in the URL or a cookie: static export has no server, and the store is the sync payload. React context only: flashes the default look before hydration.

## Risks

The store is the future sync payload (M21); a field added now is permanent API. Keep the union small and string-typed.

## Verification

`pnpm verify`; store migration E2E; reload-without-flash check in both themes.

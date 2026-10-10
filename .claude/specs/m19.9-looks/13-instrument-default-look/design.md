# Design — Instrument is the default look

## Approach

Change the one constant, then close the two places where "default" meant "Explorer": the pre-paint script's non-default check, and (if the owner picks (a)) how a never-chosen look is read. No store shape change: `look` and `lookPromptSeen` already exist.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store.ts` (R1, R3) | `DEFAULT_LOOK = "dial"`. With (a): when parsing, a store with `lookPromptSeen !== true` reads `look` as `DEFAULT_LOOK`, whatever it holds, because it was never a choice. With (b): no parse change. |
| `apps/web/src/app/layout.tsx` (R2, R3) | `PREFERENCES_INIT_SCRIPT` stamps `parsed.look` when it is any valid look other than the default, so `trail` is now included. With (a), it stamps only when `parsed.lookPromptSeen === true`. The doc comment notes that it mirrors `store.ts` and the two must stay in sync. |
| `apps/web/src/components/onboarding/draft.ts` (R1) | No change. It reads `DEFAULT_LOOK`, so the look step preselects Instrument. |
| Tests (R1–R3) | `store-look.test.ts`: the default becomes `dial`, plus a case for the never-chosen store. `e2e/look-preference.spec.ts`: the empty case expects `dial`, plus a seeded-`trail` case read at first parse. |
| Docs (R4) | DESIGN.md line 12; a row in `decisions.md`. |
| Deploy (R5) | `pnpm --filter @daymaster/web build`, then `cd apps/web/out && vercel link --yes --project daymaster --scope gervin-sean-mirandas-projects && vercel deploy --prod --yes`, then check production's `last-modified` and the live look. |

## Alternatives considered

- **Rewrite stored looks with a migration** (set `look: "dial"` wherever `lookPromptSeen` is false). It does the same as reading-time (a), but it writes to readers' stored data and to the future sync payload. The reading-time rule is reversible and touches nothing on disk.
- **Leave the pre-paint script alone and let React switch the look after hydration.** It's simpler, but it flashes the wrong look on every load for Explorer readers, which M19.9-03 was built to prevent.

## Risks

- **The pre-paint script and `store.ts` drift apart.** Mitigation: the E2E first-parse check (R2) fails if they disagree.
- **E2E seeds that rely on the default.** Seeded stores set `look` from `E2E_LOOK` and `lookPromptSeen: true` (`e2e/helpers.ts:77–79`), so they're unaffected. Specs that seed without `lookPromptSeen` (look-picker) are reviewed one by one.

## Verification

- `pnpm verify` green.
- Full E2E with `E2E_LOOK=trail|almanac|dial`.
- On production after deploy:
  - a fresh browser onboards into Instrument;
  - a restored backup with Explorer chosen opens in Explorer with no flash;
  - light and dark.

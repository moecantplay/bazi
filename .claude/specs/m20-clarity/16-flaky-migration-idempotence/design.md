# Design — Flaky migration idempotence test

## Approach

Have `saveStore` return the document it wrote (or have `migrateLegacyStore` re-read after saving) so the returned value equals disk. Pin time in the test with `vi.useFakeTimers()` + an advancing clock to prove it.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store-migration.ts` | return the persisted document |
| `apps/web/src/lib/store-migration.test.ts` | deterministic clock |

## Alternatives considered

Loosen the assertion to ignore `updatedAt`: hides a real (small) divergence between return value and disk.

## Risks

`saveStore` return type is used for success checks elsewhere; changing it touches callers. Re-reading avoids that.

## Verification

Loop the test 200×; `pnpm verify`.

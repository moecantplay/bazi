# Design — Ask the browser to keep our data

## Approach

`lib/persist-storage.ts` exports `requestPersistentStorage(manager = navigator.storage)`: returns early when the manager or `persist` is missing; awaits `persisted()`; calls `persist()` only when false; swallows rejections (a refusal is an answer, not an error). `ProfileGate` calls it fire-and-forget once it has confirmed a profile — the one choke point every gated screen passes, right after onboarding saves the first chart.

Chrome and Safari decide without prompting. Firefox may show a one-time permission prompt and remembers the answer, so calling on each load doesn't nag.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/persist-storage.ts` | New |
| `apps/web/src/lib/persist-storage.test.ts` | New |
| `apps/web/src/components/profile-gate.tsx` | Calls it after a profile is confirmed |
| `apps/web/e2e/durable-storage.spec.ts` | New (spy via init script) |

## Alternatives considered

- Asking during onboarding with explanatory copy — a UI change; and no browser but Firefox shows anything anyway.
- Moving the store to IndexedDB — same eviction rules; no gain.

## Risks

None material: the call is advisory.

## Verification

Unit tests; E2E spy; `pnpm verify`.

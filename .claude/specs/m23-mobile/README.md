# M23 — Mobile (Expo → App Store + Play Store)

Not started. Blocked on M22. Informed by M20-15 (Expo spike).

## Goal

Native iOS and Android apps sharing the engine, content and presentation packages unchanged, with parity to web.

## Source

Converted 2026-09-29 from `PLAN.md` (where this was M22, approved 2026-07-29 as part of the v2 arc) and `docs/discussion-2026-07-23-rewrite-and-roadmap.md`. Renumbered because M20 Clarity runs first.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Expo app with screen parity](01-expo-app-parity/requirements.md) | draft | — |
| 02 | [In-app purchases via RevenueCat](02-revenuecat/requirements.md) | draft | 01 |
| 03 | [Daily reminder notifications](03-push-reminders/requirements.md) | draft | 01 |
| 04 | [Store readiness](04-store-readiness/requirements.md) | draft | 01, 02, 03 |

## Exit criteria

- Both apps approved in their stores.
- Screen parity with web.
- Purchases map onto the same entitlements as web.
- CI builds both platforms; Maestro smoke flows green.

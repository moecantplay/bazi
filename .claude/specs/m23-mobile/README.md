# M23 — Mobile (Expo → App Store + Play Store)

Not started. Blocked on M22. Informed by M20-15 (Expo spike).

## Goal

Native iOS and Android apps sharing the engine, content and presentation packages unchanged, with parity to web.

## Source

Converted 2026-09-29 from the old plan (`_sources/plan.md`) (where this was M22, approved 2026-07-29 as part of the v2 arc) and [the roadmap discussion](../m18-design-reset/research/discussion-rewrite-and-roadmap.md). Renumbered because M20 Clarity runs first.

**2026-10-10 ([M24-01](../m24-reshape/01-decisions-and-foundation-specs/design.md)):** the Expo spike moves here from M20 as the first ticket, M23-00, to be drafted when M23 starts. Its draft is [M20-15](../m20-clarity/15-expo-spike/requirements.md).

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

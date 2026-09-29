# M22 — Subscriptions (web first)

Not started. Blocked on M21.

## Goal

A paid tier on web whose entitlements the mobile apps will reuse, with a free tier that stays a complete product.

## Source

Converted 2026-09-29 from the old plan (`_sources/plan.md`) (where this was M21, approved 2026-07-29 as part of the v2 arc) and [the roadmap discussion](../m18-design-reset/research/discussion-rewrite-and-roadmap.md). Renumbered because M20 Clarity runs first.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Free / paid split](01-free-paid-split/requirements.md) | draft | — |
| 02 | [Stripe and entitlements](02-stripe-entitlements/requirements.md) | draft | 01 |
| 03 | [Paywall UI](03-paywall-ui/requirements.md) | draft | 02 |

## Exit criteria

- A user can subscribe, manage and cancel on web; entitlements flip within a minute of the webhook.
- Free tier is complete: daily reading and chart never gated.
- `pnpm verify`, E2E and a live check green.

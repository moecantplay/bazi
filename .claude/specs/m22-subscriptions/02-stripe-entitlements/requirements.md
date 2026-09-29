# Stripe and entitlements

Status: draft · Milestone: M22 · Ticket: 02

## Problem

No payments or entitlements.

## Goal

Stripe checkout and customer portal on web, entitlements recorded server-side and cached on the client for offline grace.

## Requirements

- **R1.** Checkout and customer portal.
- **R2.** Webhook writes the `entitlements` row; the only source of truth.
  - Acceptance: E2E with Stripe test mode.
- **R3.** Client caches entitlement with an offline grace period.

## Out of scope

App-store purchases (M23).

## Open questions

- [ ] Offline grace length (proposal: 7 days).

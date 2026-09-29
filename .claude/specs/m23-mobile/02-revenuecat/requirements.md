# In-app purchases via RevenueCat

Status: draft · Milestone: M23 · Ticket: 02

## Problem

App stores require their own purchase systems.

## Goal

Apple/Google subscriptions map onto the M22 entitlements record.

## Requirements

- **R1.** RevenueCat configured for both stores.
- **R2.** RevenueCat webhook writes the same `entitlements` row as Stripe.
- **R3.** A web subscriber is recognised on mobile and vice versa.
  - Acceptance: E2E/sandbox test.

## Out of scope

Promotional offers.

## Open questions

- [ ] None.

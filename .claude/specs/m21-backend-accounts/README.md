# M21 — Backend + accounts (local-first sync)

Not started. Blocked on M20.

## Goal

Accounts and cross-device sync without breaking the offline, signed-out app. Readings are computed on-device forever; the backend is identity, sync and entitlements only. The signed-out app stays fully functional; an account never gates the core.

## Source

Converted 2026-09-29 from `PLAN.md` (where this was M20, approved 2026-07-29 as part of the v2 arc) and `docs/discussion-2026-07-23-rewrite-and-roadmap.md`. Renumbered because M20 Clarity runs first.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Entry decisions](01-entry-decisions/requirements.md) | draft | — |
| 02 | [Infrastructure and schema](02-infra-schema/requirements.md) | draft | 01 |
| 03 | [Sign-up, sign-in, sign-out](03-auth/requirements.md) | draft | 02 |
| 04 | [Store sync](04-sync/requirements.md) | draft | 03 |
| 05 | [Account deletion and export](05-account-deletion-export/requirements.md) | draft | 04 |

## Exit criteria

- Sign in on two devices and see the same profile, people and journal.
- The app still works fully offline and signed out.
- Deleting an account deletes server and local data, and says what it erased.
- `pnpm verify`, E2E (including two-device sync) and a live check green; staging before production.

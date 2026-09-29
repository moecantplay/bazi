# Design — Account deletion and export

## Approach

Server delete is a single transaction across user, documents and entitlements; client clears store and streak after the server confirms.

## Changes

| Area | Change |
| --- | --- |
| API | DELETE account |
| `features/settings/` | Delete + export flows |

## Alternatives considered

Soft delete: contradicts "deletion is deletion".

## Risks

Partial failure (server deleted, client not); client retries local clear on next open.

## Verification

E2E for delete, export and legacy migration.

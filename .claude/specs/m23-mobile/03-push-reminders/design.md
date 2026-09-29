# Design — Daily reminder notifications

## Approach

Expo local notifications scheduled on device; server push only if a later feature needs it.

## Changes

| Area | Change |
| --- | --- |
| `apps/mobile` | Notification settings + scheduling |
| content | Reminder copy |

## Alternatives considered

Server-sent push: more infra than a daily local reminder needs.

## Risks

Notification fatigue; one per day maximum.

## Verification

Device test both platforms.

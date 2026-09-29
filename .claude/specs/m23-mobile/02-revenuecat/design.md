# Design — In-app purchases via RevenueCat

## Approach

Server stays the only source of truth; RevenueCat is another writer to it.

## Changes

| Area | Change |
| --- | --- |
| API | RevenueCat webhook |
| `apps/mobile` | Purchase flow |

## Alternatives considered

Separate entitlements per platform: users would pay twice.

## Risks

Store review rules on mentioning web pricing inside the app.

## Verification

Sandbox purchases both stores; cross-platform recognition.

# Design — Sign-up, sign-in, sign-out

## Approach

Provider SDK behind a thin `lib/account/` module so M23 can reuse the same flows.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/account/` | Session wrapper |
| `apps/web/src/features/settings/` | Account section |

## Alternatives considered

Account-first onboarding: violates local-first.

## Risks

Service worker caching auth responses; exclude auth routes from precache.

## Verification

E2E: sign up, sign out, sign in, offline.

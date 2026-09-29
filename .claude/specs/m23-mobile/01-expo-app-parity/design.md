# Design — Expo app with screen parity

## Approach

Mirrors ticket M20-05's feature layout so web and mobile folders match one-to-one.

## Changes

| Area | Change |
| --- | --- |
| `apps/mobile/` | New app |
| CI | EAS or local builds |

## Alternatives considered

React Native Web as the single app: decided against unless M20-15 says otherwise.

## Risks

Hermes `Intl` gaps (M20-15 R2).

## Verification

Maestro flows; golden fixtures on device.

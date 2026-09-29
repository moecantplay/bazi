# Design — Choose your look: onboarding step and Settings option

## Approach

Add a `LookStep` before `RevealStep`, bumping the gathering count. Previews render the Today hero of each look at ~0.4 scale inside a card, `inert` and `aria-hidden`, with a labelled radio group for the actual choice. Settings reuses the same `LookPicker`.

## Changes

| Area | Change |
| --- | --- |
| `components/onboarding/look-step.tsx` | new |
| `components/look-picker.tsx` | new, shared |
| `app/onboarding/page.tsx` | step order |
| `components/settings-content.tsx` | Look section |

## Alternatives considered

Static preview images: can't follow terrain/theme and go stale. A segmented control with names only: users can't judge a look by its name.

## Risks

Rendering three Today heroes at once on a low-end phone. Mitigation: previews are static renders (no motion), lazy after first paint.

## Verification

`pnpm verify`; onboarding and settings E2E per look; live-app check.

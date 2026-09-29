# Design — Choose your look: onboarding step and Settings option

## Approach

One shared picker, used in three places, over the look plumbing from 03/05 (`saveLookPreference`, `data-look`, `useLook`).

- **`LookPicker`** (`components/look-picker.tsx`): a radio group of three previews, `size="large"` (onboarding: snap carousel, 214px cards with a one-line description) or `size="small"` (Settings and the note: three tiles in a row). The chosen card gets an inset ink ring and a check; the button label says what it will do ("Continue with Editorial", "Use Editorial", "Keep Explorer").
- **Live previews** (`components/look-preview.tsx`, R3): each preview renders that look's **hero only** (Explorer's `RouteHero`, Editorial's `PosterField` + headline, Instrument's `WeekRings` + `DayDial`) from a pure preview screen (`todayScreenModel(profile, today, today)` with the live clock and no-op handlers — no streak write, no terrain stamp), scaled into the card, `inert` and `aria-hidden` (the radio's label carries the name and description). Heroes, not whole Todays, keep three previews cheap. `RouteHero`'s SVG mask id moves to `useId` so two routes can share a page.
- **Onboarding** (R1): a `LookStep` between Sex and the reveal (`GATHERING_STEPS` 5 → 6, six progress dots). The draft carries `look` (default `trail`, restored like the other fields). The preview uses the draft's birth details, so it shows *their* day. The reveal's save path writes the profile, the look and `lookPromptSeen: true` together, and applies the look before the reveal renders.
- **Settings** (R2): a **Look** section under Appearance with `LookPicker size="small"`; a tap saves and applies at once (Today follows via `useLook`, no reload).
- **Existing users** (R5): a new additive store field `lookPromptSeen` (like `journal` and `look`: absent reads as `false`). Today shows `LookIntroSheet` when a profile exists and `lookPromptSeen` is false: a bottom sheet in the house sheet pattern (40% scrim, grab handle, Escape and scrim close = "keep"), kicker "New", title "Your day, three ways", the small picker, primary "Keep Explorer" / "Use {look}", and "Not now, keep Explorer" once another look is picked. Any answer or dismissal sets `lookPromptSeen: true`. Onboarding sets it too, so new users never see it.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store.ts`, `store-types.ts` | additive `lookPromptSeen`; `saveProfile` accepts the chosen look |
| `apps/web/src/components/look-picker.tsx`, `look-preview.tsx` | new |
| `apps/web/src/components/onboarding/look-step.tsx`, `draft.ts`, `app/onboarding/page.tsx` | new step before the reveal |
| `apps/web/src/components/settings-content.tsx` | Look section |
| `apps/web/src/components/today/look-intro-sheet.tsx`, `today-view.tsx` | one-time note |
| `apps/web/src/components/looks/trail/route-hero.tsx` | mask id via `useId` |
| `apps/web/e2e/` | onboarding per look, Settings switch, one-time note; seeded stores default `lookPromptSeen: true` |
| `foundation/DESIGN.md` | §Shared surfaces: the look picker; §Layout: the onboarding step |

## Alternatives considered

- **Screenshots as previews**: can't follow the person's terrain, theme or day; rejected in R3.
- **Whole-Today previews**: three full reading renders per screen for a thumbnail that shows only the top; heroes carry the difference.
- **A banner instead of a sheet for existing users**: easy to miss and stays on screen; the owner asked to *inform* them, once.

## Risks

- Previews duplicate data hooks (`data-headline`) inside Settings and the note; E2E locators scope to `main`'s look composition or the sheet explicitly.
- Onboarding restore: a draft saved before this ticket has no `look`; it restores as `trail`.

## Verification

`pnpm verify`; `pnpm e2e:looks`; contrast on the rendered step, Settings and sheet in both themes; live app on device.

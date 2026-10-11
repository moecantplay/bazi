# Design — Navigation and Settings in the header

## Approach

Apply the trial's navigation (commits c024283, 6c23837, c138ce5) to main. M20-24 has since changed main's Today headers, so the gear joins the tone phrase rather than replacing a label.

## Changes

| Area | Change |
| --- | --- |
| `components/bottom-nav.tsx` (R1) | Four tabs with the trial's icons. Each tab has a `matches` list (Ahead: `/ahead`, `/dates`; You: `/you`, `/chart`; People: `/people`, `/compare`). **Changed from the trial:** People also lights for `/compare`, its leaf screen. |
| `components/settings-gear.tsx` (R2) | A new link to `/settings/`, drawn as tune sliders (the old Settings tab icon). |
| `components/app-shell.tsx` (R2, R3) | Non-bleed tab screens render the gear in the title row. `back` screens get Back and no gear. |
| Today heroes (R2, R7) | `looks/trail/route-hero.tsx`: the top row holds date, then tone, then gear. `looks/dial/today-instrument.tsx`: the same. `looks/almanac/poster-field.tsx`: the gear sits beside the date nav. Route hero and poster take `showSettings` (default true); `look-preview.tsx` passes false. |
| `app/settings/page.tsx`, `app/chart/page.tsx`, `app/compare/page.tsx`, `app/cycles/page.tsx` (R3) | `back`, with the new titles. |
| `components/settings-content.tsx`, `settings-look-section.tsx` (R4, R5) | Drop the Conditions block. The toggles move under "How your chart is counted". The look section becomes "Look for Today". |
| `app/onboarding/page.tsx` (R6) | The share redirect goes to `/people`. |
| E2E (R1–R7) | A new `navigation.spec.ts`. Specs that navigate by the old tabs, or expect the old titles or the share landing, are updated (the trial's E2E changes are the reference). |

## Alternatives considered

- **Keep Settings as a fifth tab.** It's a place you visit, not a daily destination (proposal §4). The owner lived with the gear.

## Risks

- **Many E2E specs navigate by tab name.** They're updated in this ticket, and the full suite runs in every look.
- **A crowded Today top row.** The tone truncates before it can collide with the gear. Checked at 390px in all looks and both themes.

## Verification

- `pnpm verify`.
- Full E2E with `E2E_LOOK=trail|almanac|dial`.
- Screenshots of Today (3 looks × 2 themes) and of You, Ahead, People and Settings.
- Deploy to production, then a live check of the tabs, Settings and its Back.

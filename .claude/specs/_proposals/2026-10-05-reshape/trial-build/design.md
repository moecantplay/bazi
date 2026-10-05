# Design — Reshape trial build

## Approach

Build the trial as a thin layer over the existing screens: re-route, re-order and wrap them rather than rewrite them. The point is to feel the direction, so effort goes where the reader will notice it: navigation, onboarding, the first screen of each tab, and the plain leads. Anything below a lead reuses what the app already renders.

Branch `trial/reshape` off `main`. It is never merged: if the direction is approved, the M24 tickets rebuild each piece properly, using the trial as a reference. If it isn't, the branch is deleted.

New trial-only wording goes in `packages/content/src/banks/trial/`, so it is easy to find and judge on its own. It follows VOICE.md: everyday words, no system terms in leads or cards.

## Changes

| Area | Change |
| --- | --- |
| Nav (R2) | `components/bottom-nav.tsx`: four tabs (`/today`, `/ahead`, `/you`, `/people`). `components/app-shell.tsx`: a gear link to `/settings/` in the header of tab screens; Settings renders with `back`. |
| Routes (R2, R5–R7) | New `app/ahead/`, `app/you/`, `app/people/`. `/chart/` stays as the "Your chart in full" page (rendered with `back`). `/cycles/`, `/compare/` and `/conditions/` stay in the build but no link leads to them. |
| Settings (R2) | `components/settings-content.tsx`: remove the "Try a different rhythm → Conditions" block; label the look section "Look for Today". |
| Onboarding (R3) | `app/onboarding/page.tsx`: a `WelcomeStep` before `DateStep`. Drop `LookStep` and `RevealStep`. `SexStep` gains the one-line reason and takes over `DisclaimerStep`'s text and checkbox. `GATHERING_STEPS` 6 → 4. Saving routes to `/today/`. The look stays at its default (`trail`). |
| Welcome sample (R3) | Uses only chart-free facts: the day's officer (`conditionDays` gives `officerName`, its everyday gloss and its activities) and its almanac activities. No natal interactions and no "you" as a chart holder (M20-18's answer). |
| Today (R4) | `components/today/today-date-nav.tsx` and each look's hero: drop the day-pillar label. `components/today/today-footer.tsx`: drop the Find a day and "How this reading works" links. A `FirstDayBanner` (seal + one portrait line from the day-master bank) shows when the profile's `createdAt` date equals the displayed date in the reading zone. |
| Ahead (R5) | `components/ahead/ahead-view.tsx`: a segmented control holding the active view in local state.<br>**10 days:** `conditionDays()` mapped to plain tone words plus the activity, and a link to `/dates/`.<br>**Month, Year, Decade:** `monthlyReadingFor`, `annualReadingFor` and the luck-pillar reading give the period's facts. A new `periodLead(facts, seed)` in `packages/content` picks the strongest fact with the same severity order as `chooseLead`: interaction, then ten-god, then element. It returns headline, body and one thing to try from `banks/trial/period-leads.ts`, keyed by interaction × life area (or ten-god). Wording stays scope-neutral ("this stretch") so one entry serves month, year and decade. The other facts render as cards using `INTERACTION_CARDS` (period-neutral titles) and the existing element and ten-god glosses. |
| You (R6) | `components/you/you-view.tsx`: the day-master bank's portrait as the lead. Cards come from `banks/trial/you-cards.ts`, keyed by strength verdict, balance shape and favourable elements; the rooms line reuses the existing natal line. Patterns and stars show as counts linking to `/chart/`. Then a "Your chart in full" link and share. |
| People (R7) | `components/people/people-view.tsx`: the saved-people list (store `people`), an "Add someone" button opening the existing `CompareForm`, and for the active person a lead from `banks/trial/pair-leads.ts`, keyed by the day-master relation (same, you feed, they feed, you steer, they steer). `compareBundleFor` facts render as cards via `INTERACTION_CARDS`, worded for two people. |
| Tests | Content: the leads (R5–R7) use no system terms, using the term list from M20-21's R10 test; same input gives the same output. E2E: update `onboarding-to-chart`, nav and compare specs for R2, R3 and R7; add an Ahead smoke spec. |
| Deploy (R1, R8) | `pnpm --filter @daymaster/web build`, then `cd apps/web/out && vercel link --yes --project daymaster --scope gervin-sean-mirandas-projects && vercel deploy --yes`. **No `--prod`.** Check that production's `last-modified` is unchanged. |

## Alternatives considered

- **Clickable canvas prototype.** It's fast, but it shows one fixed day, so the owner can't live with it. The owner chose a real build.
- **Plain voice on every card.** It gives a truer read of the voice, but takes much longer before the owner can start. The owner chose leads only.
- **A feature flag on production.** It would avoid a second origin, but it ships trial code to every reader, and to `main`. A preview branch keeps production clean.

## Risks

- **Separate origin, separate storage.** The preview starts empty. Mitigation: the hand-off note says how to back up from production (Settings → Download my data) and restore on the preview's Welcome screen.
- **Vercel deployment protection.** Preview deploys may require a Vercel login. If the owner's phone isn't signed in, it gets a login wall. Mitigation: check after deploying, and tell the owner rather than changing project settings.
- **Old-voice content below the leads.** Cards on Ahead, You and People reuse existing glosses, and some still carry system terms from the old voice. That's expected for the trial. The hand-off note says which parts are final-shape and which are placeholder, so the owner judges structure, not wording.
- **Service worker.** The preview registers its own worker on its own origin; production's worker is unaffected.

## Verification

- `pnpm verify` green on `trial/reshape`.
- E2E green for onboarding, nav, Ahead and People, in all three looks for Today.
- A live check of the preview on a phone-sized viewport in light and dark: onboarding from empty, all four tabs, Settings via the gear, a person added.
- Production `last-modified` unchanged; `git log main` has no trial commits.

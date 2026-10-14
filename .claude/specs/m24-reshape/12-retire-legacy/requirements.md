# Retire the legacy screens and the trial

Status: draft · Milestone: M24 · Ticket: 12 · Carries [M19.9-11](../../m19.9-looks/11-retire-trail-and-ship/requirements.md) and the retirements deferred by M24-04, 07, 09, 13 and 15; needs owner approval (deletions)

## Problem

Trial parity shipped on 2026-10-11, but the screens and components it replaced are still in the build:

- **Conditions** (`app/conditions/page.tsx`, `components/conditions/` (5 files), `lib/condition-icon-paths.ts`, `lib/use-day-progress.ts`, `presentation/src/conditions-screen.ts`, `e2e/conditions.spec.ts`). Nothing has linked to it since M24-04 (decision D4: its hours went to Today, its ten days to Ahead). `welcome-sample.ts` (onboarding) still imports `hourBlocks` from `conditions-screen.ts` (M24-05 design).
- **The legacy Trail composition**: `map-hero.tsx`, `signpost.tsx`, `trail-signs.tsx`, `compass-mark.tsx`, `datebar.tsx`, `legend-tags.tsx`, and content's `ROUTE_TOPIC` glossary entry. A reachability sweep from every live page (2026-10-14) finds them used only by Conditions or by nothing. Together with Conditions that's about 1,300 lines in `apps/web` alone.
- **Cycles** (`/cycles/`) is still reached from Ahead's decade view ("Your decades, the old way", `ahead/period-zooms.tsx:202`), kept "until M24-12" by M24-07.
- **Compare** (`/compare/`) is still reached from People ("the full comparison is one tap away", `people/people-view.tsx:99`), kept "until M24-12" by M24-09.
- **The trial**: branch `trial/reshape` (local only, never merged) and its preview at `daymaster-trial.vercel.app`, kept "until ticket 12 ships" (M24 README).

`/chart/` (behind You, "Your chart in full", D5) and `/dates/` (behind Ahead's Plan something) are live screens and stay.

## Goal

The build holds only what the four tabs, Settings and onboarding reach, and the trial is archived.

## Requirements

- **R1. Conditions is gone, and a visit to `/conditions/` lands on Today.**
  - `hourBlocks` moves to a live module before `conditions-screen.ts` is deleted; onboarding's sample is unchanged.
  - Acceptance: no `conditions` route, component or spec remains; the welcome-sample tests pass unchanged; an E2E visit to `/conditions/` ends on `/today/`.
- **R2. The legacy Trail composition is gone.** Every component, hook and content entry no live page reaches is deleted, with comments that name them updated.
  - Acceptance: a reachability check (script or test) from every page finds no orphan in `apps/web/src`; `ROUTE_TOPIC` and its entry are gone.
- **R3. Cycles and Compare are retired or kept, as the owner decides** (open questions). If retired, the links to them go, a visit lands on the tab that replaced them (Ahead, People), and any engine, content or presentation code only they used is deleted.
  - Acceptance: per the decision; same reachability check.
- **R4. What the old code hid is checked** (standing rule, m19/03). After the deletions, full E2E runs for every look × theme, and the copy audit if M20-02 has shipped.
  - Acceptance: full E2E green on the deletion commit, with any failure explained, not rerun away.
- **R5. The trial is archived, not lost.** `trial/reshape` is tagged `archive/trial-reshape` and pushed, then the branch is deleted; the `daymaster-trial.vercel.app` alias is removed.
  - Acceptance: the tag exists on GitHub; `git branch -a` has no trial branch; the alias returns 404.
- **R6. Production deployed, live-app check** of Today in every look × theme, and Ahead, You, People, Settings, onboarding.

## Out of scope

- `/chart/` and `/dates/` (live, D5 and Ahead).
- Engine functions still used by live screens.
- M24-03's scope types (runs after this, so it doesn't type code being deleted).

## Open questions

- [ ] **Cycles:** retire it and drop Ahead's "Your decades, the old way" link? Ahead's decade view would be the only place for decades.
- [ ] **Compare:** retire it and drop People's "full comparison" link? People's own card would be the only comparison.
- [ ] **Trial previews:** besides removing the alias, delete the trial's Vercel preview deployments, or leave them (unlisted, behind Vercel login)?

# M19.9 — Looks

Opened 2026-09-29. Runs **before** M20 Clarity (owner decision, 2026-09-29).

## Goal

Every user chooses one of three looks, **A · Trail distilled**, **B · Almanac page**, **C · Day dial**, during onboarding and can change it in Settings. Each look is a complete design of every screen in both themes. The current Trail composition retires.

Owner, 2026-09-29: "make the app look and feel like an award winning app", then "put the direction as an option on the settings, that way users can try out how each direction feel". Answers: everyone, permanent; every screen; A, B and C only; before M20; chosen during onboarding.

## Cost the owner accepted

- About 18 screens × 3 looks × 2 themes to mock and approve before code.
- Every later screen (M20 Today work, M21 accounts, M23 mobile) is built and contrast-checked in three looks.
- `look` joins the store, which is the M21 sync payload.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Three directions](01-three-directions/requirements.md) | done | — |
| 02 | [DESIGN.md: shared base and three looks](02-design-md-looks/requirements.md) | done | 01 |
| 03 | [Look preference: store, pre-paint and component switch](03-look-architecture/requirements.md) | done | — |
| 04 | [Choose your look: onboarding step and Settings option](04-choose-your-look/requirements.md) | draft | 03, 05 |
| 05 | [Today in three looks](05-today/requirements.md) | done | 01, 02, 03 |
| 06 | [Chart in three looks](06-chart/requirements.md) | draft | 02, 03 |
| 07 | [Cycles in three looks](07-cycles/requirements.md) | draft | 02, 03 |
| 08 | [Compare and Find a day in three looks](08-compare-dates/requirements.md) | draft | 02, 03 |
| 09 | [Settings and onboarding in three looks](09-settings-onboarding/requirements.md) | draft | 02, 03, 04 |
| 10 | [Conditions in three looks (or dropped)](10-conditions-look/requirements.md) | draft | 02, 03 |
| 11 | [Retire the old Trail composition and ship](11-retire-trail-and-ship/requirements.md) | draft | 05–10 |

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- DESIGN.md v5 (base + three looks) and `check.mjs` green across looks.
- `pnpm verify`, full E2E in every look × theme, and a live-app check green; production deployed.

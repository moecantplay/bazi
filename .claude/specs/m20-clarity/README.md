# M20 — Clarity

Opened 2026-09-29. Runs before the rest of the roadmap (backend, subscriptions, mobile are now M21–M23).

## Goal

Fix what makes the app feel generated, repetitive and overwhelming — the copy, how much Today shows at once, and a cluttered codebase — before building anything new on top of it.

## Evidence it's needed

A 60-day audit of Today for Fixture A (2026-09-01 → 2026-10-30):

- 1,316 sentences rendered, only 320 unique; the top line repeats 34 times.
- 15 unique headlines and 18 unique agency lines in 60 days.
- About 400 words a day; one idea is often said four times on the same screen.
- Four templates render a gloss twice ("Today lights your a drawn blade — … — a drawn blade — …").
- 685 em-dashes in 60 days.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Fix duplicated glosses](01-fix-duplicated-glosses/requirements.md) | draft | — |
| 02 | [Copy audit baseline](02-copy-audit-baseline/requirements.md) | draft | — |
| 03 | [Docs cleanup](03-docs-cleanup/requirements.md) | draft | — |
| 04 | [Conditions: keep or drop](04-conditions-decision/requirements.md) | draft | — |
| 05 | [Restructure apps/web](05-restructure-web/requirements.md) | draft | 04 |
| 06 | [Restructure presentation](06-restructure-presentation/requirements.md) | draft | 04 |
| 07 | [Restructure content](07-restructure-content/requirements.md) | draft | 01 |
| 08 | [Facts carry their time scope](08-fact-scope-types/requirements.md) | draft | — |
| 09 | [Quality gates](09-quality-gates/requirements.md) | draft | — |
| 10 | [Today says each thing once](10-today-one-idea/requirements.md) | draft | 02, 05, 06 |
| 11 | [Today for a first-time reader](11-today-first-run/requirements.md) | draft | 10 |
| 12 | [No repeats day to day](12-no-repeat-selection/requirements.md) | draft | 02, 07 |
| 13 | [Voice rules the linter enforces](13-voice-lint/requirements.md) | draft | 02 |
| 14 | [Copy rewrite](14-copy-rewrite/requirements.md) | draft | 10, 12, 13 |
| 15 | [Expo spike](15-expo-spike/requirements.md) | draft | 06 |

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- Copy audit (02) shows the targets agreed in 10, 12 and 13 met.
- `pnpm verify`, full E2E and a live-app check green; production deployed.

# M20 — Clarity

Opened 2026-09-29. Runs after [M19.9 Looks](../m19.9-looks/README.md) and before the rest of the roadmap (backend, subscriptions, mobile are now M21–M23). Tickets that reshape screens (04, 11, 14, 21) must now hold in all three looks.

## Goal

Fix what makes the app feel generated, repetitive and overwhelming — the copy, how much Today shows at once, and a cluttered codebase — before building anything new on top of it.

## Evidence it's needed

A 60-day audit of Today for Fixture A (2026-09-01 → 2026-10-30):

- 1,316 sentences rendered, only 320 unique; the top line repeats 34 times.
- 15 unique headlines and 18 unique agency lines in 60 days.
- About 400 words a day; one idea is often said four times on the same screen.
- Four templates render a gloss twice ("Today lights your a drawn blade — … — a drawn blade — …").
- 685 em-dashes in 60 days.

**Narrowed 2026-10-10 ([M24-01](../m24-reshape/01-decisions-and-foundation-specs/design.md)) to "make the current app honest"**: fixes and guards that apply whatever the reshape builds. They run before [M24](../m24-reshape/README.md), in this order:

1. 21: composed daily reading, finish.
2. 01: duplicated glosses, widened to the stray Chart glosses ("out of season", "rooted", "outnumbered") and Cycles' broken "is the old name for" sentence.
3. [24](24-today-header-plain/requirements.md): Today's header in plain words (drop "Yang Water · Rat Day").
4. VOICE.md cleanup: rule 10 and the examples drop Chinese characters to match M17.5-05. New ticket, to draft.
5. 09: quality gates (undefined vars, rendered contrast).
6. 16: flaky migration test.
7. 02: copy audit baseline, widened to every screen, so the reshape has a before and after.

22 and 23 (topic-page depth, problem and remedy) stay here. Everything else that reshaped screens moved to M24, as the table shows.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Fix duplicated glosses](01-fix-duplicated-glosses/requirements.md) | draft | — |
| 02 | [Copy audit baseline](02-copy-audit-baseline/requirements.md) | draft | — |
| 03 | [Convert all docs to specs](03-convert-docs-to-specs/requirements.md) | done | — |
| 04 | [Conditions: keep or drop](04-conditions-decision/requirements.md) | dropped — decided by D4, carried out in M24-04 | — |
| 05 | [Restructure apps/web](05-restructure-web/requirements.md) | dropped — folded into M24 screen tickets | 04 |
| 06 | [Restructure presentation](06-restructure-presentation/requirements.md) | dropped — folded into M24 screen tickets | 04 |
| 07 | [Restructure content](07-restructure-content/requirements.md) | dropped — folded into M24 screen tickets | 01 |
| 08 | [Facts carry their time scope](08-fact-scope-types/requirements.md) | dropped — carried into M24-03 | — |
| 09 | [Quality gates](09-quality-gates/requirements.md) | draft | — |
| 10 | [Today says each thing once](10-today-one-idea/requirements.md) | dropped — folded into 21 | — |
| 11 | [Today for a first-time reader](11-today-first-run/requirements.md) | dropped — carried into M24-10 | 21 |
| 12 | [No repeats day to day](12-no-repeat-selection/requirements.md) | dropped — carried into M24-11 | 02, 07, 21 |
| 13 | [Voice rules the linter enforces](13-voice-lint/requirements.md) | dropped — carried into M24-11 | 02 |
| 14 | [Copy rewrite](14-copy-rewrite/requirements.md) | dropped — carried into M24-11 | 12, 13, 21 |
| 15 | [Expo spike](15-expo-spike/requirements.md) | dropped — moved to M23 | 06 |
| 16 | [Flaky migration idempotence test](16-flaky-migration-idempotence/requirements.md) | draft | — |
| 17 | [Chart says one thing about balance](17-chart-balance-contradiction/requirements.md) | done | — |
| 18 | [First run shows a reading before asking](18-first-run-shows-a-reading/requirements.md) | dropped — carried into M24-05 | — |
| 19 | [Settings: everyday choices first](19-settings-order/requirements.md) | dropped — folded into M19.9-09 | — |
| 20 | [Cycles: romanized names carry their meaning](20-cycles-romanized-names/requirements.md) | dropped — superseded by M24-07 | — |
| 21 | [Today reads as one written piece](21-composed-daily-reading/requirements.md) | done | — |
| 22 | [Topic pages say enough to be worth the tap](22-topic-page-depth/requirements.md) | draft | 21, 23 |
| 23 | [Problem and remedy](23-problem-and-remedy/requirements.md) | draft | — |
| 24 | [Today's header in plain words](24-today-header-plain/requirements.md) | done | — |
| 25 | [Chromium crashes mid-suite](25-chromium-crash-mid-suite/requirements.md) | draft | — |

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- Copy audit (02) shows the targets agreed in 12, 13 and 21 met.
- `pnpm verify`, full E2E and a live-app check green; production deployed.

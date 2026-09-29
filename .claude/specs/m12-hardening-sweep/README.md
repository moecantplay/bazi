# M12 — Hardening, retention and ownership sweep

Status: done · 2026-07-08

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 entries, commits listed below. Records only what those sources say; anything they don't record is marked "Not recorded."

## Goal

The full recommendation slate: correctness, offline, data ownership, retention, sharing, PWA polish, accessibility.

## Outcome

Twelve areas shipped; 15/15 E2E, 10 consecutive clean full-suite runs.

## Tickets

| # | Ticket | Status |
| --- | --- | --- |
| 01 | [Show Chinese characters toggle](01-han-toggle/requirements.md) | done |
| 02 | [Correctness fixes](02-correctness-fixes/requirements.md) | done |
| 03 | [Self-versioning service worker](03-service-worker/requirements.md) | done |
| 04 | [Data ownership: edit, backup, restore](04-data-ownership/requirements.md) | done |
| 05 | [Onboarding resilience](05-onboarding-resilience/requirements.md) | done |
| 06 | [Today date nav and streak](06-today-nav-and-streak/requirements.md) | done |
| 07 | [Compare: saved people](07-compare-saved-people/requirements.md) | done |
| 08 | [Chart progressive disclosure](08-chart-progressive-disclosure/requirements.md) | done |
| 09 | [Share a chart](09-share/requirements.md) | done |
| 10 | [PWA platform polish](10-pwa-polish/requirements.md) | done |
| 11 | [City dataset as its own chunk](11-perf-city-chunk/requirements.md) | done |
| 12 | [Accessibility and audit pass](12-a11y-audit/requirements.md) | done |

## Commits

`f5b450d`, `049aba3`, `cc1e94a`, `9949ded`, `e00a173`, `134d229`, `70d9e59`, `e8fcc73`, `a18a62a`, `8a852d2`, `909ebc5`, `529f870`, `d668645`, `3efcfe1`, `563cecb`, `34bbe4b`.

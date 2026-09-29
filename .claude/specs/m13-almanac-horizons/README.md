# M13 — Almanac and horizons

Status: done · 2026-07-08

Reconstructed 2026-09-29 from: `_sources/progress.md` §M13, `_sources/decisions-log.md` 2026-07-08 M13 entries, commits listed below. Records only what those sources say; anything they don't record is marked "Not recorded."

## Goal

Almanac features from a master reading and a Sinarmas almanac: per-activity day leanings, year/month/week outlook, a date finder, the 12 Day Officers.

## Outcome

All four features shipped; 20/20 E2E; 155 engine + 93 content tests.

## Tickets

| # | Ticket | Status |
| --- | --- | --- |
| 01 | [12 Day Officers](01-day-officers/requirements.md) | done |
| 02 | [Day quality, horizons and date finder](02-day-quality-horizons-finder/requirements.md) | done |
| 03 | [Layered guidance content](03-layered-guidance-content/requirements.md) | done |
| 04 | [Almanac surfaces and E2E](04-almanac-surfaces/requirements.md) | done |

## Commits

`5ca5899` engine almanac layer; `6c99c63` M13 decisions; `03ae152` layered guidance content; `b96a497` web surfaces; `8e707fe` complete.

## Research

- [research/almanac-flags.md](research/almanac-flags.md) — 2026-07-14 follow-up on the open flags (officer keying, stars, 命宮).

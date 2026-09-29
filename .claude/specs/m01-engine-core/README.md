# M1 — Engine core

Status: done · 2026-07-07

Reconstructed 2026-09-29 from: `_sources/plan.md` §M1, `_sources/progress.md` §M1, commits `31430c0`, `b2833f9`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Goal

The four pillars computed correctly from a birth instant, with every constant sourced.

## Outcome

Pillar functions, a 1900–2100 solar-term table and engine config, all passing golden fixtures A–D, independently re-derived by the reviewer.

## Tickets

| # | Ticket | Status |
| --- | --- | --- |
| 01 | [Types and reference tables](01-types-and-reference-tables/requirements.md) | done |
| 02 | [Solar-term table](02-solar-term-table/requirements.md) | done |
| 03 | [Pillar functions and engine config](03-pillar-functions-and-config/requirements.md) | done |
| 04 | [Golden fixtures A–D](04-golden-fixtures/requirements.md) | done |

## Commits

`31430c0` M1 core — sexagenary cycle, four pillars, solar-term table 1900–2100, true solar time; `b2833f9` range guards.

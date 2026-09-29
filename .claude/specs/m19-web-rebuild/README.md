# M19 — Web rebuild

Status: done · 2026-08-05 → 2026-08-06

Reconstructed 2026-09-29 from: `_sources/plan.md` §M19, `_sources/progress.md` §M19, `_sources/decisions-log.md` 2026-08-05/06 M19 entries, commits listed below. The phase plan PROGRESS references (`~/.claude/plans/woolly-hugging-taco.md`) no longer exists; this milestone is reconstructed without it. Records only what those sources say; anything they don't record is marked "Not recorded."

## Goal

Rebuild apps/web from empty against DESIGN.md v4, paying structural debt: view-models package, structured content tokens, single versioned store.

## Outcome

New app built alongside, cut over and deployed to production; 401 unit tests, 28/28 E2E.

## Tickets

| # | Ticket | Status |
| --- | --- | --- |
| 01 | [Decisions A–F and parity checklist](01-decisions-and-parity/requirements.md) | done |
| 02 | [packages/presentation](02-presentation-package/requirements.md) | done |
| 03 | [Structured content token runs](03-content-token-runs/requirements.md) | done |
| 04 | [Single versioned store](04-single-store/requirements.md) | done |
| 05 | [UI port](05-ui-port/requirements.md) | done |
| 06 | [PWA and E2E](06-pwa-and-e2e/requirements.md) | done |
| 07 | [Review and cutover](07-review-and-cutover/requirements.md) | done |

## Commits

`aa3b59c` M19 rebuild — packages/presentation, structured content tokens, apps/web-next; `d065d3e` decisions; `0b8f244` cutover; `5e35230`, `25ff611` docs.

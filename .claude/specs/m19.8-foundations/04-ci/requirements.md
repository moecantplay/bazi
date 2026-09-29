# CI on every push

Status: approved · Milestone: M19.8 · Ticket: 04

## Problem

The repo (`github.com/moecantplay/bazi`) has no `.github/`. `pnpm verify` and E2E run only when someone remembers, and the specs README's rule 5 ("commit only on a green verify; UI tickets also need E2E green") is enforced by memory alone. E2E isn't part of `verify` at all.

## Goal

Every push to `main` and every pull request runs `pnpm verify` and the full E2E suite in all three looks, on a clean machine, from the lockfile.

## Requirements

- **R1.** A GitHub Actions workflow runs on push to `main` and on pull requests: frozen-lockfile install, `pnpm verify`, then E2E once per look.
  - Acceptance: the workflow's steps run green locally in order (same commands); green on GitHub after the owner pushes.
- **R2.** A failing E2E run uploads Playwright's traces.
  - Acceptance: workflow declares an `upload-artifact` step on failure for `apps/web/test-results`.
- **R3.** Runs are cancelled when a newer push to the same ref arrives.
  - Acceptance: `concurrency` block with `cancel-in-progress`.

## Out of scope

- Deploying from CI (needs a Vercel token in GitHub secrets — the owner's call; deploys stay manual per the deploy runbook).
- Phone/WebKit projects (ticket 09).

## Open questions

None.

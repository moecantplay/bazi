# Quality gates

Status: draft · Milestone: M20 · Ticket: 09

## Problem

Two classes of bug shipped past every review because nothing checked for them automatically:

- `--cinnabar` was referenced but never defined; the seal rendered black from M18.5 until 2026-08-05.
- Contrast was checked on design-system prototype cards; the shipped app had three AA failures the prototype didn't (found by a one-off pass on 2026-08-05). That pass is not repeatable.

## Goal

Both checks run on every change, against the real app.

## Requirements

- **R1.** Every `var(--x)` referenced in `apps/web` (CSS, Tailwind config, TSX inline styles) has a defining rule for both themes.
  - Acceptance: a script fails on a deliberately undefined variable; runs in `pnpm verify`.
- **R2.** Every theme rule inside `@media (prefers-color-scheme: …)` has `[data-theme]` twins (decisions log 2026-07-30 rule d).
  - Acceptance: same script, fails on a media-only rule.
- **R3.** Rendered-text contrast is measured on the built app: every route × both themes × all five terrains, AA for normal text, large-text AA only where DESIGN.md allows it.
  - Acceptance: Playwright spec in the E2E suite; fails on a deliberately lowered token.

## Out of scope

Changing any colour. If R3 finds failures, they become their own ticket.

## Open questions

- [ ] R3 adds runtime to E2E (~10 routes × 2 × 5 = 100 page states). Acceptable in the main suite, or run as a separate `pnpm e2e:contrast`?

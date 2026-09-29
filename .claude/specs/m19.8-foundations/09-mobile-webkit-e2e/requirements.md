# E2E on phones, including WebKit

Status: draft · Milestone: M19.8 · Ticket: 09

## Problem

`apps/web/playwright.config.ts` has one project: Desktop Chrome. Daymaster is a phone PWA. iOS readers run WebKit whatever browser they choose, and the layouts are mobile-first, yet no test renders at phone width or in WebKit.

## Goal

The suite also runs at phone size in Chromium (Pixel 7) and WebKit (iPhone 14), in CI.

## Requirements

- **R1.** Playwright projects `mobile-chromium` (Pixel 7) and `mobile-webkit` (iPhone 14) added beside Desktop Chrome.
  - Acceptance: `playwright test --list` shows all three; all green locally.
- **R2.** CI runs them (installs WebKit with deps).
  - Acceptance: green workflow on GitHub.
- **R3.** Failures found are fixed here only if they're test assumptions (viewport, hover); real app bugs become their own tickets.
  - Acceptance: list of any spun-off tickets in `design.md`.

## Out of scope

Real-device testing.

## Open questions

- [ ] Run all three looks × three projects (9 passes) in CI, or phones in the default look only?

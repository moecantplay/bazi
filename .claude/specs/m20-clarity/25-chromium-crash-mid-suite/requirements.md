# Chromium crashes mid-suite

Status: draft · Milestone: M20 · Ticket: 25

## Problem

Full local E2E runs lose about one test per run to a Chromium headless crash, not an assertion:

- The lost test is nearly always at position 36 or 37 of the `chromium` project, in `look-preference.spec.ts`. It's not that spec's fault: it is simply where the crash lands.
- A 462-run repeat on 2026-10-11 captured it: `Received signal 11 SEGV_ACCERR` in `chrome-headless-shell`, shortly after `error-recovery.spec.ts` deliberately throws `RangeError`s (a 2150 date and a `Mars/Olympus` zone).
- The failing test passes alone, and 100 of 100 times on repeat.
- Seen in M19.9-13, M20-24 and M24-08 runs. CI retries once (`retries: 1` under CI), which hides it there. Locally it costs a re-run and a doubt every time.

## Goal

A full local E2E run in every look is green without re-runs, and a real failure is never mistaken for the crash.

## Requirements

- **R1.** Find the cause: whether it's the error-recovery spec's crash pages, the shared browser across projects, or headless-shell itself. Each hypothesis is ruled in or out with a run log.
  - Acceptance: the design records the cause and its evidence.
- **R2.** Fix the cause, or isolate it: for example, a separate worker or project for the deliberate-crash specs, or one local retry limited to crash signatures.
  - Acceptance: three consecutive full runs in each look, with no failures.

## Out of scope

The flaky migration idempotence test (M20-16).

## Open questions

- [ ] Approve this ticket.

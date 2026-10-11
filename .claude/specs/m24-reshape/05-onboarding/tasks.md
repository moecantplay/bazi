# Tasks — Welcome and five-step onboarding

Check a task only with a one-line evidence note.

- [x] 1. Tests: Welcome headlines and sample; E2E onboarding through four steps to Today (R1–R3) — welcome.test.ts 1/1, welcome-sample.test.ts 1/1; onboarding-to-chart walks Welcome and four steps to Today
- [x] 2. Welcome bank and sample (R1) — banks/welcome.ts (twelve headlines; the trial's unused OFFICER_DAY_WORDS dropped), presentation welcome-sample.ts
- [x] 3. Welcome and last steps; delete the look, reveal and disclaimer steps; the page's flow and finish; draft v2 (R1–R5) — welcome-step.tsx, last-step.tsx; look/reveal/disclaimer steps deleted; page.tsx finish saves DEFAULT_LOOK with the note seen; draft key `daymaster.onboarding.v2` held in store.ts, delete clears v1 and v2
- [x] 4. E2E specs updated for Welcome and four steps (R2, R3) — helpers (startOnboarding, completeOnboarding without a look), onboarding-to-chart, look-picker (Instrument), usage-counts (four steps, dial), data-ownership, durable-storage, error-recovery, settings-change-output, today-plain-header (Welcome replaces the look step)
- [ ] 5. `pnpm verify`; full E2E in every look; screenshots; deploy; live check (R6)

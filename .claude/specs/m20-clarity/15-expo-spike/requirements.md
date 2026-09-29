# Expo spike

Status: draft · Milestone: M20 · Ticket: 15

## Problem

M23 (mobile) plans an Expo app sharing the packages. Three risks are unproven and each could reshape work before then:

- `bazi-engine` loads astronomy-engine via `createRequire` (`solar-term-search.ts`, `true-solar-time.ts`); the web app only works through a webpack shim.
- `presentation` relies on `Intl` time-zone support (`zoned-time.ts`, `dates.ts`); Hermes' coverage must be proven on device.
- Trail's SVG pieces must render on `react-native-svg`.

## Goal

A throwaway Expo app that renders Today from the real packages on a real phone, and a written verdict: build mobile in Expo as planned, or change the plan.

## Requirements

- **R1.** Engine runs under Metro/Hermes; golden fixtures A–D produce identical pillars on device.
- **R2.** Zone math correct on device on the solar-term boundary dates the engine tests use.
- **R3.** Today's default view (ticket 10) and the map hero render on iOS and Android.
- **R4.** Verdict written in design.md with measured findings. Spike code is not merged to `main`.

## Out of scope

Production mobile work (M23).

## Open questions

- [ ] Run now (it informs M21's hosting choice too) or at the start of M23?

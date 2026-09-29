# Smaller first load

Status: draft · Milestone: M19.8 · Ticket: 08

## Problem

Measured on the 2026-09-29 export: every route except `/` loads ~950 KB of JS uncompressed. The largest shared chunk (`264-*.js`, 320 KB, 83 KB gzipped) holds:

- `packages/bazi-engine/data/solar-terms.json` (219 KB source): 2,412 jié instants for 1900–2100 as ISO strings;
- astronomy-engine, reached through `true-solar-time.ts`, although true solar time is off by default.

First-visit LCP on a throttled mid-range phone was 5.4–6.4 s (local server, no compression, so pessimistic). Repeat visits load from the service worker. First visits matter most for people opening a share link.

## Goal

A first visit to a gated screen downloads measurably less JS, with byte-identical engine output.

## Requirements

- **R1.** The solar-term table ships in a compact encoding (e.g. minutes from a fixed epoch, delta-coded) that decodes to exactly the same instants.
  - Acceptance: engine test decodes all 2,412 instants and compares them to the JSON; golden fixtures green.
- **R2.** astronomy-engine loads only when a chart has true solar time on.
  - Acceptance: default chart's route chunks contain no astronomy-engine; true-solar E2E still green.
- **R3.** Before/after numbers recorded: first-load JS per route, gzipped; throttled LCP.
  - Acceptance: table in `design.md`.

## Out of scope

Replacing Next.js.

## Open questions

- [ ] R2 makes the engine's `pillars()` async on the true-solar path, or needs a preload step before first render. Which is acceptable? Engine API change → owner decision.

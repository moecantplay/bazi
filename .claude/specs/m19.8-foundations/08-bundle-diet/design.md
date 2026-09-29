# Design — Smaller first load

## Approach

- R1: `scripts/generate-solar-terms.ts` also emits `data/solar-terms.packed.ts` (Int32 minutes since 1900-01-01T00:00Z per jié, in order; seconds are kept in a second array only if tests show any instant needs them). `solar-terms.ts` decodes it once at module load. The JSON stays as the audit source, test-only.
- R2: dynamic `import()` of the true-solar module behind a preload (`ensureTrueSolarReady()`) called by `ProfileGate` when `config.trueSolarTime` is true; `pillars()` stays synchronous and throws a clear error if called on the true-solar path before preload. Settled: preload (owner, 2026-09-29).

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/scripts/generate-solar-terms.ts`, `data/`, `src/solar-terms.ts`, `src/pillars.ts` | Packed table; lazy true-solar |
| `apps/web/src/components/profile-gate.tsx` | Preload when needed |

## Alternatives considered

Fetching the table at runtime: adds a network dependency to first render.

## Risks

Precision: must be proven bit-exact against the JSON (R1 test).

## Verification

Engine tests and golden fixtures; E2E; before/after bundle and LCP table.

## As built

- **R1.** `scripts/pack-solar-terms.ts` writes `data/solar-terms.packed.ts`: the 12-jié name/longitude cycle (copied from the JSON and checked against every entry), the first instant in epoch ms, and 2,411 millisecond gaps — 31 KB against the JSON's 219 KB. `src/solar-terms-packed.ts` decodes it once at load into the same `SolarTermEntry` list, so `SOLAR_TERMS` and every consumer are unchanged. `pnpm generate:solar-terms` now runs generate then pack. The JSON stays the audited source, imported only by the test.
- **R2.** `src/true-solar-loader.ts`: `ensureTrueSolarReady()` dynamically imports `true-solar-time.ts` (the only runtime user of astronomy-engine); `pillars.ts` calls `applyLoadedTrueSolarTime`, which throws "await ensureTrueSolarReady() …" if it hasn't finished. **API change:** the engine index no longer re-exports `applyTrueSolarTime` / `equationOfTimeMinutes` (a static re-export alone pulled astronomy-engine into every bundle; nothing outside the engine used them) and exports `ensureTrueSolarReady` instead. The app preloads in `ProfileGate` when the stored config has true solar time on (the screen still opens if loading fails, so any error reaches the recovery screen), and in Settings when the toggle is switched on.
- **R3.** Measured on the static export (default build), 2026-09-29:

| Route | JS files | Raw before → after | Gzip before → after | Next "First Load JS" | Throttled LCP* before → after |
| --- | --- | --- | --- | --- | --- |
| /today | 17 → 16 | 1,014 → 780 KB | 311 → 255 KB | 270 → 213 kB | 6.4 → 5.1 s |
| /chart | 15 → 14 | 991 → 758 KB | 303 → 248 KB | 263 → 206 kB | 5.5 → 4.4 s |
| /cycles | 15 → 14 | 983 → 749 KB | 300 → 245 KB | 259 → 202 kB | 5.4 → 4.4 s |
| /onboarding | 15 → 14 | 1,001 → 768 KB | 306 → 251 KB | 266 → 209 kB | — |

\*Pixel 7 emulation, 4× CPU throttle, 1.6 Mbps / 150 ms, local server without compression, service worker blocked; before = one run, after = median of three. Production serves brotli, so absolute times there are lower.

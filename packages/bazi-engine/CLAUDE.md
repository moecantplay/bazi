# bazi-engine package conventions

Pure TS. Deps: luxon + astronomy-engine only. All exported functions pure/deterministic, except `ensureTrueSolarReady()`, which loads the true-solar-time module (the only runtime user of astronomy-engine) on demand; a true-solar chart computed before it resolves throws ([M19.8-08](../../.claude/specs/m19.8-foundations/08-bundle-diet/design.md)). The solar-term table ships packed (`data/solar-terms.packed.ts`, generated from the audited JSON by `pnpm generate:solar-terms`). Emits typed ReadingFacts. Zero UI imports.

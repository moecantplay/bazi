# Tasks — Smaller first load

Check a task only with a one-line evidence note.

- [x] 1. Baseline numbers (R3) — table in design.md
- [x] 2. Exactness test, then the packed table (R1) — `solar-terms-packed.test.ts` failed first (module missing), then decodes all 2,412 jié to the JSON exactly; engine 178/178 incl. golden fixtures
- [x] 3. Lazy true-solar per the answered question (R2) — `ensureTrueSolarReady()` preload; `true-solar-preload.test.ts` 3/3 (clear error before preload); engine 181/181; E2E "true solar time on opens everywhere" + "switch on in Settings" green on all three projects
- [x] 4. After numbers; `pnpm verify`; E2E (R3) — table in design.md; E2E trail 212+1 skip, almanac 212+1 skip, dial 211+1 skip+1 Chromium SEGV (30/30 alone, dial chromium rerun 71/71)

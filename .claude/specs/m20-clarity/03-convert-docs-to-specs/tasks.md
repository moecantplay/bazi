# Tasks — Convert all docs to specs

Check a task only with a one-line evidence note.

- [x] 1. Foundation: move DESIGN.md, VOICE.md, design-system; README; fix check.mjs path (R1, R2) — `git mv` all three; `check.mjs` at the new path: 17 cards, 3310 text runs, all AA, theme parity holds
- [x] 2. Sources: PLAN, PROGRESS, decisions log verbatim into `_sources/` (R5) — plan.md, progress.md moved with `git mv`; decisions-log.md cut unchanged from CLAUDE.md (58 entries)
- [x] 3. Reconstruct M0–M7 (R3, R4) — 8 milestones, 25 tickets
- [x] 4. Reconstruct M8–M17 (R3, R4) — 10 milestones, 41 tickets
- [x] 5. Reconstruct M17.5–M19.5 (R3, R4) — 5 milestones, 36 tickets; M19 notes the missing phase-plan file
- [x] 6. Research and screenshot into their milestones; remove `docs/` (R8) — research → m13, m17, m18 `research/`; screenshot → m07-02; `docs/` gone
- [x] 7. `decisions.md` index (R6) — 61 rows covering all 58 log entries (split where one entry held two decisions) plus 2026-09-29; every link resolves
- [x] 8. Rewrite root `CLAUDE.md` (R7) — 56 KB → 5 KB, 41 lines; every standing-rule link resolves
- [x] 9. Reference sweep (R9) — agents, README, apps/web CLAUDE.md, M20–M23 specs, DESIGN.md, token generator + 2 component comments; only research notes (kept verbatim as sources) still name old paths
- [x] 10. Verify: grep, check.mjs, tokens unchanged, `pnpm verify`, spot-check (R10) — generator output identical to committed CSS; `pnpm verify` green (176 engine / 126 content / 161 presentation / 11 web); 10 claims traced to sources, 1 misattribution found and fixed (m19.5-07)

# Daymaster — project conventions

Co-Star-style daily-reading app on a BaZi (Four Pillars) engine. Installable PWA, local-first: no backend yet (M21 adds one for accounts and sync), and the signed-out app must always stay fully functional.

## Where things live

| What | Where |
| --- | --- |
| All planned and past work | `.claude/specs/` — milestones → tickets (`requirements.md`, `design.md`, `tasks.md`); conventions in `.claude/specs/README.md` |
| Standing rules every ticket must satisfy | `.claude/specs/foundation/` — `DESIGN.md` (Trail visual system), `VOICE.md` (copy contract), `design-system/` (token source + contrast check) |
| Decisions | `.claude/specs/decisions.md` (index → ticket); original log frozen in `.claude/specs/_sources/` |
| Unverifiable engine values | `.claude/specs/flags.md` |
| Package rules | each package's own `CLAUDE.md` |

`pnpm verify` (root) runs typecheck + lint + unit tests + build across all packages — commit only on green.

## Workflow

Every change starts as a ticket under `.claude/specs/` (use `/spec new`). The owner approves a ticket's requirements and design before any task runs; tasks are checked with evidence; `design.md` is updated in the same commit if the implementation differs. Work found mid-ticket that no requirement covers becomes a new ticket. A foundation spec changes only through a ticket.

## Non-negotiables

- Never invent calendrical/astronomical constants: every table is embedded in `packages/bazi-engine/data/` with a source comment, computed via astronomy-engine, or copied from the brief §11. Unverifiable → flag in `.claude/specs/flags.md`.
- Golden fixtures (brief §5) are authoritative; write tests first for engine work.
- `VOICE.md` binds all user-facing copy: no fatalism, no medical/financial/legal directives, agency line ends every daily reading.
- Deterministic reading selection: hash(birth data + ISO date). No render-time randomness.
- Readings are computed on-device, always. A backend is for identity, sync and entitlements only — never reading generation, and never a gate on the core app.

## Standing rules

Each rule is still in force; the linked ticket records why.

- **Stack:** Tailwind 3.4; packages ship raw TS transpiled by Next; static export ([m00/01](.claude/specs/m00-scaffold/01-monorepo-and-verify/design.md)). Engine bundles via webpack `extensionAlias` + `node:module` shim; astronomy-engine via `createRequire` ([m04/03](.claude/specs/m04-ui-shell-onboarding/03-app-shell-seal-persistence/design.md)).
- **Engine inputs:** instant = absolute UTC Date; IANA zone for local reading; dates as "YYYY-MM-DD"; longitude east-positive; outside 1900–2100 throws ([m01/03](.claude/specs/m01-engine-core/03-pillar-functions-and-config/design.md)). Days are read in the device zone, the chart in the birth zone; `readingZone` is transient, never persisted ([m19.5/09](.claude/specs/m19.5-post-launch/09-reading-zone/design.md)).
- **Today is day-only;** month, year and decade content belongs to Cycles ([m19.5/03](.claude/specs/m19.5-post-launch/03-today-day-only/design.md)).
- **English only:** no Chinese characters are displayed; romanized names appear only where no translation exists, always with the meaning beside them ([m17.5/05](.claude/specs/m17.5-english-first/05-remove-chinese-characters/design.md)). Content is structured token runs; a term run's `han` is typed but never rendered ([m19/03](.claude/specs/m19-web-rebuild/03-content-token-runs/design.md)).
- **Design:** `DESIGN.md` v5: one base plus three user-chosen looks, Explorer · Editorial · Instrument (stored `trail`/`almanac`/`dial`); every screen ships in all three, and a look moves content, never drops it ([m19.9/02](.claude/specs/m19.9-looks/02-design-md-looks/design.md)). The seal/logo is the only cinnabar mass, always. Each look is one design in both themes: reviewed on device in both, contrast measured on rendered text in both, anchor defined by distance from the ground, every theme rule has `[data-theme]` twins ([m18/03](.claude/specs/m18-design-reset/03-both-theme-pass/design.md)). Verify the shipped composition, not only tokens ([m18.5/04](.claude/specs/m18.5-trail-rollout/04-wave4-verify/design.md)); every referenced `var(--x)` must be defined ([m19/05](.claude/specs/m19-web-rebuild/05-ui-port/design.md)).
- **Data:** one versioned store (`daymaster.store.v2`) shaped like the future sync payload; the streak stays outside it; backup = same envelope ([m19/04](.claude/specs/m19-web-rebuild/04-single-store/design.md)). Shared charts are always someone to compare with, never a replacement profile ([m12/09](.claude/specs/m12-hardening-sweep/09-share/design.md)).
- **PWA:** the service worker is build-finalized — never hand-bump a version; only a user-accepted Refresh may reload ([m12/03](.claude/specs/m12-hardening-sweep/03-service-worker/design.md)).
- **Retiring a safety net:** when a defensive fallback is removed, check what it was hiding before trusting prior green runs ([m19/03](.claude/specs/m19-web-rebuild/03-content-token-runs/design.md)).
- **Mockups first:** UI changes are reviewed as on-device mockups in both themes before app code.

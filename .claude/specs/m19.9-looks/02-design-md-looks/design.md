# Design — DESIGN.md: shared base and three looks

## Approach

Rewrite DESIGN.md around the 01 mockups. Base first, then one section per look. Extend `design-system/src` with a `look` attribute on cards and `check.mjs` with a look loop; the 430px viewport caveat stays documented.

## Changes

| Area | Change |
| --- | --- |
| `foundation/DESIGN.md` | v5: base + looks |
| `CLAUDE.md` | standing rule wording |
| `foundation/design-system/check.mjs`, `src/` | look dimension |
| `decisions.md` | new row |

## Alternatives considered

Three separate DESIGN files: duplicates the base and lets it drift. Keep one design + 'variants' appendix: undersells how different B and C are structurally.

## Risks

Scope creep in the base: anything a look wants to differ on must move out of the base, which reopens settled rules. Mitigation: base changes need owner sign-off in this ticket.

## Verification

Owner review of DESIGN.md v5; `check.mjs` green across looks.

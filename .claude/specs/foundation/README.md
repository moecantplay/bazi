# Foundation specs

The standing rules every ticket must satisfy. A ticket's `design.md` names the foundation sections it touches; a reviewer checks the diff against them.

| Spec | Governs | Checked by |
| --- | --- | --- |
| [DESIGN.md](DESIGN.md) | Visual system (Trail): tokens, type, shape, components, layout, accessibility floor | [design-system/](design-system/) — `node .claude/specs/foundation/design-system/check.mjs` (contrast + theme parity over every card); app-side gates in M20-09 |
| [VOICE.md](VOICE.md) | Every user-facing word: register, hard rules, term glossing, layered guidance, disclaimer | `packages/content/test/voice.test.ts` and the other content voice tests |
| [design-system/](design-system/) | The Trail token source (`src/tokens.mjs`) and prototype component cards | `apps/web/scripts/generate-tokens.mjs` transcribes the tokens; `check.mjs` verifies them |

## Changing a foundation spec

Only through a ticket. The ticket's requirements say what rule changes and why; its tasks update the spec, the code, and the checks in the same change. A foundation spec never describes something the app doesn't do.

## History

- DESIGN.md: v1 ink & cinnabar ([M4](../m04-ui-shell-onboarding/README.md)) → dark theme ([M9](../m09-dark-mode/README.md)) → v2 calm minimal ([M15](../m15-design-refinement/README.md)) → v3 Material ([M16](../m16-material/README.md)) → v4 Trail ([M18](../m18-design-reset/README.md)).
- VOICE.md: written in [M3](../m03-content/README.md); rule 11 term glosses ([M10](../m10-plain-meaning-voice/README.md)); rule 12 layered guidance ([M13](../m13-almanac-horizons/README.md)); classic-name-first refinement ([M14](../m14-glossary-read-more/README.md)).
- Moved here from the repo root and `packages/content/` on 2026-09-29 ([M20-03](../m20-clarity/03-convert-docs-to-specs/requirements.md)).

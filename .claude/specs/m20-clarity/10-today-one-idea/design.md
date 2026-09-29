# Design — Today says each thing once

## Approach

1. **Mockup first.** 2–3 variants of the default Today view on real Fixture A data for three contrasting days, both themes, as an artifact. Owner picks.
2. **Fact ownership in content.** `dailyReading` today builds lines, dos, donts and agency independently from the same facts. Change it to allocate: rank facts (severity order already exists from 2026-09-10), give the top fact to the main idea, the next to the secondary note, and let dos/donts/agency draw only from facts not yet used — falling back to fact-free lines.
3. **Presentation** exposes `default` and `more` groups in `todayScreenModel`; the view renders `more` behind one disclosure.
4. Tests for R2/R4 in presentation, over the same fixtures and range as copy-audit.

## Changes

| Area | Change |
| --- | --- |
| `content/src/readings/daily.ts` | Fact allocation |
| `presentation/src/screens/today/today-screen.ts` | `default` / `more` groups |
| `apps/web/src/features/today/` | Render the groups |
| E2E | Today spec updated |

## Alternatives considered

- Hiding repeated sections in the UI only: repetition still exists in the model and returns in any new surface.

## Risks

- Removing sections by default may drop things the owner uses daily; the mockup review settles it.

## Verification

R2/R4 tests; copy-audit against the ticket 02 baseline; `pnpm verify`; E2E; live check both themes.

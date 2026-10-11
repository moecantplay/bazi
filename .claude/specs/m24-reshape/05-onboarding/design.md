# Design — Welcome and five-step onboarding

## Approach

Apply the trial's onboarding (commit c024283) to main. Main's onboarding hadn't changed since the trial branched, apart from M24-04's share redirect, which the trial version already has. The look step, reveal and separate disclaimer step are deleted; their checks move into `handleFinish` on the last step.

## Changes

| Area | Change |
| --- | --- |
| `content/src/banks/welcome.ts` (R1) | `OFFICER_DAY_HEADLINES` (twelve) and `welcomeHeadline`. The trial's `OFFICER_DAY_WORDS` (for the dropped ten-day strip) is not carried. |
| `presentation/src/welcome-sample.ts` (R1) | `welcomeSample(todayISO, zone)`, from the day officer and the hour blocks. It imports `hourBlocks` from `conditions-screen.ts`, which M24-12 must rehome before deleting Conditions. |
| `web/src/components/onboarding/welcome-step.tsx`, `last-step.tsx` (R1, R2) | New. `last-step` is sex, the reason, the disclaimer (verbatim) and the checkbox. |
| `web/src/components/onboarding/{look,reveal,disclaimer}-step.tsx` (R3) | Deleted. |
| `web/src/app/onboarding/page.tsx` (R2, R3, R5) | Welcome at step 0, gathering at 1–4. `handleFinish` builds the chart preview, saves with `DEFAULT_LOOK` (`lookPromptSeen: true`), tracks `onboarding-finished`, and lands on Today. |
| `web/src/components/onboarding/draft.ts`, `lib/store.ts` (R4) | No `look` in the draft. **Changed from the trial:** the draft key moves to `daymaster.onboarding.v2`, held once in `store.ts`, and delete clears both v1 and v2. |
| E2E | `helpers.ts`: `startOnboarding`, and `completeOnboarding` without a look. Updated specs: onboarding-to-chart, look-picker, usage-counts, data-ownership, durable-storage, error-recovery and settings-change-output (Welcome replaces the date step as the landing). today-plain-header's look-step check becomes a Welcome check. |

## Alternatives considered

- **Keep the reveal.** It's the jargon wall the proposal named. "Your chart in full" behind You now does that job.

## Risks

- **Analytics continuity.** The `onboarding-step` names drop `disclaimer`, `look` and `reveal`. Counts are dormant until M21 (D6), so no history breaks.

## Verification

- `pnpm verify`.
- Full E2E in every look.
- Welcome and the last step screenshotted in both themes.
- Deploy to production, then a live check of `/onboarding/` in a fresh browser.

# Anonymous usage counts (dormant until configured)

Status: done · Milestone: M19.8 · Ticket: 06

## Problem

Nothing tells the owner how Daymaster is used: which look readers pick and keep, whether they come back, where onboarding loses people, or how often a screen fails. The owner plans to choose one permanent look after the M19.9 trial ([M19.9-12](../../m19.9-looks/12-pick-the-permanent-look/requirements.md)) and has no evidence to choose with.

Owner, 2026-09-29: "let's try cookieless analytics", then "i dont think we're ready for a subscription based analytic service".

## Goal

The app can send a small, fixed set of anonymous counts to a cookieless analytics service, off unless a build is configured with a site ID, and never including birth details, notes or anything that identifies a person. The target is Umami (open source, custom events): its free cloud tier now, or self-hosted on the M21 backend.

## Requirements

- **R1.** With no analytics configured at build time, the app makes no analytics network request and loads no analytics script.
  - Acceptance: the default `pnpm build` output contains no analytics script reference; the E2E request log for a configured-off build shows only same-origin requests.
- **R2.** When configured (script URL + site ID via `NEXT_PUBLIC_ANALYTICS_*`), the app loads the script only for readers who allow it, sends route-only page views (no query, no fragment) and exactly these events:
  | Event | Data |
  | --- | --- |
  | `reading-opened` (first Today open of the day) | look, theme, installed, streak bucket, days-since-first-chart bucket |
  | `look-chosen` | look, where (onboarding / settings / note) |
  | `onboarding-step` | step name |
  | `onboarding-finished` | look |
  | `reading-marked` | rang-true / did-not-fit |
  | `chart-shared` | image / link |
  | `backup-downloaded`, `data-deleted` | — |
  | `screen-error` | route, error name (never the message: engine messages include dates) |
  - Acceptance: E2E against a local stub records each event with exactly these keys; a guard test fails if any payload contains the seeded birth date, time, city or a journal note.
- **R3.** No cookies and no identifiers written by the analytics path.
  - Acceptance: E2E asserts `document.cookie` is empty and no new storage keys appear after events.
- **R4.** Readers can turn counting off in Settings (shown only when configured); the choice lives in the store (additive field `usageCounts`, default on) and stops both the script and every event immediately. A browser sending Global Privacy Control or Do Not Track is never counted, and Settings says so.
  - Acceptance: E2E — toggle off → no further stub calls, and a reload loads no script; GPC-emulated context → no script, Settings note visible.
- **R5.** Privacy wording is honest everywhere it's stated: README, Settings' data section.
  - Acceptance: no copy claims "no network calls" while counting can be configured; owner reads the Settings wording.

## Out of scope

- Choosing or paying for a plan. The owner creates a free Umami Cloud site, or M21 self-hosts, then sets two env vars at build.
- Dashboards and funnels: they live in Umami.
- Error messages or stack traces.

## Open questions

None. If the owner never configures a site, nothing is sent and the Settings toggle stays hidden.

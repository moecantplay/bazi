# M19.8 — Foundations

Opened 2026-09-29 from a CTO review of the running app (build, live site, three looks × two themes, failure probes). Runs **now**, alongside M19.9: its tickets are engineering-only and don't reshape any look, so they don't wait for M19.9-06…11. Numbered 19.8 because it ships before M19.9 finishes.

## Goal

The app can't strand a reader, keeps their data as safe as a browser allows, doesn't leak birth details, is checked on every push, and can — once the owner switches it on — count how it's used without identifying anyone. The counting exists mainly to inform the owner's choice of one permanent look ([M19.9-12](../m19.9-looks/12-pick-the-permanent-look/requirements.md)).

## Evidence

Measured 2026-09-29 against the static export and https://daymaster-nu.vercel.app:

- A stored birth outside 1900–2100, or an unknown time zone, renders Next's bare "Application error" on every gated screen; the reader can't reach Settings to recover.
- No `navigator.storage.persist()` call anywhere; the whole chart lives in `localStorage`.
- Share links put the birth date, time, city and sex in the query string (`/onboarding/?share=…`), which reaches the host's request logs.
- No CI: `.github/` doesn't exist; E2E runs only when someone remembers.
- The live site sends no CSP, `X-Content-Type-Options`, `Referrer-Policy` or `Permissions-Policy`; `/_next/static/*` is served `max-age=0`.
- Every route but `/` loads ~950 KB of JS (uncompressed); the shared chunk carries the whole 1900–2100 solar-term table as ISO strings plus astronomy-engine (needed only for true solar time, off by default). First-visit LCP 5.4–6.4 s on a throttled mid-range phone (local server, no compression).
- E2E runs in desktop Chromium only; the product is a phone PWA and iOS readers run WebKit.
- No usage data of any kind: nothing says which look readers keep, or whether they return.

## Approval

Owner, 2026-09-29: "feel free to adjust the spec/ folder and execute" — covers tickets 01–07. Analytics: "let's try cookieless analytics", then "i dont think we're ready for a subscription based analytic service" → ticket 06 ships dormant, targeting a free tier or self-hosting; no paid service. 08 and 09 are drafts awaiting approval.

## Tickets

| # | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| 01 | [Recover from a broken screen](01-error-recovery/requirements.md) | done | — |
| 02 | [Ask the browser to keep our data](02-durable-storage/requirements.md) | done | — |
| 03 | [Share links keep birth details off the server](03-share-link-fragment/requirements.md) | done | — |
| 04 | [CI on every push](04-ci/requirements.md) | approved | — |
| 05 | [Security and caching headers](05-security-headers/requirements.md) | done | — |
| 06 | [Anonymous usage counts (dormant until configured)](06-usage-counts/requirements.md) | done | 01, 05 |
| 07 | [Docs match the code](07-docs-drift/requirements.md) | approved | 01–06 |
| 08 | [Smaller first load](08-bundle-diet/requirements.md) | draft | — |
| 09 | [E2E on phones, including WebKit](09-mobile-webkit-e2e/requirements.md) | draft | 04 |

## Exit criteria

- Every ticket `done` or `dropped` with a reason.
- `pnpm verify`, full E2E in all three looks, and a live-app check green.
- CI green on GitHub (needs a push — the owner's call).

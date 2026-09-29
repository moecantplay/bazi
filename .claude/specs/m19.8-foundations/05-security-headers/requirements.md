# Security and caching headers

Status: approved · Milestone: M19.8 · Ticket: 05

## Problem

`curl -I https://daymaster-nu.vercel.app/today/` (2026-09-29) returns only `strict-transport-security` among security headers: no Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or frame protection. Every file, including content-hashed `/_next/static/*` chunks, is served `cache-control: public, max-age=0, must-revalidate`, so each first visit revalidates every chunk. (The service worker hides this on repeat visits.)

The deploy is a CLI upload of `apps/web/out/`, so any Vercel config has to be inside `out/`, which every build regenerates.

## Goal

Production sends a CSP that fits the app, the standard hardening headers, and immutable caching for hashed assets, and E2E runs under the same headers so a CSP break fails the suite.

## Requirements

- **R1.** Every response carries: CSP (`default-src 'self'`; nothing framed or framing; no plugins; only the analytics origin from ticket 06 added when configured), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera, microphone, geolocation and payment, `X-Frame-Options: DENY`.
  - Acceptance: headers present on the E2E server and, after deploy, on the live site.
- **R2.** `/_next/static/*` is `public, max-age=31536000, immutable`; `sw.js` is never cached.
  - Acceptance: header check in E2E.
- **R3.** The full E2E suite passes with the headers applied, with no CSP violation reported.
  - Acceptance: E2E server applies `out/vercel.json`; a spec fails on any `securitypolicyviolation` event across the main routes.
- **R4.** The config lands in `out/` on every build, is not precached by the service worker, and needs no manual step to deploy.
  - Acceptance: `out/vercel.json` exists after `pnpm build`; not in `sw.js`'s manifest.

## Out of scope

Nonce/hash-based `script-src`: a static export can't issue per-request nonces, and Next's inline hydration scripts differ per page, so `'unsafe-inline'` stays for scripts. The CSP still blocks every other origin, plugins, framing, and base-tag hijacks.

## Open questions

None.

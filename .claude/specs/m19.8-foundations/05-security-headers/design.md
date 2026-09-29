# Design — Security and caching headers

## Approach

- `scripts/write-deploy-config.mjs` runs after `generate-sw.mjs` in `build`, so the service worker never lists the file. It writes `out/vercel.json` with a `headers` array:
  - `source: "/(.*)"` → the security headers. CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' <A>; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' <A>; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`. `<A>` is the origin of `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` when it is absolute (ticket 06), else nothing.
  - `source: "/_next/static/(.*)"` → immutable cache.
  - `source: "/sw.js"` → `no-cache`.
- `e2e/static-server.mjs` reads `out/vercel.json` at startup and applies each rule whose `source` matches. It supports only the `/(.*)`-style patterns we write; anything else fails loudly so the two can't drift silently.
- `e2e/security-headers.spec.ts`: asserts the headers, and visits the main routes with a `securitypolicyviolation` listener installed before any script runs.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/scripts/write-deploy-config.mjs` | New |
| `apps/web/package.json` | `build` runs it last |
| `apps/web/e2e/static-server.mjs` | Applies `out/vercel.json` headers |
| `apps/web/e2e/security-headers.spec.ts` | New |

## Alternatives considered

- A committed `public/vercel.json` — lands in `out/` but gets precached and served publicly, and can't pick up the analytics origin.
- Headers in the Vercel dashboard — invisible to the repo and untested.
- `<meta http-equiv>` CSP — can't set `frame-ancestors`, and it wouldn't cover non-HTML responses.

## Risks

- A CSP too tight for something only production does. Mitigated by running the whole E2E suite under it; the live check after deploy re-verifies.

## Verification

Full E2E under headers in all three looks; `pnpm verify`; `curl -I` on the live site after the owner-approved deploy.

## As built

The caching test reads a chunk path out of `/onboarding/`'s HTML and checks it with the request fixture rather than a browser page: opening a page right after the offline spec reliably hit the local Chromium crash on context close.

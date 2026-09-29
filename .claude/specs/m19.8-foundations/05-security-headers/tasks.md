# Tasks — Security and caching headers

Check a task only with a one-line evidence note.

- [x] 1. `security-headers.spec.ts` — failing first (R1–R3) — header and caching tests failed on the pre-change export
- [x] 2. `write-deploy-config.mjs`; wire into `build` (R1, R2, R4) — `vercel.json written`; `curl -I` shows all five headers
- [x] 3. Static server applies `out/vercel.json` (R3) — per-request read; unsupported sources throw
- [x] 4. Full E2E green under headers, all looks (R3) — trail 59/60, almanac 60/60, dial 60/60; the one failure per run was a Chromium SEGV on context close in a different test each time, reproduced 1 in 3 runs with vercel.json removed (pre-existing local flake, see memory note)
- [x] 5. `pnpm verify` green; `out/vercel.json` absent from the SW manifest (R4) — `grep -c vercel.json out/sw.js` = 0

Live after the owner's deploy (2026-09-29, `dpl_8jyCH3gv7BMaQGBvFHxUuB92Wzom`): `curl -I https://daymaster-nu.vercel.app/today/` shows the CSP, nosniff, referrer, frame and permissions headers; hashed chunks `public, max-age=31536000, immutable`; `sw.js` `no-cache`; `/vercel.json` 404. 30 live page loads (Pixel 7 Chromium + iPhone 14 WebKit × three looks): no CSP violations or errors.

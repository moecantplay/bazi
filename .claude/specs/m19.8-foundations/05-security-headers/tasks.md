# Tasks — Security and caching headers

Check a task only with a one-line evidence note.

- [ ] 1. `security-headers.spec.ts` — failing first (R1–R3)
- [ ] 2. `write-deploy-config.mjs`; wire into `build` (R1, R2, R4)
- [ ] 3. Static server applies `out/vercel.json` (R3)
- [ ] 4. Full E2E green under headers, all looks (R3)
- [ ] 5. `pnpm verify` green; `out/vercel.json` absent from the SW manifest (R4)

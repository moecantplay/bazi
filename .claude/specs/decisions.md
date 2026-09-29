# Decisions

Every decision that outlives a ticket, newest last. Each links the ticket whose `design.md` records it in full; the original wording is in [_sources/decisions-log.md](_sources/decisions-log.md) (frozen 2026-09-29). Add new decisions here with a link to their ticket.

| Date | Decision | Ticket | Status |
| --- | --- | --- | --- |
| 2026-07-07 | Tailwind 3.4, not v4 | [m00-scaffold/01-monorepo-and-verify](m00-scaffold/01-monorepo-and-verify/design.md) | in force |
| 2026-07-07 | Packages ship raw TS, transpiled by Next | [m00-scaffold/01-monorepo-and-verify](m00-scaffold/01-monorepo-and-verify/design.md) | in force |
| 2026-07-07 | Day-pillar anchor 1949-10-01 = 甲子 | [m01-engine-core/03-pillar-functions-and-config](m01-engine-core/03-pillar-functions-and-config/design.md) | in force |
| 2026-07-07 | Engine input conventions (UTC instant, IANA zone, RangeError outside 1900–2100) | [m01-engine-core/03-pillar-functions-and-config](m01-engine-core/03-pillar-functions-and-config/design.md) | in force |
| 2026-07-07 | Equation of time from the Meeus polynomial (accepted exception) | [m01-engine-core/03-pillar-functions-and-config](m01-engine-core/03-pillar-functions-and-config/design.md) | in force |
| 2026-07-07 | astronomy-engine loaded via createRequire | [m01-engine-core/02-solar-term-table](m01-engine-core/02-solar-term-table/design.md) | in force |
| 2026-07-07 | VOICE.md written by the orchestrator; writers comply | [m03-content/01-voice-md](m03-content/01-voice-md/design.md) | in force |
| 2026-07-07 | Fire accent #D0662A distinct from cinnabar | [m04-ui-shell-onboarding/01-design-md-v1](m04-ui-shell-onboarding/01-design-md-v1/design.md) | in force |
| 2026-07-07 | Dark mode out of scope for v1 | [m04-ui-shell-onboarding/01-design-md-v1](m04-ui-shell-onboarding/01-design-md-v1/design.md) | superseded same day by M9 |
| 2026-07-07 | Post-review design rules: cinnabar seal-only, hue and border rules | [m04-ui-shell-onboarding/01-design-md-v1](m04-ui-shell-onboarding/01-design-md-v1/design.md) | in force |
| 2026-07-07 | City dataset: GeoNames cities15000, top 2000 | [m04-ui-shell-onboarding/02-onboarding-and-city-dataset](m04-ui-shell-onboarding/02-onboarding-and-city-dataset/design.md) | in force |
| 2026-07-07 | Webpack extensionAlias + node:module shim for the engine | [m04-ui-shell-onboarding/03-app-shell-seal-persistence](m04-ui-shell-onboarding/03-app-shell-seal-persistence/design.md) | in force |
| 2026-07-07 | apps/web has no unit tests by design | [m07-e2e-readme-dod/01-playwright-smoke-flows](m07-e2e-readme-dod/01-playwright-smoke-flows/design.md) | softened in M19 (store tests) |
| 2026-07-07 | Dark mode promoted to M9, same design bar | [m09-dark-mode/01-dark-theme-spec](m09-dark-mode/01-dark-theme-spec/design.md) | in force |
| 2026-07-07 | Voice direction: no system term stands alone (rule 11) | [m10-plain-meaning-voice/01-rule-11-and-gloss-maps](m10-plain-meaning-voice/01-rule-11-and-gloss-maps/design.md) | in force |
| 2026-07-08 | Show Chinese characters toggle | [m12-hardening-sweep/01-han-toggle](m12-hardening-sweep/01-han-toggle/design.md) | superseded 2026-07-17 (M17.5-03, M17.5-05) |
| 2026-07-08 | Service worker is build-finalized | [m12-hardening-sweep/03-service-worker](m12-hardening-sweep/03-service-worker/design.md) | in force |
| 2026-07-08 | Backup JSON is the local-only account substitute | [m12-hardening-sweep/04-data-ownership](m12-hardening-sweep/04-data-ownership/design.md) | in force |
| 2026-07-08 | Push notifications structurally out | [m12-hardening-sweep/06-today-nav-and-streak](m12-hardening-sweep/06-today-nav-and-streak/design.md) | to be superseded once M21 adds a backend |
| 2026-07-08 | Compare people list + legacy migration | [m12-hardening-sweep/07-compare-saved-people](m12-hardening-sweep/07-compare-saved-people/design.md) | in force |
| 2026-07-08 | Share links encode birth details in the URL | [m12-hardening-sweep/09-share](m12-hardening-sweep/09-share/design.md) | in force; moved to the fragment 2026-09-29 ([M19.8-03](m19.8-foundations/03-share-link-fragment/design.md)) |
| 2026-07-08 | Icon pipeline from public/icon.svg | [m12-hardening-sweep/10-pwa-polish](m12-hardening-sweep/10-pwa-polish/design.md) | in force |
| 2026-07-08 | iOS splash images skipped | [m12-hardening-sweep/10-pwa-polish](m12-hardening-sweep/10-pwa-polish/design.md) | in force |
| 2026-07-08 | Almanac direction: four features, layered guidance, hybrid activities | [m13-almanac-horizons/03-layered-guidance-content](m13-almanac-horizons/03-layered-guidance-content/design.md) | in force |
| 2026-07-08 | Day-officer table = conservative common core | [m13-almanac-horizons/01-day-officers](m13-almanac-horizons/01-day-officers/design.md) | in force |
| 2026-07-13 | Glossary layer keyed by ReadingLine.topic | [m14-glossary-read-more/01-glossary-layer](m14-glossary-read-more/01-glossary-layer/design.md) | in force |
| 2026-07-13 | Read-more deep dives, distinct from the glossary | [m14-glossary-read-more/02-read-more-dives](m14-glossary-read-more/02-read-more-dives/design.md) | in force |
| 2026-07-13 | Voice: classical name first, translated in full | [m14-glossary-read-more/03-voice-refinement](m14-glossary-read-more/03-voice-refinement/design.md) | in force |
| 2026-07-14 | Co-Star arrangement for Today | [m14-glossary-read-more/04-costar-today-arrangement](m14-glossary-read-more/04-costar-today-arrangement/design.md) | superseded by M17 and M18.5 |
| 2026-07-16 | M15 calm-minimal design refinement | [m15-design-refinement/01-design-md-v2](m15-design-refinement/01-design-md-v2/design.md) | surface language superseded by M16; a11y rules kept |
| 2026-07-16 | M16 Material look-and-feel | [m16-material/01-design-md-v3](m16-material/01-design-md-v3/design.md) | superseded by M18 Trail |
| 2026-07-16 | M17 Co-Star content restructure | [m17-costar-restructure/03-today-reorder](m17-costar-restructure/03-today-reorder/design.md) | in force |
| 2026-07-17 | Today tweaks: week strip back, bar not dot, streak wordings | [m17.5-english-first/01-today-tweaks](m17.5-english-first/01-today-tweaks/design.md) | in force |
| 2026-07-17 | Bold ink-wash hero | [m17.5-english-first/02-bold-hero](m17.5-english-first/02-bold-hero/design.md) | superseded by M18.5 map hero |
| 2026-07-17 | English-first default + pillar grid subgrid | [m17.5-english-first/03-english-first-default](m17.5-english-first/03-english-first-default/design.md) | superseded same day by full removal |
| 2026-07-17 | Glyph icon system | [m17.5-english-first/04-glyph-icons](m17.5-english-first/04-glyph-icons/design.md) | in force |
| 2026-07-17 | Chinese characters removed entirely | [m17.5-english-first/05-remove-chinese-characters](m17.5-english-first/05-remove-chinese-characters/design.md) | in force |
| 2026-07-17 | Seal becomes a personal logo | [m17.5-english-first/06-seal-personal-logo](m17.5-english-first/06-seal-personal-logo/design.md) | in force |
| 2026-07-17 | Zodiac animal icons v2 (trace pipeline) | [m17.5-english-first/07-zodiac-silhouettes](m17.5-english-first/07-zodiac-silhouettes/design.md) | in force |
| 2026-07-29 | v2 arc approved | [m18-design-reset/01-v2-arc-and-references](m18-design-reset/01-v2-arc-and-references/design.md) | reordered 2026-09-29: M20 Clarity first, backend/subs/mobile → M21–M23 |
| 2026-07-30 | Both themes are one design | [m18-design-reset/03-both-theme-pass](m18-design-reset/03-both-theme-pass/design.md) | in force |
| 2026-08-05 | Trail chosen | [m18-design-reset/05-trail-and-design-md-v4](m18-design-reset/05-trail-and-design-md-v4/design.md) | in force |
| 2026-08-05 | Icon and asset continuity under Trail | [m18-design-reset/05-trail-and-design-md-v4](m18-design-reset/05-trail-and-design-md-v4/design.md) | in force |
| 2026-08-05 | Anchor-mass rule resolved | [m18-design-reset/05-trail-and-design-md-v4](m18-design-reset/05-trail-and-design-md-v4/design.md) | in force |
| 2026-08-05 | Rollout scope: reskin in place first | [m18-design-reset/06-rollout-scope](m18-design-reset/06-rollout-scope/design.md) | in force |
| 2026-08-05 | M18.5 Trail rollout shipped; measure the shipped composition | [m18.5-trail-rollout/04-wave4-verify](m18.5-trail-rollout/04-wave4-verify/design.md) | in force |
| 2026-08-05 | M19 decisions A–F | [m19-web-rebuild/01-decisions-and-parity](m19-web-rebuild/01-decisions-and-parity/design.md) | D corrected 2026-08-06 |
| 2026-08-05 | Undefined --cinnabar found and fixed | [m19-web-rebuild/05-ui-port](m19-web-rebuild/05-ui-port/design.md) | in force |
| 2026-08-05 | Phase 11 review: branch runs fused under gloss-only | [m19-web-rebuild/03-content-token-runs](m19-web-rebuild/03-content-token-runs/design.md) | in force |
| 2026-08-06 | String API and strip-han removed; hidden leaks fixed | [m19-web-rebuild/03-content-token-runs](m19-web-rebuild/03-content-token-runs/design.md) | in force |
| 2026-08-06 | Cutover executed; no Vercel dashboard step | [m19-web-rebuild/07-review-and-cutover](m19-web-rebuild/07-review-and-cutover/design.md) | in force |
| 2026-08-21 | Per-activity terrain gauge revived | [m19.5-post-launch/02-activity-terrain](m19.5-post-launch/02-activity-terrain/design.md) | in force |
| 2026-08-21 | Today scoped to day-only content | [m19.5-post-launch/03-today-day-only](m19.5-post-launch/03-today-day-only/design.md) | in force |
| 2026-08-21 | Luck timeline interactive | [m19.5-post-launch/05-cycles-drill-down](m19.5-post-launch/05-cycles-drill-down/design.md) | in force |
| 2026-08-21 | HorizonOutlook folded into the drill-down | [m19.5-post-launch/05-cycles-drill-down](m19.5-post-launch/05-cycles-drill-down/design.md) | in force |
| 2026-09-10 | Map marks honest about time | [m19.5-post-launch/06-honest-map-timing](m19.5-post-launch/06-honest-map-timing/design.md) | in force |
| 2026-09-10 | Map/rail cross-reference follow-up | [m19.5-post-launch/06-honest-map-timing](m19.5-post-launch/06-honest-map-timing/design.md) | in force |
| 2026-09-10 | Refinement pass: reading zone, scoring, transit order, fold, journal | [m19.5-post-launch/10-scoring-and-transit-order](m19.5-post-launch/10-scoring-and-transit-order/design.md) | split across M19.5-09, -10, -11 |
| 2026-09-15 | Conditions trial on its own route | [m19.5-post-launch/12-conditions-trial](m19.5-post-launch/12-conditions-trial/design.md) | keep/drop pending: M20-04 |
| 2026-09-29 | Spec-driven workflow under .claude/specs; roadmap reordered | [m20-clarity/03-convert-docs-to-specs](m20-clarity/03-convert-docs-to-specs/design.md) | in force |
| 2026-09-29 | Past milestones as full triplets; DESIGN.md/VOICE.md as foundation specs | [m20-clarity/03-convert-docs-to-specs](m20-clarity/03-convert-docs-to-specs/design.md) | in force |
| 2026-09-29 | Three user-selectable looks (A Trail distilled, B Almanac page, C Day dial), every screen, chosen in onboarding; current Trail composition retires; M19.9 runs before M20 | [m19.9-looks/01-three-directions](m19.9-looks/01-three-directions/design.md) | in force; DESIGN.md v5 (M19.9-02) |
| 2026-09-29 | DESIGN.md v5: base + Explorer/Editorial/Instrument looks; terrain shared by all looks; v4 Today composition kept as Legacy until M19.9-11; check.mjs measures SVG labels by fill | [m19.9-looks/02-design-md-looks](m19.9-looks/02-design-md-looks/design.md) | in force |
| 2026-09-29 | Today: agency line closes the first screen (VOICE rule 6 amended); pull-quote board in every look | [m19.9-looks/05-today](m19.9-looks/05-today/design.md) | in force |
| 2026-09-29 | Looks are a trial: every screen still ships in three looks, then the owner picks one permanent look with usage evidence | [m19.9-looks/12-pick-the-permanent-look](m19.9-looks/12-pick-the-permanent-look/requirements.md) | in force |
| 2026-09-29 | M19.8 Foundations inserted, runs alongside M19.9 (error recovery, durable storage, fragment share links, CI, headers, usage counts) | [m19.8-foundations](m19.8-foundations/README.md) | in force |
| 2026-09-29 | Anonymous usage counts: cookieless, fixed event list, no birth data, opt-out + GPC/DNT; dormant until configured; no paid service — stays off until M21 self-hosts Umami (M21-01 R4) | [m19.8-foundations/06-usage-counts](m19.8-foundations/06-usage-counts/design.md) | in force |
| 2026-09-29 | Solar-term table ships packed (JSON stays the audited source); true solar time loads on demand via `ensureTrueSolarReady()`, engine index drops `applyTrueSolarTime`/`equationOfTimeMinutes` | [m19.8-foundations/08-bundle-diet](m19.8-foundations/08-bundle-diet/design.md) | in force |

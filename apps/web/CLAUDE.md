# apps/web conventions

Next.js 15 App Router, static export, Tailwind, localStorage state. No runtime network calls, except optional anonymous usage counts — dormant unless the build is configured, and only through `src/lib/analytics.ts` ([M19.8-06](../../.claude/specs/m19.8-foundations/06-usage-counts/design.md)).

This is the M19 rebuild (packages/presentation view-models, structured content tokens,
single versioned store) — cut over from the old apps/web, which has been deleted. See
`.claude/specs/m19-web-rebuild/` for the phase history.

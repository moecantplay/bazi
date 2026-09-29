# Design — CI on every push

## Approach

`.github/workflows/verify.yml`, one job on `ubuntu-latest`:

1. `actions/checkout@v4`
2. `pnpm/action-setup@v4` (reads `packageManager` from the root `package.json`)
3. `actions/setup-node@v4` — Node 20, `cache: pnpm`
4. `pnpm install --frozen-lockfile`
5. `pnpm verify`
6. `pnpm --filter @daymaster/web exec playwright install --with-deps chromium`
7. `pnpm --filter @daymaster/web e2e:ci` — a new script: build once (with the E2E analytics stub, ticket 06), then the suite once per look.
8. On failure: `actions/upload-artifact@v4` with `apps/web/test-results`.

`CI=true` is set by Actions, so `playwright.config.ts`'s `forbidOnly` and one retry already apply.

`e2e:looks` installs the browser itself on every run; `e2e:ci` skips that because the workflow installs with system deps once.

## Changes

| Area | Change |
| --- | --- |
| `.github/workflows/verify.yml` | New |
| `apps/web/package.json` | `e2e:ci` script |

## Alternatives considered

- Vercel's Git integration running `pnpm build` — gives previews but no tests, and changes the deploy setup the owner relies on.

## Risks

- The memory-noted post-build Chromium crash flake — covered by the one CI retry.
- Runtime: verify ~35 s plus three E2E passes; measured locally in task 2.

## Verification

Run each step's command locally in order; `actionlint`-style check by parsing the YAML; green run on GitHub once pushed.

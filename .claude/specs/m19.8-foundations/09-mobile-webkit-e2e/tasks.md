# Tasks — E2E on phones, including WebKit

Check a task only with a one-line evidence note.

- [x] 1. Projects added; run locally; triage failures (R1, R3) — 207 tests listed; mobile-chromium green first run; mobile-webkit 5 failures, all test assumptions (see design As built); after fixes: trail 206 + 1 skip, almanac 206 + 1 skip, dial 205 + 1 skip + 1 Chromium SEGV flake (desktop project)
- [ ] 2. CI install and run (R2) — workflow installs chromium + webkit with deps, timeout 30 min; green run waits on a push

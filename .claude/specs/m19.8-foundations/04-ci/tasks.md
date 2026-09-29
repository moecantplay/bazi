# Tasks — CI on every push

Check a task only with a one-line evidence note.

- [x] 1. `e2e:ci` script (R1) — `build:e2e` once, then the suite per look
- [x] 2. Run install → verify → e2e:ci locally; record timing (R1) — with `CI=true`: install 0.6 s, verify 34 s, e2e:ci 137 s (69/69, 69/69, 68+1 flaky → exit 0); the flaky test was fixed in its own commit
- [x] 3. `.github/workflows/verify.yml` with artifact upload and concurrency (R1–R3)
- [ ] 4. YAML parses; green on GitHub after the owner pushes — YAML parses (8 steps); GitHub run waits on a push

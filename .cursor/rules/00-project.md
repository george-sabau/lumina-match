---
description: Project intent and session workflow (read history first).
---

## Project goals
- Build a small, dependency-light TypeScript library usable by other frontends/websites for **user-input suggestions**.
- Keep the public API stable (`createMatcher().suggestions()` and `EntityMatcher`).
- Keep performance reasonable for ~2,000 entries.
- Regularly **audit** for deprecated/outdated dependencies and tooling (Node version, GitHub Actions like `actions/setup-node`, `node-version`, etc.) and **propose** the proper updates; **do not apply changes or create commits** until you explicitly agree and have reviewed the plan.

## Mandatory session workflow
- At the start of each work session: **read** `.cursor/HISTORY.md` to understand prior decisions and pitfalls.
- At the end of each work session: **append** a short entry to `.cursor/HISTORY.md` with:
  - what changed
  - what worked / didn’t
  - follow-ups or pitfalls to avoid next time


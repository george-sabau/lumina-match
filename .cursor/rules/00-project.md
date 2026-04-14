---
description: Project intent and session workflow (read history first).
---

## Project goals
- Build a small, dependency-light TypeScript library usable by other frontends/websites for **user-input suggestions**.
- Keep the public API stable (`createMatcher().suggestions()` and `EntityMatcher`).
- Keep performance reasonable for ~2,000 entries.

## Mandatory session workflow
- At the start of each work session: **read** `.cursor/HISTORY.md` to understand prior decisions and pitfalls.
- At the end of each work session: **append** a short entry to `.cursor/HISTORY.md` with:
  - what changed
  - what worked / didn’t
  - follow-ups or pitfalls to avoid next time


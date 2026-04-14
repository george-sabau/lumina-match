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
- Before you do any work, mention how you could verify that work. Make sure you used best practices, were efficient, and didn't introudce any issues.
- Before creating any commit (and before pushing): update `package.json` `version` using **SemVer**, based on the changes made in the current session. Treat versioning as **part of every commit**.
  - **PATCH**: bug fixes, perf improvements, refactors, tests/docs, and other changes that do not alter the public API/behavior.
  - **MINOR**: backwards-compatible new features, new public exports, new options (with safe defaults), expanded behavior that doesn’t break existing callers.
  - **MAJOR**: breaking changes (renames/removals), signature/type changes that break compilation, default behavior changes, stricter validation that can throw/reject where it previously didn’t.
  - If unsure, **choose the higher bump** (safer for consumers), and summarize the reasoning in `.cursor/HISTORY.md`.
- Periodically (and when rules start feeling “noisy”): **self-audit** `.cursor/rules/*.md` and `.cursor/HISTORY.md` and remove/condense anything that is no longer needed, contradictory, duplicative, or bloating effectiveness. Keep guidance crisp and enforceable.
- At the end of each work session: **append** a short entry to `.cursor/HISTORY.md` with:
  - what changed
  - what worked / didn’t
  - follow-ups or pitfalls to avoid next time


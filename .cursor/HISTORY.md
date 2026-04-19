# Session History

## 2026-04-14

- Created initial TypeScript library scaffold (npm + tsup) publishing ESM+CJS.
- Implemented `EntityMatcher` + `createMatcher().suggestions()` API.
- Added Vitest suite with deterministic realistic dataset tests.
- Added GitHub Actions CI for lint/test/build on Node 20/22.

## 2026-04-19

- Codified the session ritual in `.cursor/rules/00-project.md`: read `HISTORY.md` first, skim rules, then use `commit-push` / `release` skills for ship work; fixed self-audit path to `.cursor/skills/*/SKILL.md`; typo fix (“introduce”). `package.json` **0.1.3 → 0.1.4** (PATCH: project guidance).
- Extended [.github/workflows/ci.yml](.github/workflows/ci.yml): `typecheck` in matrix; `publish` job after green `build-test`, only on `push` of tags `refs/tags/v`*, verifies tag matches `package.json` version, then `npm publish` via `NPM_TOKEN`. **0.1.4 → 0.1.5** (PATCH: CI).
- **Worked:** Rules/skills layout clarified; CI gates align with release skill; tag-guarded npm publish.
- **Follow-ups:** Add GitHub secret `NPM_TOKEN` (npm automation token); tag `vX.Y.Z` must equal `package.json` `"version"`.

## 2026-04-19 (workflows)

- Split CI vs publish: [.github/workflows/ci.yml](.github/workflows/ci.yml) runs on **branch** pushes and PRs only (no skipped publish job on `main`). [.github/workflows/publish.yml](.github/workflows/publish.yml) runs only on **`v*.*.*` tags** with the same checks + `npm publish`. **0.1.5 → 0.1.6** (PATCH: tooling).
- **Why:** `publish.if` was false on `refs/heads/main` by design; tag pushes are required for npm. Separate workflow avoids confusing “skipped publish” on every main build.
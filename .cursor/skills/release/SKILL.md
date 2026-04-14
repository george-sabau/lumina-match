---
name: release
description: Prepare and perform a release for this TypeScript library (SemVer bump, quality gates, tag, push, optional publish). Use when the user says release/publish/tag/changelog, or wants to cut a new version.
---

# Release

## Scope

This skill creates a **clean, reproducible release** for `lumina-match`.

- Default behavior is **safe**: verify, propose, then execute.
- **Never** make dependency/tooling updates as part of a release unless the user explicitly approved them (per project rules).

## Workflow (must follow)

### 1) Read project guidance first

- Read `.cursor/rules/*.md` (especially `.cursor/rules/00-project.md`) and `.cursor/HISTORY.md`.
- Apply any constraints (SemVer-per-commit, propose-only audits, etc.).

### 2) Pre-flight repository checks

- Confirm git repo: `git rev-parse --is-inside-work-tree`
- Inspect:
  - `git status` (must be clean unless the user is actively preparing the release commit)
  - `git log -5 --oneline` (message conventions)
  - `git diff` / `git diff --staged` (ensure no surprise changes)
- Confirm branch and upstream: `git branch -vv`

### 3) Decide the SemVer bump (patch/minor/major)

Base the bump on changes since the last version tag (or since last release commit if no tags exist):

- Identify last tag if present: `git describe --tags --abbrev=0` (handle “no tags” case).
- Review changes:
  - `git log <lastTag>..HEAD --oneline` (or `git log --oneline` if no tags)
  - Optionally inspect key exports/public API surfaces when needed.

Choose:
- **PATCH**: fixes/perf/refactors/tests/docs; no public API change.
- **MINOR**: backwards-compatible features/new exports/options with safe defaults.
- **MAJOR**: breaking changes (removals/renames/signature/type/default behavior changes).
- If unsure, pick the **higher** bump.

### 4) Ensure the release commit includes the version bump

From project rules: versioning is **part of each commit**.

- Ensure `package.json` `version` matches the chosen bump.
- Ensure the version bump is included in the commit being released:
  - If a release commit is needed, stage changes and commit with an appropriate message.
  - If the version bump already exists in recent commits, do **not** bump again.

### 5) Run quality gates (must be green)

Run (and stop on failure):
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

If anything fails, fix and re-run before proceeding.

### 6) Tag the release

- Create an annotated tag: `v<version>` (e.g. `v0.1.1`).
- Tag message should be brief and match the release intent.

### 7) Push commits + tags (auth-aware)

- Push commits: `git push`
- Push tags: `git push --tags`

If push fails due to auth:
- If `origin` is HTTPS and git can’t read credentials (e.g. “could not read Username…”), instruct the user to configure **HTTPS with PAT via credential helper** (macOS Keychain) or switch to **SSH**.
- If `origin` is SSH and auth fails (“Permission denied (publickey)”), instruct the user to add/configure an SSH key and retry.

### 8) Optional: publish to npm (only if explicitly requested)

Only run publishing if the user explicitly says to publish.

- Verify package contents are correct (exports/types/dist present).
- Prefer `npm publish --access public` only if appropriate (or omit for private scopes).
- If publishing is done via CI, prepare instructions rather than running local publish unless requested.

## Output expectations

When done, report:
- Version released (e.g. `0.1.2`)
- Tag created (e.g. `v0.1.2`)
- Whether push succeeded (and what to do if auth prevented it)
- Whether publish was performed or just prepared

## Examples

### User: “Cut a patch release”

1. Decide bump = PATCH
2. Ensure `package.json` version bumped in release commit
3. Run tests/lint/typecheck/build
4. Tag `vX.Y.Z`
5. Push commits + tags

### User: “Release and publish to npm”

Follow full workflow, then publish **only after** successful tag + push and explicit user confirmation.


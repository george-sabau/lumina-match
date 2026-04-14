---
name: commit-push
description: Create a git commit from staged files and push the current branch. Use when the user asks to commit and push changes, push the active branch, or automate commit creation. Enforces project rules by reading .cursor/rules/*.md and .cursor/HISTORY.md, ensuring SemVer version bump in package.json before commit, and avoiding unapproved dependency/tooling updates.
---

# Commit + Push

## Scope

This skill is for **shipping changes**: create a commit and push to the **current branch**.

## Workflow (must follow)

### 1) Pre-flight: read project guidance

- Read `.cursor/rules/*.md` (especially `.cursor/rules/00-project.md`) and `.cursor/HISTORY.md`.
- Apply any workflow constraints found there.

### 2) Validate repository state

- Confirm the workspace is a git repository (`git rev-parse --is-inside-work-tree`).
- Inspect:
  - `git status`
  - `git diff` (unstaged)
  - `git diff --staged` (what will be committed)
  - `git log -5 --oneline` (commit message style)
- If the user explicitly requests it (e.g. “add everything” / “git add .”), stage changes using:
  - `git add .`
- Otherwise: **only proceed if there are staged changes**. If nothing is staged, stop and ask the user whether to stage files (do not stage automatically).

### 3) Enforce SemVer bump rule (per commit)

From `.cursor/rules/00-project.md`: **every commit must include an appropriate SemVer bump**.

- Determine bump level from staged changes:
  - **PATCH**: bugfix/perf/refactor/tests/docs; no public API change.
  - **MINOR**: backwards-compatible features; new exports/options with safe defaults.
  - **MAJOR**: breaking API/type/signature/default behavior changes.
  - If unsure, pick the **higher** bump.
- Ensure `package.json` `version` reflects the chosen bump **in the staged changes**.
  - If `package.json` isn’t staged (or the bump is missing), update `package.json`, stage it, and include it in the same commit.

### 4) Respect “propose-only” for dependency/tooling audits

If any staged change updates dependencies/tooling because of an “outdated/deprecated audit” (e.g. GitHub Actions, Node versions, action versions), ensure it was explicitly approved by the user. If approval is unclear, stop and propose instead of committing.

### 5) Draft a high-signal commit message

- Base the message on **staged diff only**.
- Prefer a concise “why”-focused summary.
- Match the repo’s recent style from `git log`.
- Include SemVer bump rationale when helpful (brief).

### 6) Commit safely

- Do **not** alter git config.
- Do **not** use interactive git commands.
- Do **not** force push.
- Avoid `--amend` unless explicitly requested and safe per current session constraints.
- Create the commit using a HEREDOC message (to preserve formatting).

### 7) Push the active branch

- Confirm current branch name (`git branch --show-current`).
- If no upstream is set, push with upstream:
  - `git push -u origin HEAD`
- Otherwise:
  - `git push`

## Examples

### User: “Commit and push what’s staged”

1. Read `.cursor/rules/*.md` and `.cursor/HISTORY.md`
2. Check `git status` / `git diff --staged`
3. Ensure `package.json` version bump is staged (patch/minor/major)
4. Commit with an appropriate message
5. Push current branch (set upstream if needed)


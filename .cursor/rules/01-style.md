---
description: TypeScript/library style rules.
---

## TypeScript
- Prefer **explicit exported types** for any public API surface.
- Use `type` imports (`import type { ... }`) where appropriate.
- Avoid introducing heavy dependencies unless there’s a clear need.

## Packaging
- Keep entrypoints in `src/index.ts` and ensure exports remain consistent.
- Ensure builds output ESM + CJS + `.d.ts`.


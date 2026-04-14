---
description: Testing rules for matcher behavior and realistic data.
---

## Testing expectations
- Include both:
  - small deterministic unit tests (edge cases, correctness)
  - realistic dataset tests (typos, prefixes, punctuation)

## Performance checks
- Avoid brittle microbenchmarks in default CI.
- If timing checks exist, keep them generous and focused on preventing regressions (accidental \(O(n^2)\) blowups).


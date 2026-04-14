# Lumina-Match

A small TypeScript/JavaScript library for **fast user-input suggestions** using a two-stage pipeline:

1. **N-gram filter** (bigrams) to quickly reduce candidates
2. **Fuzzy ranking** (prefix/token overlap/Levenshtein) to sort suggestions

## Install

```bash
npm install lumina-match
```

## Usage

```ts
import { createMatcher } from 'lumina-match';

const myDataSet = [
  { id: 'A-12', phrase: 'Wireless Keyboard Layout' },
  { id: 'B-44', phrase: 'Mechanical Switches Blue' },
  { id: 'C-01', phrase: 'USB-C Charging Cable' }
];

const matcher = createMatcher(myDataSet);

console.log(matcher.suggestions('Kybord'));
// => [{ id: 'A-12', phrase: 'Wireless Keyboard Layout', confidence: 78 }]
```

## API

- `createMatcher(data).suggestions(input, top=10)`\n- `new EntityMatcher(data).suggest(query, limit=5)`\n- `suggestions(data, input, { top })`\n+
### Data types

- `DataItem`: `{ id: string; phrase: string }`\n- `Suggestion`: `{ id: string; phrase: string; confidence: number }` (0–100)\n+

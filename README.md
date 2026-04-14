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

### More examples

#### Get more / fewer suggestions

```ts
import { createMatcher } from 'lumina-match';

const matcher = createMatcher(myDataSet);

matcher.suggestions('usb', 3); // top = 3
matcher.suggestions('usb', 20); // top = 20
```

#### One-off helper (no matcher reuse)

```ts
import { suggestions } from 'lumina-match';

suggestions(myDataSet, 'mech swtch', { top: 5 });
```

#### Use `EntityMatcher` directly

```ts
import { EntityMatcher } from 'lumina-match';

const engine = new EntityMatcher(myDataSet);
engine.suggest('Kybord', 10); // limit = 10
```

#### Typical UI pattern (reuse matcher)

```ts
import { createMatcher } from 'lumina-match';

const matcher = createMatcher(myDataSet);

export function onUserInput(value: string) {
  // Library returns [] for empty/very short queries.
  return matcher.suggestions(value, 10);
}
```

## API

- `createMatcher(data).suggestions(input, top = 10)`
- `new EntityMatcher(data).suggest(query, limit = 5)`
- `suggestions(data, input, { top })`

### Data types

- `DataItem`: `{ id: string; phrase: string }`
- `Suggestion`: `{ id: string; phrase: string; confidence: number }` (0–100)


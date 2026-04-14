import { describe, expect, it } from 'vitest';
import { EntityMatcher, levenshtein } from '../src/matcher/EntityMatcher.js';

describe('levenshtein', () => {
  it('handles empty strings', () => {
    expect(levenshtein('', '')).toBe(0);
    expect(levenshtein('', 'a')).toBe(1);
    expect(levenshtein('a', '')).toBe(1);
  });

  it('computes known distances', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('keyboard', 'kybord')).toBeGreaterThan(0);
  });
});

describe('EntityMatcher.suggest', () => {
  it('returns empty for short queries', () => {
    const matcher = new EntityMatcher([{ id: '1', phrase: 'Wireless Keyboard Layout' }]);
    expect(matcher.suggest('')).toEqual([]);
    expect(matcher.suggest('k')).toEqual([]);
  });

  it('prefers exact and prefix matches', () => {
    const matcher = new EntityMatcher([
      { id: 'A', phrase: 'Wireless Keyboard Layout' },
      { id: 'B', phrase: 'Wireless Keycap Puller' }
    ]);

    const exact = matcher.suggest('wireless keyboard layout', 5);
    expect(exact[0]?.id).toBe('A');
    expect(exact[0]?.confidence).toBe(100);

    const prefix = matcher.suggest('wireless key', 5);
    expect(prefix[0]?.confidence).toBeGreaterThanOrEqual(90);
  });
});


import type { DataItem, Suggestion } from '../types.js';

type PreprocessedEntry = {
  id: string;
  phrase: string;
  normalized: string;
  grams: ReadonlySet<string>;
  tokens: string[];
};

/**
 * EntityMatcher: A high-performance Filter & Rank string similarity engine.
 * Optimized for ~2,000 entries with sub-millisecond ranking.
 */
export class EntityMatcher {
  private readonly data: PreprocessedEntry[];

  constructor(dataList: ReadonlyArray<DataItem>) {
    this.data = dataList.map((item) => {
      const normalized = item.phrase.toLowerCase().trim();
      return {
        id: item.id,
        phrase: item.phrase,
        normalized,
        grams: this.getNGrams(normalized),
        tokens: this.tokenize(normalized)
      };
    });
  }

  private tokenize(str: string): string[] {
    return str.split(/[\s,._-]+/).filter((t) => t.length > 0);
  }

  /**
   * Generates a Set of 2-character sequences from a string
   */
  private getNGrams(str: string): ReadonlySet<string> {
    const grams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      grams.add(str.substring(i, i + 2));
    }
    return grams;
  }

  /**
   * Suggest matches based on a query string
   */
  suggest(query: string, limit = 5): Suggestion[] {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase().trim();
    const qGrams = this.getNGrams(q);
    const qTokens = this.tokenize(q);

    const results = this.data
      .filter((entry) => {
        // --- PHASE 1: N-Gram Filter ---
        // Broad filter: Does it share at least one character sequence?
        let shared = 0;
        for (const gram of qGrams) {
          if (entry.grams.has(gram)) shared++;
        }
        // Allow if there's an overlap OR if the start of the string matches
        return shared > 0 || entry.normalized.startsWith(q.substring(0, 2));
      })
      .map((entry) => {
        // --- PHASE 2: Rank ---
        const score = this.calculateScore(q, qTokens, entry);
        return { entry, score };
      })
      .filter((item) => item.score > 0.35) // Confidence threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results.map(({ entry, score }) => ({
      id: entry.id,
      phrase: entry.phrase,
      confidence: Math.round(score * 100)
    }));
  }

  private calculateScore(q: string, qTokens: string[], entry: PreprocessedEntry): number {
    const target = entry.normalized;

    // 1. High Priority: Exact Match or Prefix
    if (target === q) return 1.0;
    if (target.startsWith(q)) return 0.95;

    // 2. Medium Priority: Token Overlap
    let matchedTokens = 0;
    for (const token of qTokens) {
      if (entry.tokens.some((t) => t === token || t.startsWith(token))) {
        matchedTokens++;
      }
    }

    if (matchedTokens > 0) {
      const ratio = matchedTokens / Math.max(qTokens.length, entry.tokens.length);
      return Math.max(ratio, 0.75);
    }

    // 3. Fallback: Fuzzy Sequence Alignment (Levenshtein)
    // Compare against the whole phrase AND best individual token.
    // This keeps multi-word phrases findable from single-word typos (e.g. "Kybord" -> "Keyboard").
    let best = normalizedSimilarity(q, target);
    for (const t of entry.tokens) {
      best = Math.max(best, normalizedSimilarity(q, t));
    }
    return best;
  }
}

function normalizedSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return (maxLen - distance) / maxLen;
}

export function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i]![j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1]![j - 1]!
          : Math.min(matrix[i - 1]![j - 1]! + 1, matrix[i]![j - 1]! + 1, matrix[i - 1]![j]! + 1);
    }
  }
  return matrix[b.length]![a.length]!;
}


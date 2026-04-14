import type { DataItem, Suggestion, SuggestionsOptions } from './types.js';
import { EntityMatcher } from './matcher/EntityMatcher.js';

export type MatcherApi = {
  suggestions: (input: string, top?: number) => Suggestion[];
};

export function createMatcher(data: ReadonlyArray<DataItem>): MatcherApi {
  const matcher = new EntityMatcher(data);
  return {
    suggestions(input: string, top = 10) {
      return matcher.suggest(input, top);
    }
  };
}

export function suggestions(
  data: ReadonlyArray<DataItem>,
  input: string,
  options: SuggestionsOptions = {}
): Suggestion[] {
  return createMatcher(data).suggestions(input, options.top ?? 10);
}


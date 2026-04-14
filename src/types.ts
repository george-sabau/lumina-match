export type DataItem = {
  id: string;
  phrase: string;
};

export type Suggestion = {
  id: string;
  phrase: string;
  confidence: number;
};

export type SuggestionsOptions = {
  top?: number;
};


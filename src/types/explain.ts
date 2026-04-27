/** Shapes the real backend can match later. */
export type ExplainLanguage = 'en' | 'hi' | 'ta' | 'mr' | 'te' | 'ml' | 'kn' | 'gu' | 'bn';

export type PlainExplanation = {
  simpleTitle: string;
  /** Short meaning in the chosen “simple / local” form (mock: English for most codes). */
  summary: string;
  whatToDo: string | null;
  dueOrDate: string | null;
  watchOut: string | null;
};

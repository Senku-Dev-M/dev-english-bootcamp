export type DayStatus = "locked" | "active" | "completed";

export type ModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface VocabItem {
  term: string;
  translation: string;
  example: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  examples: string[];
}

export type MediaType = "video" | "series" | "article" | "docs";

export interface MediaLink {
  label: string;
  url: string;
  type: MediaType;
  note?: string;
}

/** Match the Cards: pares EN <-> ES */
export interface MatchPair {
  en: string;
  es: string;
}

/** Bug Hunter (fill in the blanks). El template usa `___` para cada hueco, en orden. */
export interface BugHunter {
  intro: string;
  template: string;
  answers: string[];
  wordBank: string[];
}

/** Tech Wordle: palabra técnica a adivinar */
export interface WordleConfig {
  word: string;
  hint: string;
}

export interface DayGames {
  match?: MatchPair[];
  bugHunter?: BugHunter;
  wordle?: WordleConfig;
}

export type GameKey = "match" | "bugHunter" | "wordle";

export interface AITask {
  objective: string;
  placeholder: string;
  promptHint: string;
}

export interface Day {
  id: number;
  module: ModuleId;
  title: string;
  objective: string;
  vocabulary: VocabItem[];
  grammar?: GrammarRule;
  media: MediaLink[];
  games: DayGames;
  aiTask: AITask;
}

export interface Module {
  id: ModuleId;
  title: string;
  subtitle: string;
  range: string;
  dayIds: number[];
}

export interface AIResult {
  score: number;
  feedback: string;
  corrected_text: string;
}

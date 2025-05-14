export type WordStatus = 'red' | 'yellow' | 'green';

export interface Word {
  id: string;
  russianWord: string;
  hebrewTranslation: string;
  status: WordStatus;
  isAssociated: boolean;
  associationWord?: string;
  associationSentence?: string;
  topic?: string;
} 
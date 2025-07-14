export type WordStatus = 'red' | 'yellow' | 'green';

export interface Word {
  id: string;
  russianWord: string;
  hebrewTranslation: string;
  hebrewTransliteration: string;
  status: WordStatus;
  topic?: string;
  hasAssociation?: boolean;
  associationWord?: string;
  association?: string;
  associationSentence?: string;
} 
export interface ConsonantPair {
  voiced: string;
  voiceless: string;
}

export const CONSONANT_PAIRS: ConsonantPair[] = [
  { voiced: 'Б', voiceless: 'П' },
  { voiced: 'В', voiceless: 'Ф' },
  { voiced: 'Г', voiceless: 'К' },
  { voiced: 'Д', voiceless: 'Т' },
  { voiced: 'Ж', voiceless: 'Ш' },
  { voiced: 'З', voiceless: 'С' }
];

export interface ExampleWord {
  word: string;
  transliteration: string;
  translation: string;
}

export const EXAMPLE_WORDS: ExampleWord[] = [
  {
    word: 'Cделал',
    transliteration: 'זְדֶלַל',
    translation: 'עשה'
  },
  {
    word: 'Юбка',
    transliteration: 'יוּפְּקָה',
    translation: 'חצאית'
  },
  {
    word: 'Редко',
    transliteration: 'רֵטְקָה',
    translation: 'לעיתים רחוקות'
  }
]; 
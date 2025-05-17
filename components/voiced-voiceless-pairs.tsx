import React from 'react';
import styles from '../styles/Grammar.module.css';

interface ConsonantPair {
  voiced: string;
  voiceless: string;
}

interface ExampleWord {
  word: string;
  transliteration: string;
  translation: string;
}

const CONSONANT_PAIRS: ConsonantPair[] = [
  { voiced: 'Б', voiceless: 'П' },
  { voiced: 'В', voiceless: 'Ф' },
  { voiced: 'Г', voiceless: 'К' },
  { voiced: 'Д', voiceless: 'Т' },
  { voiced: 'Ж', voiceless: 'Ш' },
  { voiced: 'З', voiceless: 'С' }
];

const EXAMPLE_WORDS: ExampleWord[] = [
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

export default function VoicedVoicelessPairsPage() {
  return (
    <div className={styles.container}>
      <h2>Voiced and Voiceless Consonant Pairs</h2>
      <div className={styles.consonantPairsTable}>
        {CONSONANT_PAIRS.map((pair, index) => (
          <div key={index} className={styles.consonantRow}>
            <div className={`${styles.consonantCell} ${styles.voicedCell}`}>
              {pair.voiced}
            </div>
            <div className={`${styles.consonantCell} ${styles.voicelessCell}`}>
              {pair.voiceless}
            </div>
          </div>
        ))}
      </div>

      <h3>Example Words</h3>
      <div className={styles.examplesTable}>
        {EXAMPLE_WORDS.map((example, index) => (
          <div key={index} className={styles.exampleRow}>
            <div>{example.word}</div>
            <div>{example.transliteration}</div>
            <div>{example.translation}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 
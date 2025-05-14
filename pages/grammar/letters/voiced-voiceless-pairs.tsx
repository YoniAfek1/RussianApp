import React from 'react';
import styles from '../../../styles/Grammar.module.css';

interface ConsonantPair {
  voiced: string;
  voiceless: string;
}

export const CONSONANT_PAIRS: ConsonantPair[] = [
  // ... existing code ...
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
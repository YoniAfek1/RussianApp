import React from 'react';
import styles from '../styles/Grammar.module.css';

interface ConsonantPair {
  voiced: string;
  voiceless: string;
}

const CONSONANT_PAIRS: ConsonantPair[] = [
  { voiced: 'Б', voiceless: 'П' },
  { voiced: 'В', voiceless: 'Ф' },
  { voiced: 'Г', voiceless: 'К' },
  { voiced: 'Д', voiceless: 'Т' },
  { voiced: 'Ж', voiceless: 'Ш' },
  { voiced: 'З', voiceless: 'С' }
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
    </div>
  );
} 
import React from 'react';
import styles from '../../../styles/Grammar.module.css';
import { CONSONANT_PAIRS, EXAMPLE_WORDS, type ExampleWord, type ConsonantPair } from './voiced-voiceless-pairs.ts';

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
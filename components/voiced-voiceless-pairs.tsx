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
      <div className={styles.consonantPairsWrapper}>
        <h2 className={styles.consonantPairsTitle}>זוגות עיצורים קוליים וחסרי קול</h2>
        <p className={styles.topicExplanation}>
          ברוסית, עיצורים רבים יוצרים זוגות - אחד קולי ואחד חסר קול. הבדל זה חשוב בהגייה ובכתיב.
        </p>
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
        
        <div className={styles.ruleSection}>
          <h3>כלל חשוב</h3>
          <p>
            כאשר עיצור קולי נמצא בסוף מילה או לפני עיצור חסר קול, הוא הופך לעיצור חסר קול.
            <br />
            לדוגמה: <strong>друг</strong> (חבר) נהגה כמו <strong>друк</strong>
          </p>
        </div>
      </div>
    </div>
  );
} 
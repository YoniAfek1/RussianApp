import React from 'react';
import styles from '../../../styles/Grammar.module.css';
import { LightbulbToggle } from '../../../components/LightbulbToggle';

interface AdverbEntry {
  russian: string;
  transliteration: string;
  translation: string;
}

const COMMON_ADVERBS: AdverbEntry[] = [
  { russian: 'быстро', transliteration: 'בִּיסְטְרַה', translation: 'במהירות' },
  { russian: 'громко', transliteration: 'גְרוֹמְקַה', translation: 'בקול רם' },
  { russian: 'тихо', transliteration: 'טִיחַה', translation: 'בשקט' },
  { russian: 'медленно', transliteration: 'מְיֶדְלֶנַה', translation: 'באיטיות' },
  { russian: 'хорошо', transliteration: 'חַרַשׁוֹ', translation: 'טוב' },
  { russian: 'плохо', transliteration: 'פְּלוֹחַה', translation: 'רע' },
  { russian: 'далеко', transliteration: 'דַלְיֶקוֹ', translation: 'רחוק' },
  { russian: 'близко', transliteration: 'בְּלִיזְקוֹ', translation: 'קרוב' },
  { russian: 'много', transliteration: 'מְנוֹגַה', translation: 'הרבה' },
  { russian: 'мало', transliteration: 'מַאלַה', translation: 'מעט' }
];

interface ExampleSentence {
  russian: string;
  hebrew: string;
  transliteration: string;
}

const EXAMPLE_SENTENCES: ExampleSentence[] = [
  {
    russian: 'Он идёт быстро.',
    hebrew: 'הוא הולך במהירות',
    transliteration: 'אוֹן אִידְיוֹט בִּיסְטְרַה'
  },
  {
    russian: 'Она играет тихо.',
    hebrew: 'היא משחקת בשקט',
    transliteration: 'אַנָה אִיגְרַיֵיט טִיחַה'
  }
];

export default function AdverbsPage() {
  return (
    <div className={styles.topicContent}>
      <h2>תואר הפועל</h2>
      
      {/* Introduction */}
      <p className={styles.topicExplanation}>
        תואר הפועל הוא מילה שמתארת <strong>איך</strong>, <strong>מתי</strong>, <strong>איפה</strong> או <strong>באיזה אופן</strong> פעולה מתבצעת.
        <br />
        לדוגמה: הוא מדבר <strong>במהירות</strong>, היא הולכת <strong>בשקט</strong>.
      </p>

      {/* Grammar Rule */}
      <div className={styles.ruleSection}>
        <LightbulbToggle>
          <h3>כלל דקדוקי</h3>
          <p>
            ברוסית, תוארי פועל רבים נגזרים משמות תואר על ידי החלפת הסיומת שלהם, לרוב מ־<strong>־ый / ий</strong> ל־<strong>־о</strong>.
            <br />
            לדוגמה: <strong>быстрый</strong> (מהיר) ← <strong>быстро</strong> (במהירות)
          </p>
        </LightbulbToggle>
      </div>

      {/* Adverbs Table */}
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>מילה ברוסית</th>
              <th>תעתיק עברי</th>
              <th>תרגום לעברית</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_ADVERBS.map((adverb, index) => (
              <tr key={index}>
                <td>{adverb.russian}</td>
                <td className={styles.transliterationCell}>{adverb.transliteration}</td>
                <td>{adverb.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Example Sentences */}
      <div className={styles.examplesSection}>
        <h3 className={styles.examplesTitle}>משפטים לדוגמה</h3>
        <div className={styles.examplesList}>
          {EXAMPLE_SENTENCES.map((example, index) => (
            <div key={index} className={styles.exampleWord}>
              <div className={styles.wordText}>
                <p><strong>{example.russian}</strong></p>
                <p>{example.hebrew}</p>
                <p>תעתיק: <strong>{example.transliteration}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
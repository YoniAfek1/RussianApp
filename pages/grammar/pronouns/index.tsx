import React from 'react';
import styles from '../../../styles/Grammar.module.css';
import { LightbulbToggle } from '../../../components/LightbulbToggle';

interface Pronoun {
  person: string;
  russian: string;
  transliteration: string;
  english: string;
  number: 'singular' | 'plural';
}

const PRONOUNS: Pronoun[] = [
  { person: 'אני', russian: 'Я', transliteration: 'יַא', english: 'I', number: 'singular' },
  { person: 'אתה / את', russian: 'Ты', transliteration: 'טִי', english: 'You (informal)', number: 'singular' },
  { person: 'הוא', russian: 'Он', transliteration: 'אוֹן', english: 'He', number: 'singular' },
  { person: 'היא', russian: 'Она', transliteration: 'אַנָה', english: 'She', number: 'singular' },
  { person: 'אנחנו', russian: 'Мы', transliteration: 'מִי', english: 'We', number: 'plural' },
  { person: 'אתם / אתן', russian: 'Вы', transliteration: 'וִי', english: 'You (formal/plural)', number: 'plural' },
  { person: 'הם / הן', russian: 'Они', transliteration: 'אַנִי', english: 'They', number: 'plural' },
];

export default function PronounsPage() {
  return (
    <div className={styles.topicContent}>
      <h2>כינויי גוף</h2>
      <p className={styles.topicExplanation}>
        כינויי גוף הם מילים שמחליפות שמות עצם. ברוסית, כינויי הגוף משתנים לפי גוף, מספר ומין.
      </p>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>מספר</th>
              <th>כתיב ברוסית</th>
              <th>תעתיק עברי</th>
              <th>תרגום לעברית</th>
            </tr>
          </thead>
          <tbody>
            {PRONOUNS.map((entry, index) => (
              <tr key={index} className={entry.number === 'singular' ? styles.singularRow : styles.pluralRow}>
                <td>{entry.number === 'singular' ? 'יחיד' : 'רבים'}</td>
                <td>{entry.russian}</td>
                <td>{entry.transliteration}</td>
                <td>{entry.person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.ruleSection}>
        <LightbulbToggle>
          <h3>כתיב רשמי</h3>
          <p>
            כאשר מדברים אל אדם אחד בצורה מכובדת או רשמית, נהוג לפנות אליו בגוף רבים – "вы", גם אם הוא יחיד.
            <br />
            זה מקביל לשימוש ב"אתה" רשמי בעברית, כמו "כבודו".
          </p>
        </LightbulbToggle>
      </div>
    </div>
  );
} 
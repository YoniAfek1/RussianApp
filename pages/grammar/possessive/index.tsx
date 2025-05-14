import React from 'react';
import styles from '../../../styles/Grammar.module.css';

interface PossessivePronoun {
  person: string;
  masculine: string;
  feminine: string;
  neuter: string;
  plural: string;
  translation: string;
}

const POSSESSIVE_PRONOUNS: PossessivePronoun[] = [
  {
    person: 'אני',
    masculine: 'мой',
    feminine: 'моя',
    neuter: 'моё',
    plural: 'мои',
    translation: 'שלי'
  },
  {
    person: 'אתה/את',
    masculine: 'твой',
    feminine: 'твоя',
    neuter: 'твоё',
    plural: 'твои',
    translation: 'שלך'
  },
  {
    person: 'הוא',
    masculine: 'его',
    feminine: 'его',
    neuter: 'его',
    plural: 'его',
    translation: 'שלו'
  },
  {
    person: 'היא',
    masculine: 'её',
    feminine: 'её',
    neuter: 'её',
    plural: 'её',
    translation: 'שלה'
  },
  {
    person: 'אנחנו',
    masculine: 'наш',
    feminine: 'наша',
    neuter: 'наше',
    plural: 'наши',
    translation: 'שלנו'
  },
  {
    person: 'אתם/אתן',
    masculine: 'ваш',
    feminine: 'ваша',
    neuter: 'ваше',
    plural: 'ваши',
    translation: 'שלכם/ן'
  },
  {
    person: 'הם/הן',
    masculine: 'их',
    feminine: 'их',
    neuter: 'их',
    plural: 'их',
    translation: 'שלהם/ן'
  }
];

const EXAMPLE_SENTENCES = [
  {
    russian: 'Это моя книга.',
    hebrew: 'זה הספר שלי.',
    transliteration: 'אֶטַה מַיָה קְנִיגַה'
  },
  {
    russian: 'Где твоё окно?',
    hebrew: 'איפה החלון שלך?',
    transliteration: 'גְדֶה טְבוֹיוֹ אַקְנוֹ?'
  },
  {
    russian: 'Это их машина.',
    hebrew: 'זו המכונית שלהם.',
    transliteration: 'אֶטַה אִיח מַשִׁינַה'
  }
];

export default function PossessivePage() {
  return (
    <div className={styles.topicContent}>
      <h2>שייכות – כינויי שייכות</h2>
      
      <p className={styles.topicExplanation}>
        כינויי שייכות ברוסית מציינים למי שייך <strong>שם העצם</strong>.
        <br />
        כמו בעברית – שלי, שלך, שלנו...
        <br />
        אך בניגוד לעברית, <strong>כינויי שייכות ברוסית משתנים לפי מין ומספר של שם העצם</strong> (ולא לפי בעליו בלבד).
        <br />
        🧠 זוהי <strong>טעות נפוצה</strong> – להתאים את כינוי השייכות לדובר במקום לעצם.
      </p>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>גוף</th>
              <th>זכר</th>
              <th>נקבה</th>
              <th>סתמי</th>
              <th>רבים</th>
              <th>תרגום</th>
            </tr>
          </thead>
          <tbody>
            {POSSESSIVE_PRONOUNS.map((pronoun, index) => (
              <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td>{pronoun.person}</td>
                <td><strong>{pronoun.masculine}</strong></td>
                <td><strong>{pronoun.feminine}</strong></td>
                <td><strong>{pronoun.neuter}</strong></td>
                <td><strong>{pronoun.plural}</strong></td>
                <td>{pronoun.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.examplesSection}>
        <h3>דוגמאות</h3>
        {EXAMPLE_SENTENCES.map((sentence, index) => (
          <div key={index} className={styles.exampleSentence}>
            <p className={styles.russianText}>{sentence.russian}</p>
            <p className={styles.transliteration}>{sentence.transliteration}</p>
            <p className={styles.hebrewText}>{sentence.hebrew}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 
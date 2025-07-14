import React from 'react';
import styles from '../../../styles/Grammar.module.css';

interface Preposition {
  russian: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}

interface Conjunction {
  russian: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}

const PREPOSITIONS: Preposition[] = [
  {
    russian: 'в',
    translation: 'ב־ / ל־',
    example: 'Я в школе',
    exampleTranslation: 'אני בבית ספר'
  },
  {
    russian: 'на',
    translation: 'על / ב־',
    example: 'Книга на столе',
    exampleTranslation: 'הספר על השולחן'
  },
  {
    russian: 'с',
    translation: 'עם / מ־',
    example: 'Он пошёл с другом',
    exampleTranslation: 'הוא הלך עם חבר'
  },
  {
    russian: 'у',
    translation: 'ליד / יש ל־',
    example: 'У меня есть книга',
    exampleTranslation: 'יש לי ספר'
  },
  {
    russian: 'к',
    translation: 'אל',
    example: 'Я иду к врачу',
    exampleTranslation: 'אני הולך אל הרופא'
  },
  {
    russian: 'из',
    translation: 'מתוך / מ־',
    example: 'Я из Израиля',
    exampleTranslation: 'אני מישראל'
  },
  {
    russian: 'по',
    translation: 'לאורך / לפי',
    example: 'Мы идём по улице',
    exampleTranslation: 'אנחנו הולכים לאורך הרחוב'
  }
];

const CONJUNCTIONS: Conjunction[] = [
  {
    russian: 'и',
    translation: 'ו',
    example: 'Я люблю чай и кофе',
    exampleTranslation: 'אני אוהב תה וקפה'
  },
  {
    russian: 'но',
    translation: 'אבל',
    example: 'Он пришёл, но устал',
    exampleTranslation: 'הוא בא, אבל היה עייף'
  },
  {
    russian: 'потому что',
    translation: 'כי',
    example: 'Я бегу, потому что опаздываю',
    exampleTranslation: 'אני רץ כי אני מאחר'
  },
  {
    russian: 'если',
    translation: 'אם',
    example: 'Если будет дождь, мы не пойдём',
    exampleTranslation: 'אם ירד גשם, לא נלך'
  },
  {
    russian: 'а',
    translation: 'ואילו / אבל',
    example: 'Я читаю, а он пишет',
    exampleTranslation: 'אני קורא, ואילו הוא כותב'
  },
  {
    russian: 'чтобы',
    translation: 'כדי ש־',
    example: 'Я учусь, чтобы понимать',
    exampleTranslation: 'אני לומד כדי להבין'
  }
];

export default function PrepositionsPage() {
  return (
    <div className={styles.topicContent}>
      <h2>מילות יחס וקישור</h2>
      
      <div className={styles.prepositionsSection}>
        <h3>מילות יחס</h3>
        <p className={styles.topicExplanation}>
          מילות יחס ברוסית מציינות <strong>מקום, זמן, שייכות וכיוון</strong>, ותמיד באות <strong>לפני שם עצם או כינוי גוף</strong>.
          <br />
          שימו לב: המילה שאחריהן משתנה לפי <strong>יחסה</strong> (מפורט בחלק ייחסות).
        </p>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>מילה ברוסית</th>
                <th>תרגום</th>
                <th>דוגמה ברוסית</th>
                <th>תרגום הדוגמה</th>
              </tr>
            </thead>
            <tbody>
              {PREPOSITIONS.map((prep, index) => (
                <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td><strong>{prep.russian}</strong></td>
                  <td>{prep.translation}</td>
                  <td>{prep.example}</td>
                  <td>{prep.exampleTranslation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.conjunctionsSection}>
        <h3>מילות קישור</h3>
        <p className={styles.topicExplanation}>
          מילות קישור מחברות בין <strong>משפטים, רעיונות או פעולות</strong>, אך בניגוד למילות יחס – <strong>הן לא משנות את צורת המילה שאחריהן</strong>.
          <br />
          הן משמשות ליצירת קשרים לוגיים כמו סיבה, ניגוד, תוצאה, תנאי ועוד.
        </p>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>מילה ברוסית</th>
                <th>תרגום</th>
                <th>דוגמה ברוסית</th>
                <th>תרגום הדוגמה</th>
              </tr>
            </thead>
            <tbody>
              {CONJUNCTIONS.map((conj, index) => (
                <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td><strong>{conj.russian}</strong></td>
                  <td>{conj.translation}</td>
                  <td>{conj.example}</td>
                  <td>{conj.exampleTranslation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
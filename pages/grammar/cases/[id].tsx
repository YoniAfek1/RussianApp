import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../../styles/Grammar.module.css';

interface CaseEnding {
  gender: string;
  nominativeEnding: string;
  caseEnding: string;
  example: string;
}

interface CommonWord {
  word: string;
  translation: string;
}

interface Case {
  id: number;
  hebrewName: string;
  russianName: string;
  description: string;
  example: string;
  exampleTranslation: string;
  endings: CaseEnding[];
  commonWords: CommonWord[];
  color: string;
}

const CASES: Case[] = [
  {
    id: 1,
    hebrewName: 'נומינטיבית',
    russianName: 'именительный падеж',
    description: 'זוהי היחסה הבסיסית – משתמשים בה כאשר שם העצם הוא נושא המשפט.',
    example: 'мама читает',
    exampleTranslation: 'אמא קוראת',
    endings: [
      { gender: 'משפחה', nominativeEnding: '-а / -я', caseEnding: '-а / -я', example: 'книга / неделя' },
      { gender: 'אבן', nominativeEnding: '—', caseEnding: '—', example: 'стол' },
      { gender: 'רכות', nominativeEnding: '-о / -е', caseEnding: '-о / -е', example: 'окно / море' },
      { gender: 'רבים', nominativeEnding: '-ы / -и', caseEnding: '-ы / -и', example: 'столы / книги' }
    ],
    commonWords: [
      { word: 'ללא מילת יחס', translation: 'תמיד מופיעה ללא מילת יחס' },
      { word: 'לפני פועל', translation: 'משמשת לפני פועל' }
    ],
    color: '#E3F2FD'
  },
  {
    id: 2,
    hebrewName: 'גנטיבית',
    russianName: 'родительный падеж',
    description: 'משמשת לציון שייכות, חוסר, חלק ממשהו, או אחרי מילות יחס מסוימות.',
    example: 'нет сахара',
    exampleTranslation: 'אין סוכר',
    endings: [
      { gender: 'משפחה', nominativeEnding: '-а / -я', caseEnding: '-ы / -и', example: 'книга → книги' },
      { gender: 'אבן', nominativeEnding: '—', caseEnding: '-а / -я', example: 'стол → стола' },
      { gender: 'רכות', nominativeEnding: '-о / -е', caseEnding: '-а / -я', example: 'окно → окна' },
      { gender: 'רבים', nominativeEnding: '-ы / -и', caseEnding: '— / -ов / -ей', example: 'книги → книг' }
    ],
    commonWords: [
      { word: 'нет', translation: 'אין' },
      { word: 'без', translation: 'בלי' },
      { word: 'до', translation: 'עד' },
      { word: 'от', translation: 'מ־' },
      { word: 'около', translation: 'ליד' },
      { word: 'для', translation: 'בשביל' },
      { word: 'после', translation: 'אחרי' },
      { word: 'у', translation: 'יש ל־' },
      { word: 'из', translation: 'מתוך' },
      { word: 'много / мало / достаточно', translation: 'הרבה, מעט, מספיק' }
    ],
    color: '#E8F5E9'
  },
  // ... Add other cases here
];

export default function CasePage() {
  const router = useRouter();
  const { id } = router.query;
  const caseId = parseInt(id as string);
  const currentCase = CASES.find(c => c.id === caseId);

  if (!currentCase) {
    return <div>Case not found</div>;
  }

  return (
    <div className={styles.casesContainer}>
      <Link href="/grammar" className={styles.backButton}>
        חזרה לנושאים
      </Link>

      <div className={styles.casesNavigation}>
        {CASES.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/grammar/cases/${caseItem.id}`}
            className={`${styles.caseButton} ${caseItem.id === caseId ? styles.activeCase : ''}`}
            style={{
              backgroundColor: caseItem.color,
              borderColor: caseItem.id === caseId ? '#2c3e50' : caseItem.color,
              color: '#2c3e50'
            }}
          >
            <div>יחסה {caseItem.id}</div>
            <div>{caseItem.hebrewName}</div>
            <div className={styles.russianName}>{caseItem.russianName}</div>
          </Link>
        ))}
      </div>

      <div className={styles.caseContent}>
        <h2 className={styles.caseTitle}>
          יחסה {currentCase.id} – {currentCase.hebrewName} ({currentCase.russianName})
        </h2>

        <p className={styles.caseDescription}>{currentCase.description}</p>

        <div className={styles.exampleContainer}>
          <p className={styles.exampleText}>
            <strong>דוגמה:</strong> {currentCase.example}
          </p>
          <p className={styles.exampleTranslation}>{currentCase.exampleTranslation}</p>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>מין/מספר</th>
                <th>סיומת נומינטיב</th>
                <th>סיומת ביחסה</th>
                <th>דוגמה</th>
              </tr>
            </thead>
            <tbody>
              {currentCase.endings.map((ending, index) => (
                <tr key={index}>
                  <td>{ending.gender}</td>
                  <td>{ending.nominativeEnding}</td>
                  <td>{ending.caseEnding}</td>
                  <td>{ending.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.commonWordsContainer}>
          <h3 className={styles.commonWordsTitle}>מילים / שימושים שכיחים:</h3>
          <ul className={styles.commonWordsList}>
            {currentCase.commonWords.map((word, index) => (
              <li key={index}>
                <strong>{word.word}</strong> – {word.translation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 
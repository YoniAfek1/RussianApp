import React, { useState } from 'react';
import styles from '../../../styles/cases.module.css';
import Link from 'next/link';

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
  description: string;
  example: string;
  exampleTranslation: string;
  endings: CaseEnding[];
  commonWords: CommonWord[];
  color: string;
}

interface CaseSummary {
  caseName: string;
  hebrewName: string;
  family: string;
  stone: string;
  soft: string;
  plural: string;
  commonWords: string[];
  color: string;
}

const CASES: Case[] = [
  {
    id: 1,
    hebrewName: 'נומינטיבית',
    description: 'זוהי היחסה הבסיסית – משתמשים בה כאשר שם העצם הוא נושא המשפט. אין שינוי במילה.',
    example: 'мама читает',
    exampleTranslation: 'אמא קוראת',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'а / я', example: 'мама / папа' },
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'о / е / _', example: 'стол / окно / море'},
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'ь', example: 'любовь / ночь' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: 'ы / и', example: 'столы / книги' }
    ],
    commonWords: [
      { word: 'ללא מילת יחס', translation: 'תמיד מופיעה ללא מילת יחס' },
      { word: 'לפני פועל', translation: 'משמשת לפני פועל' }
    ],
    color: '#E3F2FD' // Light blue
  },
  {
    id: 2,
    hebrewName: 'גנטיבית',
    description: 'משמשת לציון שייכות, חוסר, חלק ממשהו, או אחרי מילות יחס מסוימות.',
    example: 'нет сахара',
    exampleTranslation: 'אין סוכר',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'ы / и', example: 'мама → мамы' },
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'а / я', example: 'стол → стола' },
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'и', example: 'любовь → любви' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: '— / ов / ей', example: 'книги → книг' }
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
      { word: 'много / мало', translation: 'הרבה, מעט' }
    ],
    color: '#E8F5E9' // Light green
  },
  {
    id: 3,
    hebrewName: 'דטיבית',
    description: 'מציינת מושא עקיף – למי או עבור מי נעשתה פעולה. מתאים להוספת "ל־" לפני שם העצם בעברית.',
    example: 'я дал книгу другу',
    exampleTranslation: 'נתתי ספר לחבר',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'е', example: 'мама → маме' },  
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'у / ю', example: 'стол → столу' },
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'и', example: 'любовь → любви' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: 'ам / ям', example: 'книги → книгам' }
    ],
    commonWords: [
      { word: 'давать / подарить', translation: 'לתת' },
      { word: 'помогать', translation: 'לעזור' },
      { word: 'звонить', translation: 'להתקשר ל־' },
      { word: 'к', translation: 'אל' },
      { word: 'по', translation: 'לאורך, לפי' }
    ],
    color: '#FFF3E0' // Light orange
  },
  {
    id: 4,
    hebrewName: 'אקוזטיבית',
    description: 'מציינת מושא ישיר – את מי? את מה?',
    example: 'я вижу собаку',
    exampleTranslation: 'אני רואה כלב',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'у / ю', example: 'мама → маму' },
      { gender: 'אבן חיה', nominativeEnding: 'о / е / _', caseEnding: 'а / я', example: 'брат → брата' },
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'אין שינוי', example: 'стол → стол' },
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'אין שינוי', example: 'любовь → любовь' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: 'ы / и', example: 'книги → книги' }
    ],
    commonWords: [
      { word: 'видеть', translation: 'לראות' },
      { word: 'любить', translation: 'לאהוב' },
      { word: 'знать', translation: 'לדעת' },
      { word: 'читать', translation: 'לקרוא' },
      { word: 'смотреть', translation: 'לצפות' }
    ],
    color: '#FCE4EC' // Light pink
  },
  {
    id: 5,
    hebrewName: 'אינסטרומנטלית',
    description: 'מציינת באמצעות מה או עם מי נעשתה פעולה.',
    example: 'я пишу ручкой',
    exampleTranslation: 'אני כותב עם עט',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'ой / ей', example: 'мама → мамой' },
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'ом / ем', example: 'стол → столом' },
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'ю', example: 'любовь → любовью' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: 'ами / ями', example: 'книги → книгами' }
    ],
    commonWords: [
      { word: 'работать кем?', translation: 'לעבוד כ־' },
      { word: 'писать чем?', translation: 'לכתוב ב־' },
      { word: 'с', translation: 'עם' },
      { word: 'над / под / перед / за', translation: 'למעלה / מתחת / לפני / מאחור' }
    ],
    color: '#F3E5F5' // Light purple
  },
  {
    id: 6,
    hebrewName: 'פרפוזיציונית',
    description: 'משמשת רק עם מילות יחס – בעיקר לציון מקום או נושא.',
    example: 'я в школе',
    exampleTranslation: 'אני בבית ספר',
    endings: [
      { gender: 'משפחה', nominativeEnding: 'а / я', caseEnding: 'е', example: 'мама → маме' },
      { gender: 'אבן', nominativeEnding: 'о / е / _', caseEnding: 'е', example: 'стол → столе' },
      { gender: 'רכות', nominativeEnding: 'ь', caseEnding: 'и', example: 'любовь → любви' },
      { gender: 'רבים', nominativeEnding: 'ы / и', caseEnding: 'ах / ях', example: 'книги → книгах' }
    ],
    commonWords: [
      { word: 'в', translation: 'ב־' },
      { word: 'на', translation: 'על / ב־' },
      { word: 'о / об', translation: 'על (נושא)' }
    ],
    color: '#E0F7FA' // Light cyan
  }
];

const CASE_SUMMARY: CaseSummary[] = [
  {
    caseName: 'Nominative',
    hebrewName: 'נומינטיבית',
    family: 'а / я',
    stone: 'о / е / -',
    soft: 'ь',
    plural: 'ы / и',
    commonWords: ['נושא המשפט (אין מילת יחס מפעילה)'],
    color: '#E3F2FD'
  },
  {
    caseName: 'Genitive',
    hebrewName: 'גנטיבית',
    family: 'ы / и',
    stone: 'а / я',
    soft: 'и',
    plural: 'ов / ей / ∅',
    commonWords: ['без', 'у', 'нет', 'около', 'после', 'для', 'из', 'много'],
    color: '#E8F5E9'
  },
  {
    caseName: 'Dative',
    hebrewName: 'דטיבית',
    family: 'е',
    stone: 'у / ю',
    soft: 'и',
    plural: 'ам / ям',
    commonWords: ['к', 'по'],
    color: '#FFF3E0'
  },
  {
    caseName: 'Accusative',
    hebrewName: 'אקוזטיבית',
    family: 'у / ю',
    stone: '—',
    soft: '—',
    plural: 'ы / и',
    commonWords: ['видеть', 'смотреть'],
    color: '#FCE4EC'
  },
  {
    caseName: 'Instrumental',
    hebrewName: 'אינסטרומנטלית',
    family: 'ой / ей',
    stone: 'ом / ем',
    soft: 'ю',
    plural: 'ами / ями',
    commonWords: ['с', 'между', 'над', 'под'],
    color: '#F3E5F5'
  },
  {
    caseName: 'Prepositional',
    hebrewName: 'פרפוזיציונית',
    family: 'е',
    stone: 'е',
    soft: 'и',
    plural: 'ах / ях',
    commonWords: ['в', 'на', 'о', 'при'],
    color: '#E0F7FA'
  }
];

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<number | 'summary' | 'explanation'>('explanation');
  const currentCase = typeof selectedCase === 'number' ? CASES.find(c => c.id === selectedCase) : null;

  return (
    <div className={styles.casesContainer}>
      <h2 className={styles.casesTitle}>ייחסות</h2>
      
      <div className={styles.casesNavigation}>
        {CASES.map((caseItem) => (
          <button
            key={caseItem.id}
            onClick={() => setSelectedCase(caseItem.id)}
            className={
              `${styles.caseButton} ${styles[`case${caseItem.id}`]} ${caseItem.id === selectedCase ? styles.activeCase : ''}`
            }
          >
            <div>יחסה {caseItem.id}</div>
            <div>{caseItem.hebrewName}</div>
          </button>
        ))}
      </div>
      <div className={styles.bottomNavRow}>
        <button
          onClick={() => setSelectedCase('explanation')}
          className={
            `${styles.caseButton} ${styles.explanation} ${selectedCase === 'explanation' ? styles.activeCase : ''}`
          }
        >
          <div>הסבר</div>
        </button>
        <button
          onClick={() => setSelectedCase('summary')}
          className={
            `${styles.caseButton} ${styles.summary} ${selectedCase === 'summary' ? styles.activeCase : ''}`
          }
        >
          <div>סיכום</div>
          <div>טבלת סיומות</div>
        </button>
      </div>

      {selectedCase === 'summary' ? (
        <div className={styles.caseContent}>
          <h2 className={styles.caseTitle}>טבלת סיכום סיומות</h2>
          
          <div className={styles.summaryTableContainer}>
            <table className={styles.summaryTable}>
              <thead>
                <tr>
                  <th>יחסה</th>
                  <th>משפחה</th>
                  <th>אבן</th>
                  <th>רכות</th>
                  <th>רבים</th>
                  <th>מילים שכיחות</th>
                </tr>
              </thead>
              <tbody>
                {CASE_SUMMARY.map((caseSum, index) => (
                  <tr 
                    key={caseSum.caseName}
                    data-case={index + 1}
                  >
                    <td className={styles.caseSummaryName}>
                      <div>יחסה {index + 1}</div>
                    </td>
                    <td>{caseSum.family}</td>
                    <td>{caseSum.stone}</td>
                    <td>{caseSum.soft}</td>
                    <td>{caseSum.plural}</td>
                    <td className={styles.commonWordsCell}>
                      {caseSum.commonWords.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedCase === 'explanation' ? (
        <div className={styles.caseContent}>
          <h2 className={styles.caseTitle}>מה זה ייחסות?</h2>
          <p className={styles.caseDescription}>
            בשפה הרוסית, לכל שם עצם יש תפקיד במשפט - נושא, מושא ישיר, מושא עקיף וכו'. כדי להבין מה תפקיד המילה, היא משתנה בהתאם ל"ייחסה" (כמו בעברית – אני, אותי, לי). ברוסית יש 6 ייחסות עיקריות, ולכל אחת צורת סיומת שונה לשם העצם. כדי לדעת איך שם עצם משתנה, חשוב לדעת לאיזו קבוצת ייחוס הוא שייך.
          </p>
          <h3 className={styles.caseTitle}>שלוש קבוצות ייחוס עיקריות:</h3>
          <ul className={styles.commonWordsList}>
            <li>
              <strong>🏠 קבוצת המשפחה – סיומות: а / я</strong><br/>
              שמות עצם שמסתיימים ב־а או я שייכים לרוב למין נקבה.<br/>
              <b>דוגמאות:</b><br/>
              мама (אמא)<br/>
              сестра (אחות)
            </li>
            <li style={{marginTop: '1em'}}>
              <strong>🪨 קבוצת האבן – סיומות: עיצור / о / е</strong><br/>
              שמות עצם שמסתיימים בעיצור, о או е שייכים לרוב למין זכר או ניטרלי.<br/>
              <b>דוגמאות:</b><br/>
              стол (שולחן) – זכר<br/>
              море (ים) – ניטרלי
            </li>
            <li style={{marginTop: '1em'}}>
              <strong>💗 קבוצת הרכות – סיומת: ь</strong><br/>
              שמות עצם שמסתיימים ב־ь שייכים לרוב למין נקבה, אך יש גם יוצאי דופן.<br/>
              <b>דוגמאות:</b><br/>
              ночь (לילה) – נקבה<br/>
              дверь (דלת) – נקבה
            </li>
          </ul>
          <p className={styles.caseDescription} style={{ marginTop: '1.5em' }}>
          בנוסף לשלוש הקבוצות, קיימת גם קבוצה של מילים ברבים – גם לה יש סיומות משתנות לפי כל יחסה.
          </p>
        </div>
      ) : currentCase && (
        <div className={styles.caseContent}>
          <h2 className={styles.caseTitle}>
            יחסה {currentCase.id}
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
                  <th>סיומת מקורית</th>
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
      )}
    </div>
  );
} 
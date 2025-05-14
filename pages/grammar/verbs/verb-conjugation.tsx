import { useState } from 'react';
import styles from '../../../styles/Grammar.module.css';

interface ConjugationData {
  pronoun: string;
  ending: string;
  example: string;
}

interface TenseData {
  title: string;
  description?: string;
  conjugations: ConjugationData[];
}

interface InfinitiveExample {
  verb: string;
  transliteration: string;
  translation: string;
}

const COMMON_INFINITIVES: InfinitiveExample[] = [
  { verb: 'читать', transliteration: "צ'יטַט", translation: 'לקרוא' },
  { verb: 'писать', transliteration: 'פִּיסַט', translation: 'לכתוב' },
  { verb: 'говорить', transliteration: 'גַווַרִיטְ', translation: 'לדבר' },
  { verb: 'идти', transliteration: 'אִיטִי', translation: 'ללכת' },
  { verb: 'есть', transliteration: 'יֶסט', translation: 'לאכול' },
  { verb: 'спать', transliteration: 'סְפַּאט', translation: 'לישון' },
  { verb: 'смотреть', transliteration: 'סְמַטרֵטְ', translation: 'להסתכל' },
  { verb: 'делать', transliteration: 'דֵלַט', translation: 'לעשות' },
  { verb: 'думать', transliteration: 'דוּמַט', translation: 'לחשוב' },
  { verb: 'знать', transliteration: 'זְנַט', translation: 'לדעת' }
];

const VERB_CONJUGATIONS: Record<string, TenseData> = {
  infinitive: {
    title: 'שם פועל',
    conjugations: []
  },
  present: {
    title: 'הווה',
    conjugations: [
      { pronoun: 'אני', ending: '-ю / -у', example: 'говорю' },
      { pronoun: 'אתה', ending: '-ишь', example: 'говоришь' },
      { pronoun: 'את', ending: '-ишь', example: 'говоришь' },
      { pronoun: 'הוא', ending: '-ит', example: 'говорит' },
      { pronoun: 'היא', ending: '-ит', example: 'говорит' },
      { pronoun: 'אנחנו', ending: '-им', example: 'говорим' },
      { pronoun: 'אתם/אתן', ending: '-ите', example: 'говорите' },
      { pronoun: 'הם/הן', ending: '-ят / -ют', example: 'говорят' }
    ]
  },
  past: {
    title: 'עבר',
    description: '💬 ברוסית, פעלים בזמן עבר משתנים רק על סמך מין ומספר, לא לפי גוף.',
    conjugations: [
      { pronoun: 'זכר', ending: '-л', example: 'говорил' },
      { pronoun: 'נקבה', ending: '-ла', example: 'говорила' },
      { pronoun: 'רבים', ending: '-ли', example: 'говорили' }
    ]
  },
  future: {
    title: 'עתיד',
    conjugations: [
      { pronoun: 'אני', ending: 'שם הפועל + буду', example: 'буду говорить' },
      { pronoun: 'אתה', ending: 'שם הפועל + будешь', example: 'будешь говорить' },
      { pronoun: 'את', ending: 'שם הפועל + будешь', example: 'будешь говорить' },
      { pronoun: 'הוא', ending: 'שם הפועל +  будет', example: 'будет говорить' },
      { pronoun: 'היא', ending: 'שם הפועל +  будет', example: 'будет говорить' },
      { pronoun: 'אנחנו', ending: 'שם הפועל +  будем', example: 'будем говорить' },
      { pronoun: 'אתם/אתן', ending: 'שם הפועל +  будете', example: 'будете говорить' },
      { pronoun: 'הם/הן', ending: 'שם הפועל +  будут', example: 'будут говорить' }
    ]
  }
};

export const VerbConjugation = () => {
  const [activeTense, setActiveTense] = useState('infinitive');
  const activeTenseData = VERB_CONJUGATIONS[activeTense];

  return (
    <div className={styles.verbConjugation}>
      <div className={styles.verbTabs}>
        {Object.entries(VERB_CONJUGATIONS).map(([key, { title }]) => (
          <button
            key={key}
            className={`${styles.verbTab} ${activeTense === key ? styles.activeTab : ''}`}
            onClick={() => setActiveTense(key)}
          >
            {title}
          </button>
        ))}
      </div>

      {activeTense === 'infinitive' ? (
        <div className={styles.infinitiveExamples}>
          <h4 className={styles.examplesTitle}>שמות פועל נפוצים ברוסית:</h4>
          <div className={styles.examplesTable}>
            <div className={styles.examplesHeader}>
              <div>פועל ברוסית</div>
              <div>תעתיק עברי</div>
              <div>תרגום לעברית</div>
            </div>
            {COMMON_INFINITIVES.map((example, index) => (
              <div key={index} className={styles.exampleRow}>
                <div className={styles.russianVerb}>{example.verb}</div>
                <div>{example.transliteration}</div>
                <div>{example.translation}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h3 className={styles.verbTableTitle}>
            💬 הטיית הפועל говорить ב{activeTenseData.title}
          </h3>

          {activeTenseData.description && (
            <p className={styles.tenseDescription}>{activeTenseData.description}</p>
          )}

          <div className={styles.conjugationTable}>
            <div className={styles.tableHeader}>
              <div className={styles.pronounCol}>צורה</div>
              <div className={styles.endingCol}>סיומת</div>
              <div className={styles.exampleCol}>דוגמה</div>
            </div>
            {activeTenseData.conjugations.map((conjugation, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.pronounCol}>{conjugation.pronoun}</div>
                <div className={styles.endingCol}><strong>{conjugation.ending}</strong></div>
                <div className={styles.exampleCol}>{conjugation.example}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}; 
import React from 'react';
import styles from '../../../styles/Grammar.module.css';

interface AdjectiveEnding {
  gender: string;
  ending: string;
}

interface AdjectiveExample {
  noun: string;
  nounTranslation: string;
  adjective: string;
  transliteration: string;
  translation: string;
  gender: 'masculine' | 'feminine' | 'neuter' | 'plural';
}

const ADJECTIVE_ENDINGS: AdjectiveEnding[] = [
  { gender: 'זכר', ending: '-ый / -ий' },
  { gender: 'נקבה', ending: '-ая' },
  { gender: 'סתמי', ending: '-ое' },
  { gender: 'רבים', ending: '-ые / -ие' }
];

const ADJECTIVE_EXAMPLES: AdjectiveExample[] = [
  // Masculine examples
  {
    noun: 'мальчик',
    nounTranslation: 'ילד',
    adjective: 'весёлый',
    transliteration: 'וֵסְיוֹלִי',
    translation: 'שמח',
    gender: 'masculine'
  },
  {
    noun: 'дом',
    nounTranslation: 'בית',
    adjective: 'большой',
    transliteration: 'בּוֹלְשׁוֹי',
    translation: 'גדול',
    gender: 'masculine'
  },
  {
    noun: 'стол',
    nounTranslation: 'שולחן',
    adjective: 'круглый',
    transliteration: 'קְרוּגְלִי',
    translation: 'עגול',
    gender: 'masculine'
  },
  // Feminine examples
  {
    noun: 'девочка',
    nounTranslation: 'ילדה',
    adjective: 'красивая',
    transliteration: 'קְרַסִיבַיָה',
    translation: 'יפה',
    gender: 'feminine'
  },
  {
    noun: 'машина',
    nounTranslation: 'מכונית',
    adjective: 'красная',
    transliteration: 'קְרַסְנַיָה',
    translation: 'אדומה',
    gender: 'feminine'
  },
  {
    noun: 'комната',
    nounTranslation: 'חדר',
    adjective: 'светлая',
    transliteration: 'סְבֵטְלַיָה',
    translation: 'מואר',
    gender: 'feminine'
  },
  // Neuter examples
  {
    noun: 'небо',
    nounTranslation: 'שמיים',
    adjective: 'голубое',
    transliteration: 'גוֹלוּבּוֹיֶה',
    translation: 'כחול',
    gender: 'neuter'
  },
  {
    noun: 'солнце',
    nounTranslation: 'שמש',
    adjective: 'тёплое',
    transliteration: 'טְיוֹפְּלוֹיֶה',
    translation: 'חמה',
    gender: 'neuter'
  },
  // Plural examples
  {
    noun: 'книги',
    nounTranslation: 'ספרים',
    adjective: 'новые',
    transliteration: 'נוֹבִיֶה',
    translation: 'חדשים',
    gender: 'plural'
  },
  {
    noun: 'люди',
    nounTranslation: 'אנשים',
    adjective: 'добрые',
    transliteration: 'דוֹבְּרִיֶה',
    translation: 'טובים',
    gender: 'plural'
  }
];

const getGenderColor = (gender: string) => {
  switch (gender) {
    case 'masculine':
      return styles.masculineRow;
    case 'feminine':
      return styles.feminineRow;
    case 'neuter':
      return styles.neuterRow;
    case 'plural':
      return styles.pluralRow;
    default:
      return '';
  }
};

const ColorLegend = () => (
  <div className={styles.colorLegend}>
    <div className={styles.legendItem}>
      <div className={`${styles.legendColor} ${styles.masculine}`}></div>
      <span>זכר</span>
    </div>
    <div className={styles.legendItem}>
      <div className={`${styles.legendColor} ${styles.feminine}`}></div>
      <span>נקבה</span>
    </div>
    <div className={styles.legendItem}>
      <div className={`${styles.legendColor} ${styles.neuter}`}></div>
      <span>סתמי</span>
    </div>
    <div className={styles.legendItem}>
      <div className={`${styles.legendColor} ${styles.plural}`}></div>
      <span>רבים</span>
    </div>
  </div>
);

export default function AdjectivesPage() {
  return (
    <div className={styles.topicContent}>
      <h2>שם תואר</h2>
      
      {/* Introduction */}
      <p className={styles.topicExplanation}>
        שם תואר ברוסית משתנה לפי שם העצם שהוא מתאר.
        <br />
        הוא מתאים ל־<strong>מין</strong> (זכר / נקבה / סתמי) ו־<strong>מספר</strong> (יחיד / רבים) של שם העצם.
      </p>

      {/* Basic Endings Table */}
      <div className={styles.ruleSection}>
        <h3>סיומות שם התואר</h3>
        <table className={styles.endingsTable}>
          <thead>
            <tr>
              <th>מין/מספר</th>
              <th>סיומת תואר</th>
            </tr>
          </thead>
          <tbody>
            {ADJECTIVE_ENDINGS.map((ending, index) => (
              <tr key={index} className={getGenderColor(ending.gender.toLowerCase())}>
                <td>{ending.gender}</td>
                <td><strong>{ending.ending}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Examples Table */}
      <div className={styles.tableContainer}>
        <h3>דוגמאות</h3>
        <ColorLegend />
        <table>
          <thead>
            <tr>
              <th>שם עצם ברוסית</th>
              <th>תרגום שם העצם</th>
              <th>תואר ברוסית</th>
              <th>תעתיק</th>
              <th>תרגום</th>
            </tr>
          </thead>
          <tbody>
            {ADJECTIVE_EXAMPLES.map((example, index) => (
              <tr key={index} className={getGenderColor(example.gender)}>
                <td>{example.noun}</td>
                <td>{example.nounTranslation}</td>
                <td>{example.adjective}</td>
                <td className={styles.transliterationCell}>{example.transliteration}</td>
                <td>{example.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
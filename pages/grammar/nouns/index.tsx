import React from 'react';
import styles from '../../../styles/Grammar.module.css';

interface NounEnding {
  gender: string;
  ending: string;
  example: string;
  translation: string;
}

interface NounPluralPattern {
  gender: string;
  singularEnding: string;
  pluralEnding: string;
  example: string;
}

interface NounExample {
  singular: string;
  singularTranslation: string;
  plural: string;
  pluralTranslation: string;
  gender: 'masculine' | 'feminine' | 'neuter';
  icon?: string;
  transliteration?: {
    singular: string;
    plural: string;
  };
}

const NOUN_ENDINGS: NounEnding[] = [
  {
    gender: 'זכר',
    ending: 'עיצור סופי',
    example: 'стол',
    translation: 'שולחן'
  },
  {
    gender: 'נקבה',
    ending: 'а- / я-',
    example: 'книга',
    translation: 'ספר'
  },
  {
    gender: 'סתמי',
    ending: 'о- / е-',
    example: 'окно',
    translation: 'חלון'
  }
];

const PLURAL_PATTERNS: NounPluralPattern[] = [
  {
    gender: 'זכר',
    singularEnding: 'עיצור סופי',
    pluralEnding: 'ы- / и-',
    example: 'стол → столы'
  },
  {
    gender: 'נקבה',
    singularEnding: 'а- / я-',
    pluralEnding: 'ы- / и-',
    example: 'книга → книги'
  },
  {
    gender: 'סתמי',
    singularEnding: 'о- / е-',
    pluralEnding: 'а- / я-',
    example: 'окно → окна'
  }
];

const NOUN_EXAMPLES: NounExample[] = [
  {
    singular: 'стол',
    singularTranslation: 'שולחן',
    plural: 'столы',
    pluralTranslation: 'שולחנות',
    gender: 'masculine',
    icon: '🪑',
    transliteration: {
      singular: 'סְטוֹל',
      plural: 'סְטוֹלִי'
    }
  },
  {
    singular: 'книга',
    singularTranslation: 'ספר',
    plural: 'книги',
    pluralTranslation: 'ספרים',
    gender: 'feminine',
    icon: '📚',
    transliteration: {
      singular: 'קְנִיגַה',
      plural: 'קְנִיגִי'
    }
  },
  {
    singular: 'окно',
    singularTranslation: 'חלון',
    plural: 'окна',
    pluralTranslation: 'חלונות',
    gender: 'neuter',
    icon: '🪟',
    transliteration: {
      singular: 'אַקְנוֹ',
      plural: 'אוֹקְנַה'
    }
  },
  {
    singular: 'неделя',
    singularTranslation: 'שבוע',
    plural: 'недели',
    pluralTranslation: 'שבועות',
    gender: 'feminine',
    icon: '📅',
    transliteration: {
      singular: 'נִדֶלְיַה',
      plural: 'נִדֶלִי'
    }
  },
  {
    singular: 'шкаф',
    singularTranslation: 'ארון',
    plural: 'шкафы',
    pluralTranslation: 'ארונות',
    gender: 'masculine',
    icon: '🗄️',
    transliteration: {
      singular: 'שְׁקַף',
      plural: 'שְׁקַפִי'
    }
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
  </div>
);

export const NounsPage = () => {
  return (
    <div className={styles.topicContent}>
      <h2>שם עצם</h2>
      
      {/* Introduction */}
      <p className={styles.topicExplanation}>
        שם עצם ברוסית הוא מילה שמתארת דבר, אדם, מקום או רעיון.
        <br />
        שמות עצם משתנים לפי:
        <ul>
          <li><strong>מין דקדוקי</strong> (זכר / נקבה / סתמי)</li>
          <li><strong>מספר</strong> (יחיד / רבים)</li>
          <li>(ובהמשך – גם <strong>יחסה</strong>)</li>
        </ul>
        בדף זה נתמקד בהבדלים <strong>בין יחיד לרבים</strong> בצורה הבסיסית ביותר.
      </p>

      {/* Singular Endings Table */}
      <div className={styles.ruleSection}>
        <h3>סיומות שמות עצם ביחיד</h3>
        <ColorLegend />
        <table className={styles.endingsTable}>
          <thead>
            <tr>
              <th>מין</th>
              <th>סיומת נפוצה</th>
              <th>דוגמה</th>
              <th>תרגום</th>
            </tr>
          </thead>
          <tbody>
            {NOUN_ENDINGS.map((ending, index) => (
              <tr key={index} className={getGenderColor(ending.gender === 'זכר' ? 'masculine' : ending.gender === 'נקבה' ? 'feminine' : 'neuter')}>
                <td>{ending.gender}</td>
                <td><strong>{ending.ending}</strong></td>
                <td>{ending.example}</td>
                <td>{ending.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plural Patterns Table */}
      <div className={styles.ruleSection}>
        <h3>סיומות ברבים</h3>
        <table className={styles.endingsTable}>
          <thead>
            <tr>
              <th>מין</th>
              <th>סיומת ביחיד</th>
              <th>סיומת ברבים</th>
              <th>דוגמה</th>
            </tr>
          </thead>
          <tbody>
            {PLURAL_PATTERNS.map((pattern, index) => (
              <tr key={index} className={getGenderColor(pattern.gender === 'זכר' ? 'masculine' : pattern.gender === 'נקבה' ? 'feminine' : 'neuter')}>
                <td>{pattern.gender}</td>
                <td>{pattern.singularEnding}</td>
                <td><strong>{pattern.pluralEnding}</strong></td>
                <td>{pattern.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.ruleNote}>
          💡 טיפ: הסיומת <strong>-и</strong> תופיע במקום <strong>-ы</strong> אחרי אותיות רכות או אחרי г, к, х, ж, ч...
        </p>
      </div>

      {/* Examples Table */}
      <div className={styles.tableContainer}>
        <h3>דוגמאות מעשיות</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>שם עצם ביחיד</th>
              <th>תרגום</th>
              <th>שם עצם ברבים</th>
              <th>תרגום</th>
              <th>תעתיק</th>
            </tr>
          </thead>
          <tbody>
            {NOUN_EXAMPLES.map((example, index) => (
              <tr key={index} className={getGenderColor(example.gender)}>
                <td>{example.icon}</td>
                <td>{example.singular}</td>
                <td>{example.singularTranslation}</td>
                <td>{example.plural}</td>
                <td>{example.pluralTranslation}</td>
                <td className={styles.transliterationCell}>
                  {example.transliteration?.singular} ← {example.transliteration?.plural}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
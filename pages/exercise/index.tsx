import Link from 'next/link';
import styles from '../../styles/Exercise.module.css';

const options = [
  {
    id: 'nouns',
    title: 'שם עצם',
    icon: '/animations/grammar/bone.png',
    path: '/grammar/nouns/game'
  },
  {
    id: 'adjectives',
    title: 'שם תואר',
    icon: '/animations/grammar/colors.png',
    path: '/grammar/adjectives/game'
  },
  {
    id: 'numbers',
    title: 'מספרים',
    icon: '/animations/grammar/numbers.png',
    path: '/grammar/numbers/game'
  },
  {
    id: 'verbs',
    title: 'שם פועל',
    icon: '/animations/grammar/tools.png',
    path: '/grammar/verbs/game'
  }
];

export default function Exercise() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>תרגול</h1>
      <div className={styles.optionsGrid}>
        {options.map((option) => (
          <Link
            key={option.id}
            href={option.path}
            className={styles.optionCard}
          >
            <span className={styles.optionText}>{option.title}</span>
            <span className={styles.icon}>
              <img src={option.icon} alt={option.title} className={styles.iconImage} />
            </span>
          </Link>
        ))}
        {/* Listening Button */}
        <Link href="/hearing" className={styles.optionCard} style={{ pointerEvents: 'auto', opacity: 1 }}>
          <span className={styles.optionText}>האזנה</span>
          <span className={styles.icon}>
            <img src="/animations/headphone.png" alt="Listening Icon" className={styles.iconImage} />
          </span>
        </Link>
        {/* Vocabulary Button */}
        <Link href="/words/game" className={styles.optionCard}>
          <span className={styles.optionText}>מילים</span>
          <span className={styles.icon}>
            <img src="/animations/book.png" alt="Vocabulary Icon" className={styles.iconImage} />
          </span>
        </Link>
        {/* Speaking Placeholder Button */}
        <div className={styles.optionCard} style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}>
          <span className={styles.optionText}>דיבור – בקרוב</span>
          <span className={styles.icon}>
            <img src="/animations/mic.png" alt="Speaking Icon" className={styles.iconImage} />
          </span>
        </div>
      </div>
      <div className={styles.bottomAnim}>
        <img src="/animations/anna2.gif" alt="anna animation" className={styles.annaImage} />
      </div>
    </div>
  );
} 
import Link from 'next/link';
import styles from '../../styles/Exercise.module.css';

const options = [
  {
    id: 'nouns',
    title: 'שם עצם',
    icon: '/animations/grammar/bone.png',
    path: '/games/noun'
  },
  {
    id: 'adjectives',
    title: 'שם תואר',
    icon: '/animations/grammar/colors.png',
    path: '/games/adjective'
  },
  {
    id: 'numbers',
    title: 'מספרים',
    icon: '/animations/grammar/numbers.png',
    path: '/games/numbers'
  },
  {
    id: 'verbs',
    title: 'שם פועל',
    icon: '/animations/grammar/tools.png',
    path: '/games/verb'
  }
];

export default function Exercise() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מה נתרגל</h1>
      <div className={styles.optionsGrid}>
        {options.map((option) => (
          <Link
            key={option.id}
            href={option.path}
            className={styles.optionCard}
          >
            <span className={styles.icon}>
              <img src={option.icon} alt={option.title} className={styles.iconImage} />
            </span>
            <span className={styles.optionText}>{option.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 
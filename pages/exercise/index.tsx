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
      </div>
      <div className={styles.bottomAnim}>
        <video src="/animations/annaV2.mp4" autoPlay loop muted playsInline className={styles.annaImage} />
      </div>
    </div>
  );
} 
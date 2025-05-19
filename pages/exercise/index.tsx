import Link from 'next/link';
import { FaBook, FaCalculator, FaFont, FaLanguage } from 'react-icons/fa';
import styles from './Exercise.module.css';

export default function Exercise() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מה נתרגל</h1>
      <div className={styles.optionsGrid}>
      <Link href="/practice" className={styles.optionCard}>
          <span className={styles.icon}>
            <FaBook />
          </span>
          <span className={styles.optionText}>אוצר מילים</span>
        </Link>
        <Link href="/grammar/nouns/game" className={styles.optionCard}>
          <span className={styles.icon}>
            <FaBook />
          </span>
          <span className={styles.optionText}>שם עצם</span>
        </Link>
        <Link href="/grammar/adjectives/game" className={styles.optionCard}>
          <span className={styles.icon}>
            <FaFont />
          </span>
          <span className={styles.optionText}>שם תואר</span>
        </Link>
        <Link href="grammar/numbers/game" className={styles.optionCard}>
          <span className={styles.icon}>
            <FaCalculator />
          </span>
          <span className={styles.optionText}>מספרים</span>
        </Link>
        <Link href="/grammar/verbs/game" className={styles.optionCard}>
          <span className={styles.icon}>
            <FaLanguage />
          </span>
          <span className={styles.optionText}>שם פועל</span>
        </Link>
      </div>
    </div>
  );
} 
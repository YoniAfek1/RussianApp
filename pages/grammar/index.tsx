import Link from 'next/link';
import { FaBook, FaFont, FaCalculator, FaLanguage } from 'react-icons/fa';
import styles from '@/styles/Grammar.module.css';

export default function Grammar() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>דקדוק רוסי</h1>
      <div className={styles.topicsGrid}>
        <Link href="/grammar/nouns" className={styles.topicCard}>
          <span className={styles.icon}>
            <FaBook />
          </span>
          <h2 className={styles.topicTitle}>שם עצם</h2>
          <p className={styles.topicDescription}>איך נכין לימונדה בלי לדעת להגיד לימון?</p>
        </Link>

        <Link href="/grammar/adjectives" className={styles.topicCard}>
          <span className={styles.icon}>
            <FaFont />
          </span>
          <h2 className={styles.topicTitle}>שם תואר</h2>
          <p className={styles.topicDescription}>איך נספר על החתול השחור והכלב הלבן?</p>
        </Link>

        <Link href="/grammar/numbers" className={styles.topicCard}>
          <span className={styles.icon}>
            <FaCalculator />
          </span>
          <h2 className={styles.topicTitle}>מספרים</h2>
          <p className={styles.topicDescription}>איך נספור עד עשר ברוסית?</p>
        </Link>

        <Link href="/grammar/verbs" className={styles.topicCard}>
          <span className={styles.icon}>
            <FaLanguage />
          </span>
          <h2 className={styles.topicTitle}>שם פועל</h2>
          <p className={styles.topicDescription}>איך נספר על מה אנחנו עושים?</p>
        </Link>
      </div>
    </div>
  );
} 
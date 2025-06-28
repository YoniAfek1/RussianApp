// דף הבית: הפנייה לעמוד הלמידה או הצגת מבוא
import Link from 'next/link';
import { FaBook, FaChalkboardTeacher, FaHeadphones, FaLanguage } from 'react-icons/fa';
import styles from '../styles/HomePage.module.css';

export default function Home() {
  return (
    <div className={styles.homeBg}>
      <header className={styles.headerSection}>
        <h1 className={styles.header}>Добро пожаловать - ברוכים הבאים </h1>
        <h2 className={styles.subheader}>что мы узнаем сегодня ? מה נלמד היום</h2>
      </header>
      <main className={styles.mainNav}>
      <Link href="/dailyWord" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/book.png" alt="daily word Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>אוצר מילים</span>
        <span className={styles.buttonSubtext}>למדו מילים בעזרת אסוציאציות</span>
        </Link>
        <Link href="/dailySong" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/song.png" alt="daily song Icon" className={styles.iconImage} />
        </span>
        <span className={styles.buttonText}>שיר יומי</span>
        <span className={styles.buttonSubtext}>נחשו את השיר שתורגם לרוסית</span>
        </Link>
        <Link href="/exercise" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/play.png" alt="practice Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>תרגול</span>
        <span className={styles.buttonSubtext}>שמות עצם, תואר, פועל ומספרים</span>
        </Link>
        <Link href="/grammar" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/rule.png" alt="Grammar Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>דקדוק</span>
        <span className={styles.buttonSubtext}>יסודות הדקדוק הרוסי בפשטות</span>
        </Link>
        <Link href="/conversations" className={`${styles.navButton} ${styles.fullWidthButton}`}>
        <span className={styles.icon}>
          <img src="/animations/mask.png" alt="mask Icon" className={styles.iconImage} />
        </span>
        <div className={styles.textColumn}>
          <span className={styles.buttonText}>שיחות</span>
          <span className={styles.buttonSubtext}>ai התנסו בשיחות הכוללות משחקי תפקידים עם</span>
        </div>
        </Link>
      </main>
      <div className={styles.bottomAnim}>
        <video src="/animations/waves.mp4" autoPlay loop muted playsInline className={styles.wavingAnim} />
      </div>
      {/* TODO: Add 'ראשי' (Home) to the sidebar navigation with a home icon */}
    </div>
  );
}
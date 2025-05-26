// דף הבית: הפנייה לעמוד הלמידה או הצגת מבוא
import Link from 'next/link';
import { FaBook, FaChalkboardTeacher, FaHeadphones, FaLanguage } from 'react-icons/fa';
import styles from '../styles/HomePage.module.css';

export default function Home() {
  return (
    <div className={styles.homeBg}>
      <header className={styles.headerSection}>
        <h1 className={styles.header}>ברוכים הבאים - Добро пожаловать</h1>
        <h2 className={styles.subheader}>מה נלמד היום ? Что мы узнаем сегодня</h2>
      </header>
      <main className={styles.mainNav}>
        <Link href="/vocabulary" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/book.png" alt="vocabulary Icon" className={styles.iconImage} />
        </span>           
        <span className={styles.buttonText}>אוצר מילים</span>
        </Link>
        <Link href="/exercise" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/play.png" alt="practice Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>תרגול</span>
        </Link>
        <Link href="/grammar" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/rule.png" alt="Grammar Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>דקדוק</span>
        </Link>
        <Link href="/hearing" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/headphone.png" alt="hearing Icon" className={styles.iconImage} />
        </span>        
        <span className={styles.buttonText}>האזנה</span>
        </Link>
        <Link href="/conversations" className={styles.navButton}>
        <span className={styles.icon}>
        <img src="/animations/headphone.png" alt="hearing Icon" className={styles.iconImage} />
        </span>           
        <span className={styles.buttonText}>שיחות</span>
        </Link>
      </main>
      <div className={styles.bottomAnim}>
        <video src="/animations/waves2.mp4" autoPlay loop muted playsInline className={styles.wavingAnim} />
      </div>
      {/* TODO: Add 'ראשי' (Home) to the sidebar navigation with a home icon */}
    </div>
  );
}
import Link from 'next/link';
import styles from '../../styles/Grammar.module.css';

const topics = [
  {
    id: 'letters',
    title: 'אותיות',
    description: 'האלף־בית הרוסי: 33 סיבות להתאהב ',
    icon: '/animations/grammar/letters.png',
    path: '/grammar/letters'
  },
  {
    id: 'pronouns',
    title: 'כינויי גוף',
    description: 'כי אי אפשר לדבר רק על עצמך... או שכן?',
    icon: '/animations/grammar/pronoun.png',
    path: '/grammar/pronouns'
  },
  {
    id: 'nouns',
    title: 'שם עצם',
    description: 'איך נכין לימונדה בלי לדעת להגיד לימון?',
    icon: '/animations/grammar/bone.png',
    path: '/grammar/nouns'
  },
  {
    id: 'numbers',
    title: 'מספרים',
    description: 'ללמוד לספור כבשים לפניי השינה',
    icon: '/animations/grammar/numbers.png',
    path: '/grammar/numbers'
  },
  {
    id: 'possessive',
    title: 'שייכות',
    description: 'לדעת מה שלי, מה שלך, ומה שייך לחתול',
    icon: '/animations/grammar/key.png',
    path: '/grammar/possessive'
  },
  {
    id: 'prepositions',
    title: 'יחס וקישור',
    description: 'כי גם למילים מגיע קצת יחס',
    icon: '/animations/grammar/connect.png',
    path: '/grammar/prepositions'
  },
  {
    id: 'verbs',
    title: 'שם פועל',
    description: 'מי שזורע – קוצר',
    icon: '/animations/grammar/tools.png',
    path: '/grammar/verbs'
  },
  {
    id: 'adverbs',
    title: 'תואר הפועל',
    description: 'המתבל של המשפט',
    icon: '/animations/grammar/salt.png',
    path: '/grammar/adverbs'
  },
  {
    id: 'adjectives',
    title: 'שם תואר',
    description: 'אחרת איך נגיד שהאוכל טעים?',
    icon: '/animations/grammar/colors.png',
    path: '/grammar/adjectives'
  },
  {
    id: 'cases',
    title: 'ייחסות',
    description: 'כל הכבוד! הגעת לבוס',
    icon: '/animations/grammar/cases.png',
    path: '/grammar/cases'
  }
];

export default function Grammar() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>דקדוק רוסי</h1>
        <p className={styles.subtitle}>
          לימוד יסודות הדקדוק הרוסי בצורה פשוטה ומובנת
        </p>

        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={topic.path}
              className={styles.topicCard}
            >
              {typeof topic.icon === 'string' && topic.icon.endsWith('.png') ? (
                <img src={topic.icon} alt={topic.title} className={styles.topicIconImage} />
              ) : (
                <span className={styles.topicIcon}>{topic.icon}</span>
              )}
              <h2 className={styles.topicTitle}>{topic.title}</h2>
              <p className={styles.topicDescription}>{topic.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
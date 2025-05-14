import React, { useState, ComponentType } from 'react';
import styles from '../styles/Grammar.module.css';
import LettersPage from './grammar/letters';
import NumberTablesPage from './grammar/numbers/number-tables';
import VerbConjugationPage from './grammar/verbs/verb-conjugation';
import AdverbsPage from './grammar/adverbs';
import AdjectivesPage from './grammar/adjectives';
import NounsPage from './grammar/nouns';
import PronounsPage from './grammar/pronouns';
import PossessivePage from './grammar/possessive';
import PrepositionsPage from './grammar/prepositions';
import CasesPage from './grammar/cases';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: ComponentType;
}

const topics: Topic[] = [
  {
    id: 'letters',
    title: 'אותיות',
    description: 'האלף־בית הרוסי: 33 סיבות להתאהב ',
    icon: '/animations/grammar/letters.png',
    component: LettersPage
  },
  {
    id: 'pronouns',
    title: 'כינויי גוף',
    description: 'כי אי אפשר לדבר רק על עצמך... או שכן?',
    icon: '/animations/grammar/pronoun.png',
    component: PronounsPage
  },
  {
    id: 'numbers',
    title: 'מספרים',
    description: 'אם אי פעם רצית לספור תפוחי אדמה ברוסית ולא ידעת איך',
    icon: '/animations/grammar/numbers.png',
    component: NumberTablesPage
  },
  {
    id: 'nouns',
    title: 'שם עצם',
    description: 'איך נכין לימונדה בלי לדעת להגיד לימון?',
    icon: '/animations/grammar/bone.png',
    component: NounsPage
  },
  {
    id: 'possessive',
    title: 'שייכות',
    description: 'לדעת מה שלי, מה שלך, ומה בכלל שייך לחתול',
    icon: '/animations/grammar/key.png',
    component: PossessivePage
  },
  {
    id: 'prepositions',
    title: 'מילות יחס וקישור',
    description: 'כי גם למילים מגיע קצת יחס',
    icon: '/animations/grammar/connect.png',
    component: PrepositionsPage
  },
  {
    id: 'verbs',
    title: 'שם פועל',
    description: 'מי שזורע – קוצר',
    icon: '/animations/grammar/tools.png',
    component: VerbConjugationPage
  },
  {
    id: 'adverbs',
    title: 'תואר הפועל',
    description: 'הפועל מבשל את המשפט, תואר הפועל מתבל אותו',
    icon: '/animations/grammar/salt.png',
    component: AdverbsPage
  },
  {
    id: 'adjectives',
    title: 'שם תואר',
    description: 'אחרת איך נגיד שהאוכל טעים?',
    icon: '/animations/grammar/colors.png',
    component: AdjectivesPage
  },
  {
    id: 'cases',
    title: 'ייחסות',
    description: 'כל הכבוד! הגעת לבוס',
    icon: '/animations/grammar/cases.png',
    component: CasesPage
  }
];

export default function Grammar() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const renderContent = () => {
    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return null;

    const Component = topic.component;
    return (
      <div className={styles.topicContent}>
        <h2>{topic.title}</h2>
        <p className={styles.topicExplanation}>
          {topic.description}
        </p>
        <Component />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>דקדוק רוסי</h1>
        <p className={styles.subtitle}>
          לימוד יסודות הדקדוק הרוסי בצורה פשוטה ומובנת
        </p>

        {!selectedTopic ? (
          <div className={styles.topicsGrid}>
            {topics.map((topic) => (
              <button
                key={topic.id}
                className={styles.topicCard}
                onClick={() => setSelectedTopic(topic.id)}
              >
              {typeof topic.icon === 'string' && topic.icon.endsWith('.png') ? (
                <img src={topic.icon} alt={topic.title} className={styles.topicIconImage} />
              ) : (
                <span className={styles.topicIcon}>{topic.icon}</span>
              )}
                <h2 className={styles.topicTitle}>{topic.title}</h2>
                <p className={styles.topicDescription}>{topic.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button
              className={styles.backButton}
              onClick={() => setSelectedTopic(null)}
            >
              חזרה לנושאים
            </button>
            {selectedTopic === 'numbers' && (
              <a href="/grammar/numbers/game" className={styles.gameButton}>
                למשחק
              </a>
            )}
            {selectedTopic === 'nouns' && (
              <a href="/grammar/nouns/game" className={styles.gameButton}>
                למשחק
              </a>
            )}
            {selectedTopic === 'verbs' && (
              <a href="/grammar/verbs/game" className={styles.gameButton}>
                למשחק
              </a>
            )}
            {selectedTopic === 'adjectives' && (
              <a href="/grammar/adjectives/game" className={styles.gameButton}>
                למשחק
              </a>
            )}
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
} 
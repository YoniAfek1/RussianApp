// עמוד תרגול מילים: מציג מילה אקראית לבדיקה על ידי המשתמש
import { useState, useEffect } from 'react';
import styles from '../styles/Practice.module.css';
import Confetti from 'react-confetti';
import { useVocabularyStore } from '@/store/vocabularyStore';
import { Word, WordStatus } from '@/types/Word';
import PracticeBox from '@/components/PracticeBox';
import RoundProgress from '@/components/RoundProgress';

const ROUNDS = 10;

interface SessionStats {
  total: number;
  correct: number;
  missedWords: Array<{
    russianWord: string;
    hebrewTranslation: string;
    userAnswer: string;
  }>;
}

interface FilterState {
  red: boolean;
  yellow: boolean;
  green: boolean;
}

interface SessionSummary {
  totalWords: number;
  correctAnswers: number;
  missedWords: Array<{
    russianWord: string;
    hebrewTranslation: string;
    userAnswer: string;
    attempts: number;
  }>;
  roundNumber: number;
}

export default function Practice() {
  const { words, isLoading, error, loadWords, updateWordStatus } = useVocabularyStore();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ total: 0, correct: 0, missedWords: [] });
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({ red: false, yellow: false, green: false });
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [previousMissedWords, setPreviousMissedWords] = useState<Word[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [sessionHistory, setSessionHistory] = useState<SessionSummary[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Load words from store
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const toggleFilter = (color: keyof FilterState) => {
    setSelectedFilters(prev => ({
      ...prev,
      [color]: !prev[color]
    }));
  };

  const startSession = () => {
    // If no filter selected, we'll use all words
    let availableWords = words;
    
    // If filters are selected, then filter the words
    if (selectedFilters.red || selectedFilters.yellow || selectedFilters.green) {
      availableWords = words.filter(word => {
        const wordStatus = word.status || 'red'; // Default status is red
        return (
          (selectedFilters.red && (wordStatus === 'red' || !word.status)) ||
          (selectedFilters.yellow && wordStatus === 'yellow') ||
          (selectedFilters.green && wordStatus === 'green')
        );
      });
    }

    if (availableWords.length === 0) {
      alert('אין מילים זמינות לתרגול');
      return;
    }

    // Include previously missed words first
    let selectedWords: Word[] = [];
    
    // Add missed words from previous session first
    selectedWords.push(...previousMissedWords);

    // Remove missed words from available pool
    availableWords = availableWords.filter(word => 
      !previousMissedWords.some(missed => missed.russianWord === word.russianWord)
    );

    // Randomly select remaining words to make total of 10
    const remainingCount = ROUNDS - selectedWords.length;
    if (remainingCount > 0) {
      const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
      selectedWords.push(...shuffled.slice(0, remainingCount));
    }

    // Shuffle final selection
    selectedWords = selectedWords.sort(() => Math.random() - 0.5);
    
    setSessionWords(selectedWords);
    setCurrentWordIndex(0);
    setCurrentWord(selectedWords[0]);
    setSessionStats({ total: 0, correct: 0, missedWords: [] });
    setIsSessionStarted(true);
    setShowSummary(false);
  };

  const handleEndSession = () => {
    // Create session summary
    const summary: SessionSummary = {
      totalWords: sessionStats.total,
      correctAnswers: sessionStats.correct,
      missedWords: sessionStats.missedWords.map(word => ({
        ...word,
        attempts: 2 // Now we track actual attempts in PracticeBox
      })),
      roundNumber
    };

    // Update session history
    setSessionHistory(prev => [...prev, summary]);
    
    // Store missed words for next session
    setPreviousMissedWords(
      sessionStats.missedWords.map(missed => ({
        ...words.find(w => w.russianWord === missed.russianWord)!
      }))
    );

    // Reset session
    setIsSessionStarted(false);
    setShowSummary(true);
    setRoundNumber(prev => prev + 1);
  };

  const handleWordComplete = (result: { isCorrect: boolean; attempts: number; userAnswer: string }) => {
    if (!currentWord) return;

    if (result.isCorrect) {
      setShowConfetti(true);
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        correct: prev.correct + 1
      }));

      // Update word status to green if correct on first try
      if (result.attempts === 1) {
        updateWordStatus(currentWord.id, 'green');
      }

      setTimeout(() => {
        setShowConfetti(false);
        getNextWord();
      }, 2000);
    } else {
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        missedWords: [...prev.missedWords, {
          russianWord: currentWord.russianWord,
          hebrewTranslation: currentWord.hebrewTranslation,
          userAnswer: result.userAnswer
        }]
      }));

      // Update word status to red if failed after max attempts
      updateWordStatus(currentWord.id, 'red');
      
      setTimeout(getNextWord, 2000);
    }
  };

  const getNextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < sessionWords.length) {
      setCurrentWord(sessionWords[nextIndex]);
      setCurrentWordIndex(nextIndex);
    } else {
      handleEndSession();
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!isSessionStarted || showSummary) {
    return (
      <div className={styles.container}>
        <div className={styles.startContainer}>
          <h1>תרגול מילים</h1>
          <p>בחר אילו מילים ברצונך לתרגל:</p>
          
          <div className={styles.filterContainer}>
            <button
              className={`${styles.filterButton} ${selectedFilters.red ? styles.selected : ''}`}
              onClick={() => toggleFilter('red')}
            >
              מילים חדשות 🔴
            </button>
            <button
              className={`${styles.filterButton} ${selectedFilters.yellow ? styles.selected : ''}`}
              onClick={() => toggleFilter('yellow')}
            >
              בתהליך למידה 🟡
            </button>
            <button
              className={`${styles.filterButton} ${selectedFilters.green ? styles.selected : ''}`}
              onClick={() => toggleFilter('green')}
            >
              מילים שנלמדו 🟢
            </button>
          </div>

          {showSummary && (
            <div className={styles.summary}>
              <h2>סיכום סבב {roundNumber - 1}</h2>
              <p>מילים נכונות: {sessionStats.correct} מתוך {sessionStats.total}</p>
              
              {sessionStats.missedWords.length > 0 && (
                <div className={styles.missedWords}>
                  <h3>מילים שפספסת:</h3>
                  <ul>
                    {sessionStats.missedWords.map((word, index) => (
                      <li key={index}>
                        <span>{word.russianWord} = {word.hebrewTranslation}</span>
                        <span className={`${styles.tag} ${styles.incorrect}`}>
                          התשובה שלך: {word.userAnswer}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button className={styles.startButton} onClick={startSession}>
            {showSummary ? 'התחל סבב חדש' : 'התחל תרגול'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti />}
      <RoundProgress round={sessionStats.total} total={ROUNDS} />
      <div className={styles.practiceContainer}>
        {currentWord && (
          <PracticeBox
            word={{
              id: currentWord.id,
              russian: currentWord.russianWord,
              translation: currentWord.hebrewTranslation
            }}
            onComplete={handleWordComplete}
          />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Practice.module.css';
import { FaVolumeUp } from 'react-icons/fa';

interface PracticeBoxProps {
  word: {
    id: string;
    russian: string;
    translation: string;
  };
  onComplete: (result: {
    isCorrect: boolean;
    attempts: number;
    userAnswer: string;
  }) => void;
}

// Levenshtein distance calculation for "almost correct" detection
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
}

export default function PracticeBox({ word, onComplete }: PracticeBoxProps) {
  // Core state
  const [userInput, setUserInput] = useState('');
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error' | 'almost';
  }>({ message: '', type: 'error' });
  const [isPlaying, setIsPlaying] = useState(false);

  const MAX_ATTEMPTS = 2;

  // Speech synthesis setup
  const speakWord = useCallback(() => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word.russian);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8; // Slightly slower for better clarity
      
      // Handle speech events
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [word.russian]);

  // Play audio when word changes
  useEffect(() => {
    const timer = setTimeout(() => {
      speakWord();
    }, 50); // Small delay to ensure smooth transition
    return () => clearTimeout(timer);
  }, [word.russian, speakWord]);

  // Reset state when word changes
  useEffect(() => {
    setCurrentAttempt(1);
    setUserInput('');
    setIsComplete(false);
    setFeedback({ message: '', type: 'error' });
  }, [word.russian]);

  // Handle animation timeout
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const checkAnswer = (userAnswer: string, correctAnswer: string): { isCorrect: boolean; isAlmostCorrect: boolean } => {
    const distance = levenshteinDistance(userAnswer, correctAnswer);
    const isCorrect = distance === 0;
    const isAlmostCorrect = distance <= 2;
    return { isCorrect, isAlmostCorrect };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Don't process if already complete or no input
    if (isComplete || !userInput.trim()) return;

    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedAnswer = word.translation.toLowerCase();
    const { isCorrect, isAlmostCorrect } = checkAnswer(normalizedInput, normalizedAnswer);

    if (isCorrect) {
      // Handle correct answer
      setFeedback({ message: 'נכון מאוד! 🎉', type: 'success' });
      setIsComplete(true);
      onComplete({
        isCorrect: true,
        attempts: currentAttempt,
        userAnswer: normalizedInput
      });
    } else {
      // Handle incorrect answer
      setIsAnimating(true);

      if (currentAttempt < MAX_ATTEMPTS) {
        // First attempt - allow retry
        setFeedback({
          message: isAlmostCorrect ? 'כמעט! נסה שוב' : 'לא נכון, נסה שוב',
          type: isAlmostCorrect ? 'almost' : 'error'
        });
        setUserInput('');
        setCurrentAttempt(2); // Move to second attempt
      } else {
        // Second attempt - show answer and complete
        setFeedback({
          message: `לא נכון. התשובה הנכונה היא: ${word.translation}`,
          type: 'error'
        });
        setIsComplete(true);
        onComplete({
          isCorrect: false,
          attempts: MAX_ATTEMPTS,
          userAnswer: normalizedInput
        });
      }
    }
  };

  // Determine if input should be disabled
  const isInputDisabled = isComplete;

  return (
    <div className={styles.wordContainer}>
      <div className={styles.wordDisplay}>
        <div className={styles.wordWithAudio}>
          <h2 className={styles.russianWord}>{word.russian}</h2>
          <button
            type="button"
            onClick={speakWord}
            className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
            aria-label="הקראת המילה"
            disabled={isPlaying}
          >
            <FaVolumeUp />
          </button>
        </div>
        <div className={styles.attempts}>
          ניסיון {currentAttempt} מתוך {MAX_ATTEMPTS}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="הקלד את התרגום..."
          className={`${styles.input} ${isAnimating ? styles.shake : ''}`}
          disabled={isInputDisabled}
          autoFocus
        />
        <button 
          type="submit" 
          className={styles.checkButton}
          disabled={isInputDisabled || !userInput.trim()}
        >
          בדוק
        </button>
      </form>

      {feedback.message && (
        <div className={`${styles.feedback} ${styles[feedback.type]}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
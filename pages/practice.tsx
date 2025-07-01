// pages/practice.tsx
import { useState, useEffect } from 'react';
import styles from '../styles/Practice.module.css';
import Confetti from 'react-confetti';
import * as XLSX from 'xlsx';
import PracticeBox from '@/components/PracticeBox';
import RoundProgress from '@/components/RoundProgress';

interface Word {
  id: number;
  Russian: string;
  Hebrew: string;
  Topic: string;
}

const ROUNDS = 10;

export default function Practice() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('הכל');

  useEffect(() => {
    const loadWords = async () => {
      try {
        const res = await fetch('/data/Russian_Daily_Word.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: Word[] = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' }).map((row: any, index: number) => ({
          id: index,
          Russian: row.Russian,
          Hebrew: row.Hebrew,
          Topic: row.Topic,
        }));
        setWords(data);

        const topicSet = new Set(data.map(word => word.Topic).filter(Boolean));
        setTopics(['הכל', ...Array.from(topicSet)]);
      } catch (err) {
        console.error('שגיאה בטעינת הקובץ:', err);
      }
    };

    loadWords();
  }, []);

  const startSession = () => {
    let availableWords = words;
    if (selectedTopic !== 'הכל') {
      availableWords = words.filter(w => w.Topic === selectedTopic);
    }

    if (availableWords.length === 0) {
      alert('אין מילים זמינות בנושא הנבחר.');
      return;
    }

    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, ROUNDS);
    setSessionWords(selected);
    setCurrentWord(selected[0]);
    setCurrentWordIndex(0);
    setIsSessionStarted(true);
  };

  const handleWordComplete = (result: { isCorrect: boolean }) => {
    if (result.isCorrect) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        getNextWord();
      }, 2000);
    } else {
      setTimeout(getNextWord, 2000);
    }
  };

  const getNextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < sessionWords.length) {
      setCurrentWord(sessionWords[nextIndex]);
      setCurrentWordIndex(nextIndex);
    } else {
      setIsSessionStarted(false);
    }
  };

  if (!isSessionStarted) {
    return (
      <div className={styles.container}>
        <h1>תרגול מילים</h1>
        <p>בחר נושא לתרגול:</p>
        <div className={styles.filterContainer}>
          {topics.map(topic => (
            <button
              key={topic}
              className={`${styles.filterButton} ${selectedTopic === topic ? styles.selected : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <button className={styles.startButton} onClick={startSession}>התחל תרגול</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti />}
      <RoundProgress round={currentWordIndex + 1} total={ROUNDS} />
      <div className={styles.practiceContainer}>
        {currentWord && (
          <PracticeBox
            word={{
              id: currentWord.id.toString(), // 🔧 fix: convert number to string
              russian: currentWord.Russian,
              translation: currentWord.Hebrew
            }}
            onComplete={handleWordComplete}
          />
        )}
      </div>
    </div>
  );
}

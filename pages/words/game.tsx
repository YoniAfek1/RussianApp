import { useState, useEffect } from 'react';
import styles from '@/styles/Practice.module.css';
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

interface ErrorRecord {
  word: Word;
  attempts: number;
}

export default function Practice() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('הכל');
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const [roundsCount, setRoundsCount] = useState(0); // actual number of rounds

  useEffect(() => {
    const loadWords = async () => {
      try {
        const res = await fetch('/data/Russian_Words.xlsx');
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
    const selected = shuffled.slice(0, Math.min(10, shuffled.length)); // max 10
    setSessionWords(selected);
    setCurrentWord(selected[0]);
    setCurrentWordIndex(0);
    setIsSessionStarted(true);
    setCorrectCount(0);
    setErrors([]);
    setShowSummary(false);
    setRoundsCount(selected.length); // update real rounds
  };

  const handleWordComplete = (result: { isCorrect: boolean; attempts: number }) => {
    if (!currentWord) return;

    if (result.attempts > 1 || !result.isCorrect) {
      setErrors(prev => [...prev, { word: currentWord, attempts: result.attempts }]);
    }

    if (result.isCorrect) {
      setCorrectCount(prev => prev + 1);
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
      setShowSummary(true);
    }
  };

  if (!isSessionStarted && !showSummary) {
    return (
      <div className={styles.container}>
        <h1>תרגול מילים</h1>
        <p>בחר נושא לתרגול:</p>
        <div className={styles.filterContainer}>
          <select
            className={styles.topicSelect}
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <button className={styles.startButton} onClick={startSession}>התחל תרגול</button>
      </div>
    );
  }

  if (showSummary) {
    const isPerfect = correctCount === roundsCount && roundsCount > 0;
    return (
      <div className={styles.container}>
        {isPerfect && <Confetti recycle={true} numberOfPieces={300} />}
        <h1>סיכום תרגול</h1>
        {isPerfect ? (
          <>
            <p>כל הכבוד! אפס טעויות!</p>
            <button className={styles.startButton} onClick={startSession}>התחל סבב נוסף</button>
          </>
        ) : (
          <>
            <p>ענית נכון על {correctCount} מתוך {roundsCount} מילים</p>
            {errors.length > 0 && (
              <>
                <h3>מילים בהן טעית:</h3>
                <table className={styles.errorTable}>
                  <thead>
                    <tr>
                      <th>רוסית</th>
                      <th>עברית</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((e, i) => (
                      <tr key={i}>
                        <td>{e.word.Russian}</td>
                        <td>{e.word.Hebrew}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <button className={styles.startButton} onClick={startSession}>התחל סבב נוסף</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti />}
      <div className={styles.practiceContainer}>
        {currentWord && (
          <PracticeBox
            word={{
              id: String(currentWord.id),
              russian: currentWord.Russian,
              translation: currentWord.Hebrew
            }}
            onComplete={handleWordComplete}
          />
        )}
        <RoundProgress round={currentWordIndex + 1} total={roundsCount} />
      </div>
    </div>
  );
}

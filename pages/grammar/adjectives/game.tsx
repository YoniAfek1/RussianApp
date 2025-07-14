import { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from '@/styles/NounGame.module.css';
import RoundProgress from '@/components/RoundProgress';
import Confetti from 'react-confetti';

interface AdjectiveRow {
  wrongIcon: string;
  correctIcon: string;
  hebrew: string;
  russian: string;
}

const ROUNDS = 10;

export default function AdjectiveGame() {
  const [data, setData] = useState<AdjectiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState<AdjectiveRow | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showRussian, setShowRussian] = useState(false);
  const [showHebrew, setShowHebrew] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const [isCorrectOnLeft, setIsCorrectOnLeft] = useState(false);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/Russian_Nouns.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets["Adjective"];
        if (!sheet) {
          console.error("❌ Sheet 'Adjective' not found");
          return;
        }
        const rows: AdjectiveRow[] = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: true
        });
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        console.error("⚠️ Error loading XLSX file:", err);
      });
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0 && round <= ROUNDS) {
      const idx = Math.floor(Math.random() * data.length);
      setQuestion(data[idx]);
      setIsCorrectOnLeft(Math.random() < 0.5); // ✅ רנדומליות
      setFeedback('');
      setAttempts(0);
      setShowRussian(false);
      setShowHebrew(false);
      setDisableButtons(false);
      setSelectedIndex(null);
      setTimeout(() => playTTS(data[idx].russian), 400);
    }
    if (round > ROUNDS) setGameOver(true);
    // eslint-disable-next-line
  }, [loading, data, round]);

  function playTTS(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'ru-RU';
      utter.rate = 0.9;
      ttsRef.current = utter;
      window.speechSynthesis.speak(utter);
    }
  }

  function handleClick(isCorrect: boolean, idx: number) {
    if (disableButtons) return;
    setSelectedIndex(idx);
    if (isCorrect) {
      setFeedback('correct');
      setShowHebrew(true);
      setDisableButtons(true);
      setTimeout(() => {
        setRound(r => r + 1);
        setFeedback('');
        setShowHebrew(false);
      }, 1500);
    } else {
      if (attempts === 0) {
        setFeedback('incorrect');
        setShowRussian(true);
        setAttempts(1);
        playTTS(question?.russian || '');
        setTimeout(() => setFeedback(''), 700);
      } else if (attempts === 1) {
        setFeedback('incorrect');
        setShowHebrew(true);
        setDisableButtons(true);
        setAttempts(2);
        setTimeout(() => {
          setRound(r => r + 1);
          setFeedback('');
          setShowHebrew(false);
        }, 1500);
      }
    }
  }

  if (loading) {
    return <div className={styles.gameContainer}>טוען נתונים...</div>;
  }

  if (gameOver) {
    return (
      <div className={styles.gameContainer}>
        <Confetti recycle={true} numberOfPieces={300} />
        <h1>🎉 כל הכבוד!</h1>
        <p>סיימת את כל 10 הסיבובים!</p>
        <button className={styles.startButton} onClick={() => { setRound(1); setGameOver(false); }}>התחל סבב נוסף</button>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h1>התאם תואר לאימוג׳י</h1>

      <div style={{ fontSize: '2.2rem', margin: '1.5rem 0', color: '#1a237e', fontWeight: 600 }}>
        {showRussian ? question?.russian : ''}
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginBottom: '1.5rem' }} key={round}>
        {isCorrectOnLeft ? (
          <>
            <button
              className={styles.emojiButton + (selectedIndex === 0 ? ' ' + styles.selected : '') + (feedback === 'correct' ? ' ' + styles.correct : '')}
              onClick={() => handleClick(true, 0)}
              aria-label="correct-icon"
              disabled={disableButtons}
            >
              {question?.correctIcon}
            </button>
            <button
              className={styles.emojiButton + (selectedIndex === 1 ? ' ' + styles.selected : '') + (feedback === 'incorrect' && attempts > 0 ? ' ' + styles.incorrect : '')}
              onClick={() => handleClick(false, 1)}
              aria-label="wrong-icon"
              disabled={disableButtons}
            >
              {question?.wrongIcon}
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.emojiButton + (selectedIndex === 0 ? ' ' + styles.selected : '') + (feedback === 'incorrect' && attempts > 0 ? ' ' + styles.incorrect : '')}
              onClick={() => handleClick(false, 0)}
              aria-label="wrong-icon"
              disabled={disableButtons}
            >
              {question?.wrongIcon}
            </button>
            <button
              className={styles.emojiButton + (selectedIndex === 1 ? ' ' + styles.selected : '') + (feedback === 'correct' ? ' ' + styles.correct : '')}
              onClick={() => handleClick(true, 1)}
              aria-label="correct-icon"
              disabled={disableButtons}
            >
              {question?.correctIcon}
            </button>
          </>
        )}
      </div>

      <div className={styles.feedback + (feedback === 'incorrect' ? ' ' + styles.incorrect : '')}>
        {feedback === 'correct' && 'נכון!'}
        {feedback === 'incorrect' && 'נסה שוב'}
        {!feedback && '\u00A0'}
      </div>

      {showHebrew && (
        <div className={styles.russianHint}>{question?.hebrew}</div>
      )}

      <RoundProgress round={round - 1} total={ROUNDS} />
    </div>
  );
}

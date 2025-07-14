import { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from '@/styles/NounGame.module.css';
import RoundProgress from '@/components/RoundProgress';
import Confetti from 'react-confetti';

interface NounRow {
  icon: string;
  russian: string;
  hebrew: string;
}

const ROUNDS = 10;

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

export default function NounsGame() {
  const [data, setData] = useState<NounRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState<NounRow | null>(null);
  const [options, setOptions] = useState<NounRow[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [disableOptions, setDisableOptions] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showRussian, setShowRussian] = useState(false);
  const [showHebrew, setShowHebrew] = useState(false);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Load Excel data
  useEffect(() => {
    fetch('/data/Russian_Nouns.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: NounRow[] = XLSX.utils.sheet_to_json(sheet);
        setData(rows);
        setLoading(false);
      });
  }, []);

  // Start a new round
  useEffect(() => {
    if (!loading && data.length > 0 && round <= ROUNDS) {
      // Pick a random index not used before
      let idx: number;
      let tries = 0;
      do {
        idx = Math.floor(Math.random() * data.length);
        tries++;
      } while (usedIndices.includes(idx) && tries < 100);
      // If all indices used, reset
      if (tries >= 100) setUsedIndices([]);
      // Get correct answer
      const correct = data[idx];
      // Get distractors from ±10 range
      const distractorIndices = new Set<number>();
      while (distractorIndices.size < 3) {
        let offset = Math.floor(Math.random() * 21) - 10; // -10 to +10
        let dIdx = idx + offset;
        if (dIdx < 0 || dIdx >= data.length || dIdx === idx) continue;
        distractorIndices.add(dIdx);
      }
      const distractors = Array.from(distractorIndices).map(i => data[i]);
      // Shuffle options
      const allOptions = shuffle([correct, ...distractors]);
      setQuestion(correct);
      setOptions(allOptions);
      setFeedback('');
      setDisableOptions(false);
      setAttempts(0);
      setShowRussian(false);
      setShowHebrew(false);
      setSelectedIndex(null);
      setTimeout(() => playTTS(correct.russian), 400);
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

  function handleOptionClick(option: NounRow, idx: number) {
    if (disableOptions) return;
    setSelectedIndex(idx);
    if (option.icon === question?.icon) {
      setFeedback('correct');
      setShowHebrew(true);
      setDisableOptions(true);
      setTimeout(() => {
        setUsedIndices(prev => [...prev, data.indexOf(option)]);
        setRound(r => r + 1);
        setFeedback('');
        setDisableOptions(false);
        setShowHebrew(false);
      }, 1500);
    } else {
      if (attempts === 0) {
        setFeedback('incorrect');
        setShowRussian(true);
        setAttempts(1);
        playTTS(question?.russian || '');
        setTimeout(() => setFeedback(''), 200);
      } else if (attempts === 1) {
        setFeedback('incorrect');
        setShowHebrew(true);
        setDisableOptions(true);
        setAttempts(2);
        setTimeout(() => {
          setUsedIndices(prev => [...prev, data.indexOf(question!)]);
          setRound(r => r + 1);
          setFeedback('');
          setDisableOptions(false);
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
        <button className={styles.startButton} onClick={() => { setRound(1); setUsedIndices([]); setGameOver(false); }}>התחל סבב נוסף</button>
      </div>
    );
  }
  return (
    <div className={styles.gameContainer}>
      <h1>ניחוש שם עצם</h1>
      <div style={{ fontSize: '2.2rem', margin: '1.5rem 0', color: '#1a237e', fontWeight: 600 }}>
        {showRussian ? question?.russian : ''}
      </div>
      <div className={styles.emojiOptions} key={round}>
        {options.map((opt, i) => (
          <button
            key={i}
            className={
              styles.emojiButton +
              (selectedIndex === i ? ' ' + styles.selected : '') +
              (feedback === 'correct' && opt.icon === question?.icon ? ' ' + styles.correct : '') +
              (feedback === 'incorrect' && attempts > 0 && opt.icon !== question?.icon ? '' : '')
            }
            onClick={() => handleOptionClick(opt, i)}
            disabled={disableOptions}
            aria-label={opt.russian}
          >
            {opt.icon}
          </button>
        ))}
      </div>
      <div className={styles.feedback + (feedback === 'incorrect' ? ' ' + styles.incorrect : '')}>
        {feedback === 'correct' && 'נכון!'}
        {feedback === 'incorrect' && 'נסה שוב'}
        {!feedback && '\u00A0'}
      </div>
      {showHebrew && (
        <div className={styles.russianHint}>{question?.hebrew}</div>
      )}
      <RoundProgress round={round-1} total={ROUNDS} />
    </div>
  );
} 
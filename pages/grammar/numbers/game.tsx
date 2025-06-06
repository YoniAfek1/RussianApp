import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/NounGame.module.css';
import RoundProgress from '@/components/RoundProgress';

// --- Number to Russian/Hebrew mapping ---
// For brevity, only a few numbers are mapped. Expand as needed.
const RUSSIAN_NUMBERS: Record<number, string> = {
  0: 'ноль', 1: 'один', 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять', 6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять',
  11: 'одиннадцать', 12: 'двенадцать', 13: 'тринадцать', 14: 'четырнадцать', 15: 'пятнадцать', 16: 'шестнадцать', 17: 'семнадцать', 18: 'восемнадцать', 19: 'девятнадцать', 20: 'двадцать',
  30: 'тридцать', 40: 'сорок', 50: 'пятьдесят', 60: 'шестьдесят', 70: 'семьдесят', 80: 'восемьдесят', 90: 'девяносто',
  100: 'сто', 200: 'двести', 300: 'триста', 400: 'четыреста', 500: 'пятьсот', 600: 'шестьсот', 700: 'семьсот', 800: 'восемьсот', 900: 'девятьсот',
  1000: 'тысяча'
};
const HEBREW_NUMBERS: Record<number, string> = {
  0: 'אפס', 1: 'אחד', 2: 'שתיים', 3: 'שלוש', 4: 'ארבע', 5: 'חמש', 6: 'שש', 7: 'שבע', 8: 'שמונה', 9: 'תשע', 10: 'עשר',
  11: 'אחד עשר', 12: 'שנים עשר', 13: 'שלושה עשר', 14: 'ארבעה עשר', 15: 'חמישה עשר', 16: 'שישה עשר', 17: 'שבעה עשר', 18: 'שמונה עשר', 19: 'תשעה עשר', 20: 'עשרים',
  30: 'שלושים', 40: 'ארבעים', 50: 'חמישים', 60: 'שישים', 70: 'שבעים', 80: 'שמונים', 90: 'תשעים',
  100: 'מאה', 200: 'מאתיים', 300: 'שלוש מאות', 400: 'ארבע מאות', 500: 'חמש מאות', 600: 'שש מאות', 700: 'שבע מאות', 800: 'שמונה מאות', 900: 'תשע מאות',
  1000: 'אלף'
};

function numberToRussian(n: number): string {
  if (RUSSIAN_NUMBERS[n]) return RUSSIAN_NUMBERS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    return RUSSIAN_NUMBERS[tens] + (ones ? ' ' + RUSSIAN_NUMBERS[ones] : '');
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    const rest = n % 100;
    return RUSSIAN_NUMBERS[hundreds] + (rest ? ' ' + numberToRussian(rest) : '');
  }
  if (n === 1000) return RUSSIAN_NUMBERS[1000];
  return '';
}
function numberToHebrew(n: number): string {
  if (HEBREW_NUMBERS[n]) return HEBREW_NUMBERS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    return HEBREW_NUMBERS[tens] + (ones ? ' ' + HEBREW_NUMBERS[ones] : '');
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    const rest = n % 100;
    return HEBREW_NUMBERS[hundreds] + (rest ? ' ' + numberToHebrew(rest) : '');
  }
  if (n === 1000) return HEBREW_NUMBERS[1000];
  return '';
}

const ROUNDS = 10;

interface RoundResult {
  number: number;
  russian: string;
  hebrew: string;
  correct: boolean;
  userInput: string;
}

export default function NumbersGame() {
  const [round, setRound] = useState(1);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [showRussian, setShowRussian] = useState(false);
  const [showHebrew, setShowHebrew] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const errorCount = useRef(0);

  useEffect(() => {
    if (round > ROUNDS) {
      setGameOver(true);
      return;
    }
    // Pick a random number 0-1000
    const n = Math.floor(Math.random() * 1001);
    setCurrentNumber(n);
    setInput('');
    setFeedback('');
    setShowRussian(false);
    setShowHebrew(false);
    errorCount.current = 0;
    setTimeout(() => playTTS(numberToRussian(n)), 400);
    // eslint-disable-next-line
  }, [round]);

  function playTTS(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setPlaying(true);
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'ru-RU';
      utter.rate = 0.9;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value.replace(/[^0-9]/g, ''));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentNumber) return;
    if (parseInt(input, 10) === currentNumber) {
      setFeedback('correct');
      setResults(prev => [...prev, {
        number: currentNumber,
        russian: numberToRussian(currentNumber),
        hebrew: numberToHebrew(currentNumber),
        correct: true,
        userInput: input
      }]);
      setTimeout(() => {
        setRound(r => r + 1);
        setFeedback('');
      }, 900);
    } else {
      errorCount.current += 1;
      setFeedback('incorrect');
      setResults(prev => prev);
      if (errorCount.current === 1) {
        setShowRussian(true);
      } else if (errorCount.current === 2) {
        setShowHebrew(true);
        setTimeout(() => {
          setResults(prev => [...prev, {
            number: currentNumber,
            russian: numberToRussian(currentNumber),
            hebrew: numberToHebrew(currentNumber),
            correct: false,
            userInput: input
          }]);
          setRound(r => r + 1);
          setFeedback('');
          setShowRussian(false);
          setShowHebrew(false);
        }, 1200);
      }
    }
  }

  if (gameOver) {
    return (
      <div className={styles.numbersGameContainer}>
        <h1>סיכום המשחק</h1>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>מספר</th>
              <th>ברוסית</th>
              <th>בעברית</th>
              <th>תוצאה</th>
              <th>תשובתך</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.number}</td>
                <td>{r.russian}</td>
                <td>{r.hebrew}</td>
                <td className={r.correct ? styles.summaryCorrect : styles.summaryIncorrect}>
                  {r.correct ? '✔️' : '❌'}
                </td>
                <td>{r.correct ? '' : r.userInput}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.gameButton} onClick={() => {
          setRound(1);
          setResults([]);
          setGameOver(false);
        }}>שחק שוב</button>
      </div>
    );
  }

  return (
    <div className={styles.numbersGameContainer}>
      <h1>משחק מספרים</h1>
      <p>הקשב למספר ברוסית וכתוב את המספר בספרות</p>
      <button
        className={styles.speakerButton + (playing ? ' ' + styles.playing : '')}
        onClick={() => playTTS(currentNumber !== null ? numberToRussian(currentNumber) : '')}
        aria-label="השמע מספר ברוסית"
        type="button"
      >
        <span role="img" aria-label="Speaker">🔊</span>
      </button>
      
      {showRussian && (
        <div className={styles.russianHint}>{currentNumber !== null && numberToRussian(currentNumber)}</div>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          className={styles.numberInput}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={input}
          onChange={handleInputChange}
          placeholder="הקלד..."
          autoFocus
        />
        <button className={styles.gameButton} type="submit">בדוק</button>
      </form>
      <div className={styles.feedback + (feedback === 'incorrect' ? ' ' + styles.incorrect : '')}>
        {feedback === 'correct' && 'נכון!'}
        {feedback === 'incorrect' && 'נסה שוב'}
        {!feedback && '\u00A0'}
      </div>
      {showHebrew && (
        <div className={styles.hebrewHint}>{currentNumber !== null && numberToHebrew(currentNumber)}</div>
      )}
      <RoundProgress round={round-1} total={ROUNDS} />
      </div>
  );
} 
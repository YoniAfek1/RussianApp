import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Songs.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp } from 'react-icons/fa';

interface SongRow {
  Line1: string;
  Line2: string;
  Line3: string;
  SongTitle: string;
  Artist: string;
  Link?: string;
  Year: string;
}

export default function DailySong() {
  const [songRows, setSongRows] = useState<SongRow[]>([]);
  const [songIndex, setSongIndex] = useState(0);
  const [song, setSong] = useState<SongRow | null>(null);
  const [revealed, setRevealed] = useState(1);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [revealClicks, setRevealClicks] = useState(0);
  const [forceShowButtons, setForceShowButtons] = useState(false);

  // Load the daily song
  useEffect(() => {
    const loadExcel = async () => {
      try {
        const res = await fetch('/data/Russian_My_Songs.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: SongRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        setSongRows(data);
        // Pick a random index for the initial song
        const initialIndex = Math.floor(Math.random() * data.length);
        setSongIndex(initialIndex);
        setSong(data[initialIndex]);
      } catch (err) {
        console.error(err);
      }
    };
    loadExcel();
  }, []);

  useEffect(() => {
    if (songRows.length > 0) {
      setSong(songRows[songIndex]);
      setRevealed(1);
      setInput('');
      setSuccess(false);
      setShowConfetti(false);
      setShowSuggestions(false);
    }
  }, [songIndex, songRows]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/data/Russian_Songs.csv');
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        const csvArr = rows.map(row => row.split(',').map(cell => cell.trim()));
        setCsvRows(csvArr);
        const suggs = rows
          .map(row => row.trim())
          .filter(Boolean)
          .map(row => {
            const [artist, title] = row.split(',');
            return artist && title ? `${artist.trim()} - ${title.trim()}` : '';
          })
          .filter(Boolean);
        setAllSuggestions(suggs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    const filtered = allSuggestions.filter(s =>
      s.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 20);
    setSuggestions(filtered);
  }, [input, allSuggestions]);

  useEffect(() => {
    if (success) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const lines = song ? [song.Line1, song.Line2, song.Line3] : [];

  const handleReveal = () => {
    if (revealed < 3) {
      setRevealed(revealed + 1);
      setRevealClicks(revealClicks + 1);
    } else if (revealClicks === 2) {
      // After revealing the third line, next click should show 'Reveal the Song'
      setForceShowButtons(true);
      setFeedbackMsg('');
      setRevealClicks(3);
    }
  };

  const handlePlay = () => {
    const text = lines.slice(0, revealed).join(' ');
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const ruVoice = voices.find(v => v.lang === 'ru-RU');
    if (ruVoice) utter.voice = ruVoice;
    utter.lang = 'ru-RU';
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (s: string) => {
    setInput(s);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const checkAnswer = (guess: string) => {
    if (!song) return;
    const correctArtist = song.Artist.trim().toLowerCase();
    const correctTitle = song.SongTitle.trim().toLowerCase();
    const [guessArtist, guessTitle] = guess.split(' - ').map(s => s.trim().toLowerCase());
    if (guessArtist === correctArtist && guessTitle === correctTitle) {
      setSuccess(true);
      setShowConfetti(true);
      setFeedbackMsg('נכון! כל הכבוד!');
      setForceShowButtons(false);
      return;
    }
    if (guessTitle === correctTitle && guessArtist !== correctArtist) {
      setFeedbackMsg('כמעט! נסו אמן אחר');
      setSuccess(false);
      setForceShowButtons(false);
      return;
    }
    if (guessArtist === correctArtist && guessTitle !== correctTitle) {
      setFeedbackMsg('כמעט! נסו שיר אחר');
      setSuccess(false);
      setForceShowButtons(false);
      return;
    }
    setFeedbackMsg('טעות! נסה שוב');
    setSuccess(false);
    setForceShowButtons(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSelect = () => {
    if (input) checkAnswer(input);
  };

  const handleNext = () => {
    if (songRows.length === 0) return;
    setSongIndex((prev) => (prev + 1) % songRows.length);
  };

  const fixRussianPeriod = (line: string) => {
    if (!line) return '';
    return line.endsWith('.') ? line.slice(0, -1) + '.' : line;
  };

  const Confetti = () => showConfetti ? (
    <div className={styles.confettiOverlay}>
      {Array.from({ length: 80 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          fontSize: `${Math.random() * 2 + 1.2}rem`,
          pointerEvents: 'none',
          userSelect: 'none',
          animation: `fall 5s linear ${Math.random() * 2}s 1`,
        }}>🎉</span>
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(360deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  ) : null;

  // Reset feedback and forceShowButtons on song change
  useEffect(() => {
    setFeedbackMsg('');
    setForceShowButtons(false);
    setRevealClicks(0);
    setRevealed(1);
  }, [songIndex]);

  // Show correct answer if revealed
  const showCorrectAnswer = forceShowButtons && revealClicks === 3;
  const correctAnswer = song ? `${song.Artist} - ${song.SongTitle}` : '';

  if (!song) return <div className={styles.container}><div className={styles.card}>טוען...</div></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>נחשו את השיר הישראלי</h1>
      <div className={styles.subtitleRu}>Угадай израильскую песню</div>
      <div className={styles.card}>
        <div className={styles.songYear}><span>Год выпуска:</span> {song?.Year}</div>
        <div className={styles.songContent}>
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={styles.lyricLine + (idx < revealed ? ' ' + styles.visible : '')}
              style={{ transitionDelay: `${idx * 0.2}s`, direction: 'ltr', textAlign: 'left' }}
            >
              {idx < revealed ? fixRussianPeriod(line) : ''}
            </div>
          ))}
          <button
            className={styles.speakerButton}
            onClick={handlePlay}
            title="השמע שורה ברוסית"
            type="button"
          >
            <FaVolumeUp />
          </button>
          <div>
            <button
              className={styles.revealBtn}
              onClick={handleReveal}
              disabled={success || forceShowButtons || revealClicks >= 3}
            >
              {revealClicks < 2 ? 'שורה נוספת' : (revealClicks === 2 ? 'חשיפת השיר' : 'השיר נחשף')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.autocompleteWrapper}>
        <button
          className={styles.selectButton}
          onClick={handleSelect}
          disabled={success || !input}
        >
          בחר
        </button>
        <input
          ref={inputRef}
          className={styles.autocompleteInput}
          type="text"
          placeholder="הכניסו אמן - שם שיר ובחרו"
          value={input}
          onChange={handleInput}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleInputBlur}
          disabled={success}
        />
        {showSuggestions && suggestions.length > 0 && !success && (
          <div className={styles.suggestionsAbove}>
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={styles.suggestion}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {(success || forceShowButtons) && song.Link && (
        <div className={styles.youtubeWrapper}>
          <button
            className={styles.youtubeButton}
            onClick={() =>
              window.open(`https://www.youtube.com/watch?v=${song.Link}`, '_blank')
            }
          >
            צפייה בשיר 🎵
          </button>
          <button onClick={handleNext} className={styles.youtubeButton}>
            השיר הבא
          </button>
        </div>
      )}
      {success && <Confetti />}
      {feedbackMsg && <div className={styles.feedbackMsgBottom}>{feedbackMsg}</div>}
      {showCorrectAnswer && (
        <div className={styles.feedbackMsgBottom}>{correctAnswer}</div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/DailySong.module.css';
import * as XLSX from 'xlsx';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface SongRow {
  Line1: string;
  Line2: string;
  Line3: string;
  SongTitle: string;
  Artist: string;
  Link?: string;
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

  // Load the daily song (all rows)
  useEffect(() => {
    const loadExcel = async () => {
      try {
        const res = await fetch('/data/Russian_Daily_Song.xlsx');
        if (!res.ok) {
          throw new Error(`Failed to fetch Excel file: ${res.statusText}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: SongRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        setSongRows(data);
        setSongIndex(0);
        setSong(data[0]);
      } catch (err) {
        // Optionally handle error
      }
    };
    loadExcel();
  }, []);

  // Update song when songIndex changes
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

  // Load suggestions from CSV (full dataset)
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/data/Russian_Songs.csv');
        if (!res.ok) {
          throw new Error(`Failed to fetch CSV file: ${res.statusText}`);
        }
        const text = await res.text();
        const rows = text.split('\n').slice(1); // skip header
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
        // Optionally handle error
      }
    };
    fetchSuggestions();
  }, []);

  // Filter suggestions as user types (always from full allSuggestions array)
  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    const filtered = allSuggestions.filter(s =>
      s.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 8);
    setSuggestions(filtered);
  }, [input, allSuggestions]);

  // Confetti logic
  useEffect(() => {
    if (success) {
      console.log('[DailySong] Success! Correct answer detected. Showing confetti.');
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!song) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div>טוען...</div>
        </div>
      </div>
    );
  }

  const lines = [song.Line1, song.Line2, song.Line3];
  console.log('[DailySong] Current lines:', lines, 'Revealed:', revealed);

  const handleReveal = () => {
    console.log('[DailySong] Reveal button clicked. Current revealed:', revealed);
    if (revealed < 3) setRevealed(revealed + 1);
  };

  const handlePlay = () => {
    const text = lines.slice(0, revealed).join(' ');
    if (!text) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(v => v.lang === 'ru-RU');
    if (ruVoice) utter.voice = ruVoice;
    utter.lang = 'ru-RU';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
    console.log('[DailySong] User input changed:', e.target.value);
  };

  const handleSuggestionClick = (s: string) => {
    setInput(s);
    setShowSuggestions(false);
    inputRef.current?.blur();
    // Do NOT call checkAnswer here; only fill input
  };

  const checkAnswer = (guess: string) => {
    const correct = `${song.Artist.trim()} - ${song.SongTitle.trim()}`;
    console.log('[DailySong] Checking answer. Guess:', guess, 'Correct:', correct);
    if (guess.trim().toLowerCase() === correct.toLowerCase()) {
      setSuccess(true);
      console.log('[DailySong] Correct answer!');
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
    console.log('[DailySong] Input blurred, hiding suggestions soon.');
  };

  // Add a handler for the select button
  const handleSelect = () => {
    if (input) checkAnswer(input);
  };

  // Confetti (simple emoji overlay)
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

  // Navigation handlers
  const handlePrev = () => {
    if (songRows.length === 0) return;
    setSongIndex((prev) => (prev - 1 + songRows.length) % songRows.length);
  };
  const handleNext = () => {
    if (songRows.length === 0) return;
    setSongIndex((prev) => (prev + 1) % songRows.length);
  };

  // Russian LTR punctuation fix
  function fixRussianPeriod(line: string) {
    if (!line) return '';
    // If ends with period, move it to the left (true LTR)
    if (line.endsWith('.')) {
      return line.slice(0, -1) + '.';
    }
    return line;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>האזינו או קראו את המילים ונחשו את השיר הישראלי</h1>
      <div className={styles.songNavWrapper}>
        <button className={styles.arrowBtn} onClick={handlePrev} aria-label="שיר קודם"><FaArrowRight /></button>
        <div className={styles.card}>
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
            <button className={styles.playBtn} onClick={handlePlay} title="השמע שורה ברוסית">
              ▶️
            </button>
            <div>
              <button
                className={styles.revealBtn}
                onClick={handleReveal}
                disabled={revealed >= 3}
              >
                גלה שורה נוספת
              </button>
            </div>
          </div>
        </div>
        <button className={styles.arrowBtn} onClick={handleNext} aria-label="שיר הבא"><FaArrowLeft /></button>
      </div>
      <div className={styles.autocompleteWrapper}>
        <button
          className={styles.selectButton}
          onClick={handleSelect}
          disabled={success || !input}
          tabIndex={0}
        >
          בחר
        </button>
        <input
          ref={inputRef}
          className={styles.autocompleteInput}
          type="text"
          placeholder="הכניסו שם שיר/אומן ובחרו"
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
      {success && <div className={styles.successMsg}>נכון! כל הכבוד! 🎉</div>}
      <Confetti />
      {success && song.Link && (
        <div className={styles.youtubeWrapper}>
          <a
            href={`https://www.youtube.com/watch?v=${song.Link}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.youtubeButton}
          >
            לצפייה בשיר🎵
          </a>
        </div>
      )}
    </div>
  );
} 
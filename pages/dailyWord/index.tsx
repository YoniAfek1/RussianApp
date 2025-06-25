import { useEffect, useState } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface DailyWordRow {
  Russian: string;
  Hebrew: string;
  Transliteration: string;
  Association: string;
  AssociationSentence: string;
  Icon: string;
}

export default function DailyWordPage() {
  const [words, setWords] = useState<DailyWordRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const res = await fetch('/data/Russian_Daily_Word.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: DailyWordRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        setWords(data);
      } catch (err) {
        console.error('Failed to load daily words:', err);
      }
    };

    loadExcel();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setFlipped(false);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    setFlipped(false);
  };

  if (!words.length) return <div className={styles.loading}>טוען...</div>;

  const word = words[currentIndex];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧩 מילה יומית 🧩</h1>
      <p className={styles.subtitle}>לחצו על הקלף לחשיפת האסוציאציה</p>
      <div className={styles.cardContainer}>
        <div
          className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          {/* Front Side */}
          <div className={styles.cardFront}>
            <div className={styles.wordRow}>
              <span className={styles.word}>{word.Russian}</span>
              <span className={styles.separator}>–</span>
              <span className={styles.word}>{word.Hebrew}</span>
            </div>
            <div className={styles.icon}>{word.Icon}</div>
            <button
              className={styles.speakerButton}
              onClick={(e) => {
                e.stopPropagation();
                speak(word.Russian);
              }}
            >
              <FaVolumeUp />
            </button>
          </div>

          {/* Back Side */}
          <div className={styles.cardBack}>
            <div className={styles.wordRow}>
              <span className={styles.word}>{word.Russian}</span>
              <span className={styles.separator}>–</span>
              <span className={styles.word}>{word.Hebrew}</span>
            </div>
            <div className={styles.transliteration}>{word.Transliteration}</div>
            <div className={styles.associationBlock}>
              <div className={styles.associationRow}>
                <span className={styles.associationLabel}>האסוציאציה:</span>
                {/* TODO: Replace word.Association with Association Word from Russian_Similar_Words.xlsx */}
                <span className={styles.associationValue}>{word.Association}</span>
              </div>
              <div className={styles.associationSentence}>
                {word.AssociationSentence}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button onClick={prev}><FaArrowLeft /></button>
        <button onClick={next}><FaArrowRight /></button>
      </div>
    </div>
  );
}

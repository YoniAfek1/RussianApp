import { useEffect, useState } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface DailyWordRow {
  Russian: string;
  Hebrew: string;
  Transliteration: string;
  AssociationWord: string;
  Association: string;
  Icon: string;
}

export default function DailyWordPage() {
  const [words, setWords] = useState<DailyWordRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardColor, setCardColor] = useState<string>('');

  const pastelColors = ['#FFF5E5', '#E8F8F5', '#FDE2FF', '#E0F7FA', '#FFF0F0'];

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

  useEffect(() => {
    if (words.length > 0) {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      setCardColor(randomColor);
    }
  }, [currentIndex, words.length]);

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
          style={{ backgroundColor: cardColor }}
          onClick={() => setFlipped(!flipped)}
        >
          {/* Front Side */}
          <div className={styles.cardFront} style={{ backgroundColor: cardColor }}>
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
          <div className={styles.cardBack} style={{ backgroundColor: cardColor }}>
            <div className={styles.wordRow}>
              <span className={styles.word}>{word.Russian}</span>
              <span className={styles.separator}>–</span>
              <span className={styles.word}>{word.Hebrew}</span>
            </div>
            <div className={styles.transliteration}>{word.Transliteration}</div>
            <div className={styles.associationBlock}>
              <div className={styles.associationRow}>
                <span className={styles.associationLabel}>האסוציאציה:</span>
                <span className={styles.associationValue}>{word.AssociationWord}</span>
              </div>
              <div className={styles.associationSentence}>
                {word.Association}
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

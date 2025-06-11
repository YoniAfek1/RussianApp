import { useEffect, useState } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface DailyWordRow {
  Russian: string;
  Hebrew: string;
  Transliteration: string;
  Association: string;
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
      <h1 className={styles.title}>מילה יומית 💡</h1>
      <div className={styles.card} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <div className={styles.front}>
            <div className={styles.bigWord}>{word.Hebrew}</div>
            <div className={styles.icon}>{word.Icon}</div>
            <button className={styles.speakButton} onClick={(e) => { e.stopPropagation(); speak(word.Russian); }}>
              <FaVolumeUp />
            </button>
          </div>
        ) : (
          <div className={styles.back}>
            <div className={styles.russian}>{word.Russian}</div>
            <div className={styles.transliteration}>{word.Transliteration}</div>
            <div className={styles.association}>{word.Association}</div>
          </div>
        )}
      </div>

      <div className={styles.navigation}>
        <button onClick={prev}><FaArrowLeft /></button>
        <button onClick={next}><FaArrowRight /></button>
      </div>
    </div>
  );
}

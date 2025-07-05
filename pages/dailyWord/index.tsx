import { useEffect, useState } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaArrowLeft, FaArrowRight, FaArrowCircleLeft, FaArrowAltCircleLeft } from 'react-icons/fa';

interface DailyWordRow {
  Russian: string;
  Hebrew: string;
  Transliteration: string;
  AssociationWord: string;
  Association: string;
  Icon: string;
}

async function getVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (voices.length) return voices;
  return new Promise(resolve => {
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      if (voices.length) resolve(voices);
    };
  });
}

export default function DailyWordPage() {
  const [words, setWords] = useState<DailyWordRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardColor, setCardColor] = useState<string>('');
  const [imageExists, setImageExists] = useState(false);

  const pastelColors = [
    '#FFF5E5', '#E8F8F5', '#FDE2FF', '#E0F7FA', '#FFF0F0',
    '#F5FAD1', '#E9F7EF', '#F9EBFF', '#FFEFD5', '#F0F8FF'
  ];

  const getNewColor = (currentColor: string): string => {
    const options = pastelColors.filter(c => c !== currentColor);
    return options[Math.floor(Math.random() * options.length)];
  };

  const checkImageExists = (filename: string) => {
    const img = new Image();
    img.src = `/animations/assosiations/${filename}`;
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
  };

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const res = await fetch('/data/Russian_Words_Cards.xlsx');
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
      const word = words[currentIndex];
      setCardColor(prev => getNewColor(prev));
      checkImageExists(`${word.Russian.toLowerCase()}.png`);
    }
  }, [currentIndex, words]);

  const speak = async (text: string) => {
    const synth = window.speechSynthesis;
    const voices = await getVoices();
    const ruVoice = voices.find(v => v.lang?.toLowerCase().startsWith('ru') || v.name?.toLowerCase().includes('russian'));
    if (!ruVoice) {
      alert('⚠️ Russian voice not available on this device. Please install Russian language voices in your system settings.');
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = ruVoice;
    utterance.lang = ruVoice.lang;
    synth.speak(utterance);
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
      <h1 className={styles.title}>🧩 אוצר מילים 🧩</h1>
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
              <div className={styles.associationSentence}>{word.Association}</div>
            </div>
            {imageExists && (
              <div className={styles.imageContainer}>
                <img
                  src={`/animations/assosiations/${word.Russian.toLowerCase()}.png`}
                  alt={`illustration for ${word.Russian}`}
                  className={styles.wordImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button onClick={prev}><FaArrowRight /></button>
        <button onClick={next}><FaArrowLeft /></button>
      </div>
    </div>
  );
}

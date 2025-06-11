import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';

interface WordData {
  word: string;
  hebrew: string;
  transliteration: string;
  association: string;
  icon: string;
  type?: string;
  difficulty?: string;
}

export default function DailyWord() {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/Russian_Daily_Word.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = data.map((row: any) => ({
          word: row['מילה אחת'],
          hebrew: row['Hebrew'],
          transliteration: row['Transliteration'],
          association: row['Association'],
          icon: row['Icon'],
          type: row['Type'],
          difficulty: row['Difficulty']
        }));

        setWords(formattedData);
      } catch (error) {
        console.error('Error loading word data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentIndex]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : words.length - 1));
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < words.length - 1 ? prev + 1 : 0));
    setIsFlipped(false);
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  if (words.length === 0) {
    return <div className={styles.container}>Loading...</div>;
  }

  const currentWord = words[currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div
          className={`${styles.card} ${isFlipped ? styles.cardFlipped : ''}`}
          onClick={handleCardClick}
        >
          <div className={styles.cardFront}>
            <div className={styles.word}>{currentWord.word}</div>
            <div className={styles.translation}>{currentWord.hebrew}</div>
            <div className={styles.icon}>{currentWord.icon}</div>
            <button className={styles.speakerButton} onClick={(e) => {
              e.stopPropagation();
              handlePlayAudio();
            }}>
              🔊
            </button>
            <audio
              ref={audioRef}
              src={`/audio/words/${currentWord.word}.mp3`}
              preload="auto"
            />
          </div>
          <div className={styles.cardBack}>
            <div className={styles.word}>{currentWord.word}</div>
            <div className={styles.translation}>{currentWord.hebrew}</div>
            <div className={styles.transliteration}>{currentWord.transliteration}</div>
            <div className={styles.association}>{currentWord.association}</div>
          </div>
        </div>
      </div>
      <div className={styles.navigation}>
        <button className={styles.navButton} onClick={handlePrevious}>
          ←
        </button>
        <button className={styles.navButton} onClick={handleNext}>
          →
        </button>
      </div>
    </div>
  );
} 
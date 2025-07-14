import { useState, useEffect } from 'react';
import styles from '../../../styles/Grammar.module.css';

interface LetterData {
  upper: string;
  lower: string;
  pronunciation: string;
}

const CYRILLIC_ALPHABET: LetterData[] = [
  { upper: 'А', lower: 'а', pronunciation: 'אַ' },
  { upper: 'Б', lower: 'б', pronunciation: 'בּ' },
  { upper: 'В', lower: 'в', pronunciation: 'ב' },
  { upper: 'Г', lower: 'г', pronunciation: 'ג' },
  { upper: 'Д', lower: 'д', pronunciation: 'ד' },
  { upper: 'Е', lower: 'е', pronunciation: 'יֶ' },
  { upper: 'Ё', lower: 'ё', pronunciation: 'יוֹ' },
  { upper: 'Ж', lower: 'ж', pronunciation: "ז'" },
  { upper: 'З', lower: 'з', pronunciation: 'ז' },
  { upper: 'И', lower: 'и', pronunciation: 'י' },
  { upper: 'Й', lower: 'й', pronunciation: 'י קצרה' },
  { upper: 'К', lower: 'к', pronunciation: 'ק' },
  { upper: 'Л', lower: 'л', pronunciation: 'ל' },
  { upper: 'М', lower: 'м', pronunciation: 'מ' },
  { upper: 'Н', lower: 'н', pronunciation: 'נ' },
  { upper: 'О', lower: 'о', pronunciation: 'אוֹ' },
  { upper: 'П', lower: 'п', pronunciation: 'פּ' },
  { upper: 'Р', lower: 'р', pronunciation: 'ר' },
  { upper: 'С', lower: 'с', pronunciation: 'ס' },
  { upper: 'Т', lower: 'т', pronunciation: 'ט' },
  { upper: 'У', lower: 'у', pronunciation: 'אוּ' },
  { upper: 'Ф', lower: 'ф', pronunciation: 'פ' },
  { upper: 'Х', lower: 'х', pronunciation: 'ח' },
  { upper: 'Ц', lower: 'ц', pronunciation: 'צ' },
  { upper: 'Ч', lower: 'ч', pronunciation: "צ'" },
  { upper: 'Ш', lower: 'ш', pronunciation: 'ש' },
  { upper: 'Щ', lower: 'щ', pronunciation: "ש שורקת" },
  { upper: 'Ъ', lower: 'ъ', pronunciation: 'סימן קשה' },
  { upper: 'Ы', lower: 'ы', pronunciation: 'עי' },
  { upper: 'Ь', lower: 'ь', pronunciation: 'סימן רך' },
  { upper: 'Э', lower: 'э', pronunciation: 'אֶ' },
  { upper: 'Ю', lower: 'ю', pronunciation: 'יוּ' },
  { upper: 'Я', lower: 'я', pronunciation: 'יַא' }
];

export default function LettersPage() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const playLetterSound = (letter: string) => {
    if (isPlaying === letter) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8; // Slightly slower for better clarity
    utterance.pitch = 1;

    // Handle the end of speech
    utterance.onend = () => {
      setIsPlaying(null);
    };

    // Handle any errors
    utterance.onerror = () => {
      setIsPlaying(null);
    };

    // Play the speech
    setIsPlaying(letter);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.alphabetSection}>
      <h2 className={styles.sectionTitle}>אותיות</h2>
      <p className={styles.sectionDescription}>
        האלפבית הרוסי (קירילי) והגייה בעברית
      </p>
      <div className={styles.alphabetGrid}>
        {CYRILLIC_ALPHABET.map((letter: LetterData, index: number) => (
          <div key={index} className={styles.letterCard}>
            <div className={styles.letterPair}>
              {letter.upper}{letter.lower}
            </div>
            <div className={styles.pronunciation}>
              {letter.pronunciation}
            </div>
            <button
              className={styles.audioButton}
              onClick={() => playLetterSound(letter.upper)}
              aria-label={`Play pronunciation of ${letter.upper}`}
              disabled={isPlaying !== null && isPlaying !== letter.upper}
            >
              {isPlaying === letter.upper ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
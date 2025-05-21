import { useState, useEffect } from 'react';
import styles from '../../styles/Speak.module.css';

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function SpeakPage() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    
    // Find Russian voice if available
    const ruVoice = voices.find(v => v.lang === 'ru-RU');
    if (ruVoice) {
      console.log('[Frontend] Using Russian voice:', ruVoice.name);
      utterance.voice = ruVoice;
    } else {
      console.log('[Frontend] No Russian voice found, using default');
    }

    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('הדפדפן שלך לא תומך בזיהוי קולי');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('[Frontend] Speech recognition started');
        setListening(true);
      };

      recognition.onend = () => {
        console.log('[Frontend] Speech recognition ended');
        setListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        console.log('[Frontend] Recognized text:', text);
        setTranscript(text);
        speak(text); // 🔊 Play back the text
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('[Frontend] Speech recognition error:', event.error);
        setTranscript('⚠️ לא זוהה טקסט. נסה שוב.');
        setListening(false);
      };

      console.log('[Frontend] Starting speech recognition...');
      recognition.start();
    } catch (err) {
      console.error('[Frontend] Error initializing speech recognition:', err);
      setTranscript('⚠️ שגיאה בהפעלת זיהוי הקולי');
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>דבר ברוסית</h1>
      <p className={styles.description}>
        לחץ על הכפתור ודבר ברוסית. הטקסט יופיע ויוקרא בקול.
      </p>
      
      <div className={styles.controls}>
        <button 
          className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
          onClick={startRecognition} 
          disabled={listening}
        >
          🎤 {listening ? 'מקשיב...' : 'לחץ כדי לדבר'}
        </button>
      </div>

      <div className={styles.result}>
        {transcript && (
          <>
            <div className={styles.transcriptLabel}>מה שאמרת:</div>
            <div className={styles.transcript}>{transcript}</div>
          </>
        )}
      </div>
    </div>
  );
} 
import { useState } from 'react';
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
  const [error, setError] = useState('');

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
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
        setError('');
      };

      recognition.onend = () => {
        console.log('[Frontend] Speech recognition ended');
        setListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        console.log('[Frontend] Recognized text:', text);
        setTranscript(text);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('[Frontend] Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setListening(false);
      };

      console.log('[Frontend] Starting speech recognition...');
      recognition.start();
    } catch (err) {
      console.error('[Frontend] Error initializing speech recognition:', err);
      setError('Failed to start speech recognition');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Speak Russian</h1>
      <p className={styles.description}>
        Click the microphone button and speak in Russian. The app will transcribe your speech.
      </p>
      
      <div className={styles.controls}>
        <button 
          className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
          onClick={startRecognition} 
          disabled={listening}
        >
          {listening ? '🎤 Listening...' : '🎤 Start Speaking'}
        </button>
      </div>

      <div className={styles.result}>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.transcript}>
            {transcript || 'Your transcription will appear here'}
          </div>
        )}
      </div>
    </div>
  );
} 
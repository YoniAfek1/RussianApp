import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Conversations.module.css';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    transformers: any;
  }
}

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

export default function ConversationsPage() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

  // Load TTS voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  // Load Transformers model
  useEffect(() => {
    async function loadModel() {
      try {
        const generator = await window.transformers.pipeline('text-generation', 'facebook/xglm-564M');
        setPipeline(generator);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }
    loadModel();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    const ruVoice = voices.find(v => v.lang === 'ru-RU');
    if (ruVoice) utterance.voice = ruVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecognizedText = async (text: string) => {
    if (!pipeline || !text) return;

    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    const context = updatedHistory.slice(-10).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') + '\nAssistant:';

    setLoading(true);
    try {
      const result = await pipeline(context, { max_new_tokens: 60 });
      const output = result[0].generated_text.replace(context, '').trim();
      setHistory([...updatedHistory, { role: 'assistant', content: output }]);
      speak(output);
    } catch (error) {
      console.error('Error generating response:', error);
    }
    setLoading(false);
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

      const timeoutId = setTimeout(() => recognition.stop(), 8000);

      recognition.onstart = () => setListening(true);
      recognition.onend = () => {
        clearTimeout(timeoutId);
        setListening(false);
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        handleRecognizedText(text);
      };

      recognition.start();
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>שיחה ברוסית 🤖</h1>
      <p className={styles.description}>
        לחץ ודבר ברוסית. המודל יגיב מיד בקול ובטקסט.
      </p>

      <div className={styles.chatBox} ref={chatRef}>
        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            <strong>{msg.role === 'user' ? 'אתה' : 'המודל'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
          onClick={startRecognition}
          disabled={listening || loading}
        >
          {listening ? 'מקשיב...' : '🎤 דבר'}
        </button>
      </div>
    </div>
  );
}

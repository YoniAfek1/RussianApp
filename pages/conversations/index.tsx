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
  const [debugMsg, setDebugMsg] = useState<string>('Initializing...');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

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

  useEffect(() => {
    async function loadModel() {
      try {
        setDebugMsg('📦 Loading model...');
        const generator = await window.transformers.pipeline('text-generation', 'facebook/xglm-564M');
        setPipeline(generator);
        setDebugMsg('✅ Model loaded and ready!');
      } catch (error) {
        console.error('Error loading model:', error);
        setDebugMsg('❌ Failed to load model.');
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
    if (!pipeline || !text) {
      setDebugMsg('⚠️ No input or model not ready');
      return;
    }

    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    const context = updatedHistory.slice(-10).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') + '\nAssistant:';

    setDebugMsg('💬 Sending to model...');
    setLoading(true);
    try {
      const result = await pipeline(context, { max_new_tokens: 60 });
      const output = result[0].generated_text.replace(context, '').trim();
      setHistory([...updatedHistory, { role: 'assistant', content: output }]);
      speak(output);
      setDebugMsg('✅ Response complete');
    } catch (error) {
      console.error('Error generating response:', error);
      setDebugMsg('❌ Error from model');
    }
    setLoading(false);
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('הדפדפן שלך לא תומך בזיהוי קולי');
      setDebugMsg('❌ SpeechRecognition not supported');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const timeoutId = setTimeout(() => recognition.stop(), 8000);

      recognition.onstart = () => {
        setDebugMsg('🎙️ Listening...');
        setListening(true);
      };
      recognition.onend = () => {
        clearTimeout(timeoutId);
        setListening(false);
        setDebugMsg('🛑 Recognition ended.');
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
        setDebugMsg(`❌ STT error: ${event.error}`);
      };
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setDebugMsg(`📝 Recognized: "${text}"`);
        handleRecognizedText(text);
      };

      recognition.start();
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setDebugMsg('❌ Error initializing STT');
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

      <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#666' }}>
        <strong>Debug:</strong> {debugMsg}
      </div>
    </div>
  );
}

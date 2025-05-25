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
    // Load transformers.js from CDN (v2.7.0)
    if (window.transformers) {
      setDebugMsg('📦 Transformers already loaded.');
      loadModel();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.7.0/dist/transformers.min.js';
    script.async = true;

    script.onload = () => {
      setDebugMsg('📦 Transformers loaded, loading model...');
      loadModel();
    };

    script.onerror = () => {
      console.error('Failed to load transformers.js');
      setDebugMsg('❌ Failed to load transformers.js');
    };

    document.body.appendChild(script);
  }, []);

  const loadModel = async () => {
    try {
      setDebugMsg('📦 Loading model...');
      const generator = await window.transformers.pipeline('text-generation', 'Xenova/distilGPT2');
      setPipeline(generator);
      setDebugMsg('✅ Model loaded and ready!');
    } catch (error) {
      console.error('Error loading model:', error);
      setDebugMsg('❌ Failed to load model.');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // או 'ru-RU' אם הקלט ברוסית
    const voice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('ru'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecognizedText = async (text: string) => {
    if (!pipeline || !text) {
      setDebugMsg('⚠️ No input or model not ready');
      return;
    }

    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    const context = updatedHistory.slice(-3).map(msg =>
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
      recognition.lang = 'en-US'; // או 'ru-RU'
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
    <div className={styles.container}>
      <h1 className={styles.title}>Chat with DistilGPT2 🤖</h1>
      <p className={styles.description}>
        Press and speak. The model will reply instantly.
      </p>

      <div className={styles.chatBox} ref={chatRef}>
        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
          onClick={startRecognition}
          disabled={listening || loading}
        >
          {listening ? 'Listening...' : '🎤 Speak'}
        </button>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#666' }}>
        <strong>Debug:</strong> {debugMsg}
      </div>
    </div>
  );
}

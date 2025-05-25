import { useEffect, useState } from 'react';
import styles from '../../styles/Conversations.module.css';

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    transformers: any;
  }
}

export default function ConversationsPage() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices when component mounts
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
    // Load the model using Transformers.js
    async function loadModel() {
      try {
        const { pipeline } = await window.transformers.load();
        const generator = await pipeline('text-generation', 'facebook/xglm-564M');
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
    if (ruVoice) {
      utterance.voice = ruVoice;
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
        setListening(true);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setInput(text);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.start();

      setTimeout(() => {
        if (listening) {
          recognition.stop();
        }
      }, 8000);
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
    }
  };

  const handleSubmit = async () => {
    if (!pipeline || !input) return;

    const updatedHistory = [...history, { role: 'user', content: input }];
    const context = updatedHistory.slice(-10).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') + '\nAssistant:';

    setLoading(true);
    try {
      const result = await pipeline(context, { max_new_tokens: 60 });
      const output = result[0].generated_text.replace(context, '').trim();
      setHistory([...updatedHistory, { role: 'assistant', content: output }]);
      speak(output); // Speak the assistant's response
    } catch (error) {
      console.error('Error generating response:', error);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>שיחה ברוסית 🤖</h1>
      <p className={styles.description}>
        דבר או הקלד ברוסית כדי לשוחח עם המודל
      </p>
      
      <div className={styles.chatBox}>
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
          disabled={listening}
        >
          {listening ? 'מקשיב...' : 'לחץ ודבר'}
        </button>
        
        <div className={styles.inputGroup}>
          <input 
            type="text"
            placeholder="הקלד ברוסית..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button 
            onClick={handleSubmit} 
            disabled={loading || !input}
            className={styles.sendButton}
          >
            {loading ? '⏳' : 'שלח'}
          </button>
        </div>
      </div>
    </div>
  );
} 
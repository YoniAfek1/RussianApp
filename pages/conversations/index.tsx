import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Conversations.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const API_KEY = "AIzaSyA1MUHts75rFBYBxxoBc20ZUjU8FYnHab0";

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

export default function ConversationsPage() {
  const [chatSession, setChatSession] = useState<any>(null);
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
    const initGemini = async () => {
      try {
        setDebugMsg('📦 Initializing Gemini...');
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Initialize chat with system prompt
        const chat = await model.startChat({
          history: [{
            role: "user",
            parts: [{ text: "You are a friendly Russian market vendor. Keep responses short, conversational, and in Russian. Use simple vocabulary suitable for language learners." }]
          }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.7,
          },
        });
        
        setChatSession(chat);
        setDebugMsg('✅ Gemini ready!');
      } catch (error) {
        console.error('Error initializing Gemini:', error);
        setDebugMsg('❌ Failed to initialize Gemini');
      }
    };

    initGemini();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    const voice = voices.find(v => v.lang.startsWith('ru'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecognizedText = async (text: string) => {
    if (!chatSession || !text) {
      setDebugMsg('⚠️ No input or model not ready');
      return;
    }

    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    setHistory(updatedHistory);

    setDebugMsg('💬 Sending to Gemini...');
    setLoading(true);
    try {
      const result = await chatSession.sendMessage(text);
      const reply = result.response.text();
      
      setHistory([...updatedHistory, { role: 'assistant', content: reply }]);
      speak(reply);
      setDebugMsg('✅ Response complete');
    } catch (error) {
      console.error('Error from Gemini:', error);
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
      <h1 className={styles.title}>שיחה עם מוכר בשוק הרוסי 🛍️</h1>
      <p className={styles.description}>
        לחץ ודבר ברוסית. המוכר יענה לך בעברית
      </p>

      <div className={styles.chatBox} ref={chatRef}>
        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            <strong>{msg.role === 'user' ? 'אתה' : 'המוכר'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
          onClick={startRecognition}
          disabled={listening || loading}
        >
          {listening ? 'מקשיב...' : 'לחץ ודבר'}
        </button>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#666' }}>
        <strong>סטטוס:</strong> {debugMsg}
      </div>
    </div>
  );
}

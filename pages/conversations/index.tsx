import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Conversations.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { translateToHebrew } from '../../lib/translate';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const API_KEY = "AIzaSyBJjYZif960Nh_FccIVcngUZcSFfPq_tgA";
const MAX_MESSAGES = 10;

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

export default function ConversationsPage() {
  const [chatSession, setChatSession] = useState<any>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [debugMsg, setDebugMsg] = useState<string>('Initializing...');
  const [translations, setTranslations] = useState<{ [index: number]: string }>({});
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

  const handleTranslate = async (index: number, text: string) => {
    if (!translations[index]) {
      const translated = await translateToHebrew(text);
      setTranslations(prev => ({ ...prev, [index]: translated }));
    }
  };

  const startNewConversation = async () => {
    setHistory([]);
    setTranslations({});
    setDebugMsg('🔄 Starting new conversation...');
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      setDebugMsg('✅ Ready for new conversation!');
    } catch (error) {
      console.error('Error starting new conversation:', error);
      setDebugMsg('❌ Failed to start new conversation');
    }
  };

  const isConversationEnded = history.length >= MAX_MESSAGES;

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>שיחה עם מוכר בשוק הרוסי 🛍️</h1>
      <p className={styles.description}>
        לחץ ודבר ברוסית. המוכר יענה לך בעברית
      </p>

      <div className={styles.chatBox} ref={chatRef}>
        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            <div className={styles.msgHeader}>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  <span className={styles.roleLabel}>
                    {msg.role === 'assistant' ? '🛒' : '👤'}
                  </span>
                  <span>{msg.content}</span>
                </div>
              </div>
              {msg.role === 'assistant' && (
                <div className={styles.messageActions}>
                  <button 
                    className={styles.iconButton}
                    onClick={() => handleTranslate(i, msg.content)}
                    title="Show translation"
                  >
                    ❓
                  </button>
                  <button 
                    className={styles.iconButton}
                    onClick={() => speak(msg.content)}
                    title="Replay audio"
                  >
                    🔊
                  </button>
                </div>
              )}
            </div>
            {msg.role === 'assistant' && translations[i] && (
              <div className={styles.translation}>
                <strong>תרגום:</strong> {translations[i]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        {isConversationEnded ? (
          <>
            <div className={styles.conversationEnded}>
              🔁 השיחה הסתיימה. לחץ למטה כדי להתחיל שיחה חדשה
            </div>
            <button 
              className={styles.newConversationButton}
              onClick={startNewConversation}
            >
              התחל שיחה חדשה
            </button>
          </>
        ) : (
          <button
            className={`${styles.recordButton} ${listening ? styles.recording : ''}`}
            onClick={startRecognition}
            disabled={listening || loading}
          >
            {listening ? 'מקשיב...' : 'לחץ ודבר'}
          </button>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#666' }}>
        <strong>סטטוס:</strong> {debugMsg}
      </div>
    </div>
  );
}

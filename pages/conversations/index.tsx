import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/Conversations.module.css';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const MAX_MESSAGES = 10;

const basePrompt = `
Ты чат-бот, помогающий учить русский язык через ролевые диалоги.  
Всегда говори **только по-русски**, даже если собеседник пишет по-другому.

Общайся **как с ребёнком** или с человеком, который **только начинает учить русский**.  
Говори **очень просто** — только самые частые и лёгкие слова.  
Используй **короткие, ясные фразы**, **не более 8–12 слов**.  
Избегай сложных слов и длинных предложений.  

Каждое твоё сообщение должно заканчиваться **простым вопросом**, чтобы человек мог ответить.

Будь тёплым, дружелюбным и терпеливым — как хороший учитель, который играет и радуется успехам ученика.

**ВАЖНО:** Никогда не повторяй и не перефразируй то, что говорит пользователь. Отвечай естественно, как в настоящем разговоре.
`;

const correctionAddon = `
Если пользователь делает ошибку — исправь её **естественно** в своём ответе, используя правильную форму слова или фразы. 
Не говори "Правильнее сказать..." — просто используй правильную форму в контексте своего ответа.
Если ошибки нет — отвечай как обычно.
`;

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

interface Conversation {
  id: string;
  title: string;
  emoji: string;
  description: string;
  prompt: string;
}

const conversations: Conversation[] = [
  {
    id: 'market',
    title: 'בשוק',
    emoji: '🛍️',
    description: 'שיחה עם מוכר בשוק',
    prompt: `Ты играешь роль продавца на рынке. Говори по-русски, дружелюбно, просто и с юмором. Отвечай по делу, как настоящий продавец.`
  },
  {
    id: 'friend',
    title: 'עם חבר',
    emoji: '👋',
    description: 'שיחה ידידותית עם חבר ',
    prompt: `Ты играешь роль хорошего друга. Говори неформально, тепло и по-русски. Спрашивай, как у меня дела, и делись своими.`
  },
  {
    id: 'restaurant',
    title: 'במסעדה',
    emoji: '🍽️',
    description: 'הזמנת אוכל ממלצר במסעדה ',
    prompt: `Ты официант в русском кафе. Обслуживай вежливо, просто, по-русски. Спрашивай, что я хочу заказать, и предлагай блюда.`
  },
  {
    id: 'cinema',
    title: 'בקולנוע',
    emoji: '🎬',
    description: 'רכישת כרטיסים לקולנוע',
    prompt: `Ты кассир в кинотеатре. Говори по-русски, профессионально и просто. Помоги выбрать сеанс и купить билет.`
  },
  {
    id: 'street',
    title: 'ברחוב',
    emoji: '🚇',
    description: 'התמצאות ברחוב',
    prompt: `Ты житель города и помогаешь туристу сориентироваться на улице и найти нужное место. Отвечай дружелюбно, понятно и по делу.`
  },
  {
    id: 'hotel',
    title: 'בבית מלון',
    emoji: '🏨',
    description: 'צ\'ק אין במלון',
    prompt: `Ты администратор отеля. Говори по-русски вежливо, помогай с заселением, отвечай на вопросы.`
  },
  {
    id: 'doctor',
    title: 'במרפאה',
    emoji: '👨‍⚕️',
    description: 'ביקור אצל הרופא',
    prompt: `Ты врач в клинике. Спрашивай о симптомах, отвечай спокойно, по-русски и профессионально.`
  },
  {
    id: 'clothing',
    title: 'בחנות בגדים',
    emoji: '👕',
    description: 'קניית בגדים',
    prompt: `Ты продавец в магазине одежды. Говори по-русски, помогай выбрать размер и фасон.`
  }
];

export default function ConversationsIndex() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [debugMsg, setDebugMsg] = useState<string>('Initializing...');
  const [debugLog, setDebugLog] = useState<string[]>([]);
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
    if (selectedConversation) {
      const initGemini = async () => {
        try {
          setDebugMsg('📦 Initializing Gemini...');
          const globalPrompt = basePrompt + "\n\n" + correctionAddon;
          const promptWithGreeting = `${globalPrompt}\n\n${selectedConversation.prompt}\n\nНачни диалог с **разного** приветствия каждый раз. Используй разные варианты: "Привет!", "Здравствуйте!", "Как дела?", "Ты готов?", "Добрый день!", "Рад тебя видеть!" и т.д. Будь **естественным** и **спонтанным**, как в настоящем разговоре.`;

          setDebugLog(prev => [...prev, '🚀 Sending initial prompt to Gemini']);

          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: promptWithGreeting }]
            })
          });
          const data = await response.json();
          console.log("🌐 Gemini debugLog:", data.debugLog);  // חדש

          if (data.reply) {
            setHistory([{ role: 'assistant', content: data.reply }]);
            speak(data.reply);
          } else {
            setHistory([{ role: 'assistant', content: '⚠️ No reply from Gemini' }]);
          }

          setHistory([{ role: 'assistant', content: data.reply }]);
          speak(data.reply);
          setDebugLog(prev => [...prev, `✅ Gemini replied: ${data.reply}`]);
          setDebugMsg('✅ ready!');
        } catch (error) {
          console.error('Error initializing:', error);
          setDebugMsg('❌ Failed to initialize');
          setDebugLog(prev => [...prev, `❌ Init error: ${error}`]);
        }
      };
      initGemini();
    }
  }, [selectedConversation]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    const voice = voices.find(v => v.lang.startsWith('ru'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecognizedText = async (text: string) => {
    if (!text) {
      setDebugMsg('⚠️ No input or model not ready');
      setDebugLog(prev => [...prev, '⚠️ Empty user input']);
      return;
    }

    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    setHistory(updatedHistory);
    setDebugMsg('💬 Sending to Gemini...');
    setLoading(true);
    setDebugLog(prev => [...prev, `📤 User: ${text}`]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory })
      });
      const data = await response.json();
      console.log("🌐 Gemini debugLog:", data.debugLog);  // חדש
      
      if (data.reply) {
        setHistory([{ role: 'assistant', content: data.reply }]);
        speak(data.reply);
      } else {
        setHistory([{ role: 'assistant', content: '⚠️ No reply from Gemini' }]);
      }
      speak(data.reply);
      setDebugLog(prev => [...prev, `🤖 Gemini replied: ${data.reply}`]);
      setDebugMsg('✅ Response complete');
    } catch (error) {
      console.error('Gemini error:', error);
      setDebugMsg('❌ Error from model');
      setDebugLog(prev => [...prev, `❌ Error: ${error}`]);
    }

    setLoading(false);
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('הדפדפן שלך לא תומך בזיהוי קולי');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setDebugMsg('🎙️ Listening...');
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setDebugMsg(`📝 Recognized: "${text}"`);
      setDebugLog(prev => [...prev, `🎧 Recognized: "${text}"`]);
      handleRecognizedText(text);
    };
    recognition.onerror = (event: any) => {
      setDebugMsg(`❌ STT Error: ${event.error}`);
      setDebugLog(prev => [...prev, `❌ STT error: ${event.error}`]);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const isConversationEnded = history.length >= MAX_MESSAGES;

  return (
    <div className={styles.container} dir="rtl">
      {!selectedConversation ? (
        <>
          <h1 className={styles.title}>בחר סוג שיחה 💬</h1>
          <div className={styles.description}>בחר את סוג השיחה שברצונך לתרגל</div>
          <div className={styles.grid}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={styles.conversationCard}
                onClick={() => setSelectedConversation(conv)}
              >
                <div>{conv.emoji}</div>
                <div>{conv.title}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>{selectedConversation.emoji} {selectedConversation.title}</h1>
          <div className={styles.chatBox} ref={chatRef}>
            {history.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
                {msg.content}
              </div>
            ))}
          </div>

          {isConversationEnded ? (
            <div>🔁 השיחה הסתיימה</div>
          ) : (
            <button onClick={startRecognition} disabled={listening || loading}>
              {listening ? 'מקשיב...' : 'לחץ ודבר'}
            </button>
          )}

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <strong>סטטוס:</strong> {debugMsg}
          </div>

          <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem', fontFamily: 'monospace', maxHeight: '200px', overflowY: 'auto' }}>
            <strong>🔍 Debug Log:</strong>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {debugLog.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

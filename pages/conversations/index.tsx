import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/Conversations.module.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBJjYZif960Nh_FccIVcngUZcSFfPq_tgA");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function sendToGemini(messages: Message[]): Promise<string> {
  // Convert to Gemini format
  const geminiHistory = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
  const chat = await model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(messages[messages.length - 1].content);
  // Try both .text() and .candidates[0].content.parts[0].text for robustness
  let reply = result.response?.text?.();
  if (!reply && result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    reply = result.response.candidates[0].content.parts[0].text;
  }
  return reply || '';
}

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
    prompt: `Ты житель города и помогаешь туристу сориентироваться на улице и найти нужное место.
    Отвечай дружелюбно, понятно и по делу.`
  },
  {
    id: 'hotel',
    title: 'בבית מלון',
    emoji: '🎬',
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
          const reply = await sendToGemini(history);
          setHistory([...history, { role: 'assistant', content: reply }]);
          speak(reply);
        } catch (error) {
          setDebugMsg('❌ Failed to initialize');
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
      return;
    }
    const updatedHistory: Message[] = [...history, { role: 'user', content: text }];
    setHistory(updatedHistory);
    setDebugMsg('💬 Sending to Gemini...');
    setLoading(true);
    try {
      const reply = await sendToGemini(updatedHistory);
      setHistory([...updatedHistory, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (error) {
      setDebugMsg('❌ Error from Gemini');
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

  const startNewConversation = async () => {
    setHistory([]);
    setDebugMsg('🔄 Starting new conversation...');
    if (selectedConversation) {
      try {
        const globalPrompt = basePrompt + "\n\n" + correctionAddon;
        const promptWithGreeting = `${globalPrompt}\n\n${selectedConversation.prompt}\n\nНачни диалог с **разного** приветствия каждый раз. Используй разные варианты: "Привет!", "Здравствуйте!", "Как дела?", "Ты готов?", "Добрый день!", "Рад тебя видеть!" и т.д. Будь **естественным** и **спонтанным**, как в настоящем разговоре.`;
        const reply = await sendToGemini(history);
        setHistory([...history, { role: 'assistant', content: reply }]);
        speak(reply);
        setDebugMsg('✅ Ready for new conversation!');
      } catch (error) {
        setDebugMsg('❌ Failed to start new conversation');
      }
    }
  };

  const isConversationEnded = history.length >= MAX_MESSAGES;

  if (selectedConversation) {
    return (
      <div className={styles.container} dir="rtl">
        <h1 className={styles.title}>{selectedConversation.emoji} {selectedConversation.title}</h1>
        <p className={styles.description}>
          לחץ ודבר ברוסית. השיחה תתנהל ברוסית
        </p>



        <div className={styles.chatBox} ref={chatRef}>
          {history.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
              <div className={styles.msgHeader}>
                <div className={styles.messageContent}>
                  <div className={styles.messageText} dir="ltr">
                    {msg.content}
                  </div>
                </div>
                {msg.role === 'assistant' && (
                  <div className={styles.messageActions}>
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

        <button 
          onClick={() => setSelectedConversation(null)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          חזרה לרשימת השיחות
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.title}>בחר סוג שיחה 💬</h1>
      <p className={styles.description}>
        בחר את סוג השיחה שברצונך לתרגל
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem',
        padding: '1rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {conversations.map((conv) => (
          <div 
            key={conv.id}
            onClick={() => setSelectedConversation(conv)}
            className={styles.conversationCard}
            style={{
              backgroundImage: `url("/animations/conversation/${conv.id.charAt(0).toUpperCase() + conv.id.slice(1)}.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative"
            }}
          >
            <div className={styles.cardLabel}>{conv.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

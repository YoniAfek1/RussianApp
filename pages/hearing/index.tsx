import { useState, useCallback, useEffect } from 'react';
import styles from '../../styles/Hearing.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaLanguage, FaArrowRight } from 'react-icons/fa';

interface Topic {
  id: string;
  name: string;
}

interface Metadata {
  Topic: string;
  StartRow: number;
  EndRow: number;
  FirstConversationColumn: string;
  NumConversations: number;
}

type Conversation = {
  russian: string[];
  hebrew: string[];
};

interface ConversationData {
  metadata: Metadata[];
  conversations: { [key: string]: Conversation[]; };
}

const TOPICS: Topic[] = [
  { id: 'introduction', name: 'היכרות' },
  { id: 'family', name: 'משפחה' },
  { id: 'work', name: 'עבודה' },
  { id: 'hobbies', name: 'תחביבים' },
  { id: 'food-drinks', name: 'אוכל ושתייה' },
  { id: 'shopping', name: 'קניות' },
  { id: 'weather', name: 'מזג אוויר' },
  { id: 'home', name: 'בית' },
  { id: 'transportation', name: 'תחבורה' },
  { id: 'education', name: 'לימודים' },
  { id: 'animals', name: 'בעלי חיים' },
  { id: 'clothing', name: 'בגדים' },
  { id: 'numbers-time', name: 'מספרים וזמן' },
  { id: 'health', name: 'בריאות' },
  { id: 'holidays', name: 'חגים ויום הולדת' },
  { id: 'vacation-geography', name: 'חופשות וגיאוגרפיה' }
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'קלה' },
  { id: 'medium', name: 'בינונית' },
  { id: 'hard', name: 'קשה' }
];

const topicNameToIdMap = Object.fromEntries(
  TOPICS.map(({ id, name }) => [name.trim(), id])
);

export default function Hearing() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExcelData();
  }, []);

  const loadExcelData = async () => {
    try {
      const response = await fetch('/data/Russian_Conversations.xlsx');
      if (!response.ok) throw new Error(`Failed to load conversation data file: ${response.status} ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      if (!workbook.SheetNames.includes('Metadata') || !workbook.SheetNames.includes('Conversations')) {
        throw new Error(`Required sheets not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
      }

      const metadataSheet = workbook.Sheets['Metadata'];
      const conversationsSheet = workbook.Sheets['Conversations'];
      const rawMetadata = XLSX.utils.sheet_to_json<any>(metadataSheet, { raw: false, defval: '', blankrows: false });
      const parsedMetadata: Metadata[] = rawMetadata as Metadata[];

      const conversations: { [key: string]: Conversation[] } = {};

      for (const row of parsedMetadata) {
        if (!row.Topic || typeof row.Topic !== 'string') continue;
        const topicName = row.Topic.trim();
        const topicId = topicNameToIdMap[topicName];
        if (!topicId) {
          console.warn('Unrecognized topic name in Excel:', topicName);
          continue;
        }
        const startRow = Number(row.StartRow);
        const endRow = Number(row.EndRow);
        const firstColIndex = XLSX.utils.decode_col(row.FirstConversationColumn);
        const numConversations = Number(row.NumConversations);

        if (!conversations[topicId]) conversations[topicId] = [];

        for (let i = 0; i < numConversations; i++) {
          const russianColIndex = firstColIndex + i * 2;
          const hebrewColIndex = russianColIndex + 1;
          const russianColLetter = XLSX.utils.encode_col(russianColIndex);
          const hebrewColLetter = XLSX.utils.encode_col(hebrewColIndex);

          const russian: string[] = [];
          const hebrew: string[] = [];

          for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
            const russianCell = conversationsSheet[`${russianColLetter}${rowNum}`]?.v;
            const hebrewCell = conversationsSheet[`${hebrewColLetter}${rowNum}`]?.v;
            russian.push(String(russianCell || '').trim());
            hebrew.push(String(hebrewCell || '').trim());
          }

          // Only add if at least one line is non-empty
          if (russian.some(line => line) && hebrew.some(line => line)) {
            conversations[topicId].push({ russian, hebrew });
          }
        }
      }

      if (Object.keys(conversations).length === 0) {
        throw new Error('No valid conversations found in the Excel file');
      }

      setConversationData({ metadata: parsedMetadata, conversations });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversation data');
    }
  };

  const handleStartListening = () => {
    if (!selectedTopic || !selectedLevel) {
      alert('Please select both a topic and difficulty level');
      return;
    }
    startConversation();
  };

  const startConversation = async () => {
    if (!conversationData || !selectedTopic) return;

    // Find metadata for the selected topic
    const topicMeta = conversationData.metadata.find(row => {
      const topicName = row.Topic?.trim();
      return topicName && topicNameToIdMap[topicName] === selectedTopic;
    });
    if (!topicMeta) {
      setError('Metadata for selected topic not found');
      return;
    }
    const numConversations = Number(topicMeta.NumConversations);
    const firstColIndex = XLSX.utils.decode_col(topicMeta.FirstConversationColumn);
    const startRow = Number(topicMeta.StartRow);
    const endRow = Number(topicMeta.EndRow);
    if (!numConversations || isNaN(firstColIndex) || isNaN(startRow) || isNaN(endRow)) {
      setError('Invalid metadata for selected topic');
      return;
    }
    // Randomly select a conversation index
    const randomIndex = Math.floor(Math.random() * numConversations);
    const russianColIndex = firstColIndex + randomIndex * 2;
    const hebrewColIndex = russianColIndex + 1;
    const russianColLetter = XLSX.utils.encode_col(russianColIndex);
    const hebrewColLetter = XLSX.utils.encode_col(hebrewColIndex);
    // Extract conversation lines
    const russian: string[] = [];
    const hebrew: string[] = [];
    // Find the conversationsSheet again
    const response = await fetch('/data/Russian_Conversations.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const conversationsSheet = workbook.Sheets['Conversations'];
    for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
      const russianCell = conversationsSheet[`${russianColLetter}${rowNum}`]?.v;
      const hebrewCell = conversationsSheet[`${hebrewColLetter}${rowNum}`]?.v;
      russian.push(String(russianCell || '').trim());
      hebrew.push(String(hebrewCell || '').trim());
    }
    const conversation = { russian, hebrew };
    setCurrentConversation(conversation);
    setCurrentLineIndex(0);
    setIsSessionStarted(true);
    setShowTranslation(false);
    // Play first line after a short delay
    setTimeout(() => {
      if (conversation.russian[0]) {
        speakLine(conversation.russian[0]);
      }
    }, 50);
  };

  const handleNext = () => {
    if (!currentConversation) return;

    const nextIndex = currentLineIndex + 1;
    if (nextIndex < currentConversation.russian.length) {
      setCurrentLineIndex(nextIndex);
      setShowTranslation(false);
      speakLine(currentConversation.russian[nextIndex]);
    }
  };

  const speakLine = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8; // Slightly slower for better clarity
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>🟣 Listening Practice – האזנה</h1>
        
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label htmlFor="level">Difficulty Level</label>
            <select 
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={styles.select}
            >
              <option value="">בחר רמה</option>
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="topic">Conversation Topic</label>
            <select 
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className={styles.select}
            >
              <option value="">בחר נושא</option>
              {TOPICS.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className={styles.startButton}
            onClick={handleStartListening}
            disabled={!selectedTopic || !selectedLevel}
          >
            Start Listening
          </button>
        </div>

        {isSessionStarted && currentConversation && (
          <div className={styles.contentArea}>
            <h2 className={styles.selectedTopic}>
              {TOPICS.find(t => t.id === selectedTopic)?.name}
            </h2>
            
            <div className={styles.line}>
              <p className={styles.russian}>{currentConversation.russian[currentLineIndex]}</p>
              {showTranslation && (
                <p className={styles.hebrew}>{currentConversation.hebrew[currentLineIndex]}</p>
              )}
            </div>

            <div className={styles.controls}>
              <button
                onClick={() => speakLine(currentConversation.russian[currentLineIndex])}
                className={`${styles.controlButton} ${isPlaying ? styles.playing : ''}`}
                disabled={isPlaying}
              >
                <FaVolumeUp />
                <span>השמע שוב</span>
              </button>

              <button
                onClick={() => setShowTranslation(true)}
                className={styles.controlButton}
                disabled={showTranslation}
              >
                <FaLanguage />
                <span>הצג תרגום</span>
              </button>

              {currentLineIndex < currentConversation.russian.length - 1 && (
                <button
                  onClick={handleNext}
                  className={styles.controlButton}
                  disabled={isPlaying}
                >
                  <FaArrowRight />
                  <span>הבא</span>
                </button>
              )}
            </div>

            {currentLineIndex === currentConversation.russian.length - 1 && (
              <div className={styles.completed}>
                <p>כל הכבוד! סיימת את השיחה</p>
                <button
                  onClick={() => setIsSessionStarted(false)}
                  className={styles.startButton}
                >
                  בחר שיחה חדשה
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
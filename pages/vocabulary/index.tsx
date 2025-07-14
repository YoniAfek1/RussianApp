import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useVocabularyStore } from '@/store/vocabularyStore';
import { Word, WordStatus } from '@/types/Word';
import styles from '@/styles/Vocabulary.module.css';
import { FaFilter } from 'react-icons/fa';

export default function VocabularyPage() {
  const { words, isLoading, error, loadWords, updateWordStatus } = useVocabularyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAssociation, setShowAssociation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const controls = useAnimation();
  const filterRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Get unique topics from words
  const topics = useMemo(() => {
    const set = new Set<string>();
    words.forEach(word => {
      if (word.topic) set.add(word.topic);
    });
    return Array.from(set);
  }, [words]);

  // Filter words based on filters
  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const statusMatch = statusFilter === 'all' || word.status === statusFilter;
      const topicMatch = topicFilter === 'all' || word.topic === topicFilter;
      return statusMatch && topicMatch;
    });
  }, [words, statusFilter, topicFilter]);

  const currentWord = filteredWords[currentIndex] || null;

  // Handle click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  // Initialize speech synthesis
  useEffect(() => {
    utteranceRef.current = new SpeechSynthesisUtterance();
    utteranceRef.current.lang = 'ru-RU';
    utteranceRef.current.rate = 0.9;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playAudio = useCallback(() => {
    if (!currentWord || !utteranceRef.current || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    utteranceRef.current.text = currentWord.russianWord;

    const voices = window.speechSynthesis.getVoices();
    const russianVoice = voices.find(voice => voice.lang.includes('ru'));
    if (russianVoice) {
      utteranceRef.current.voice = russianVoice;
    }

    window.speechSynthesis.speak(utteranceRef.current);
  }, [currentWord]);

  useEffect(() => {
    if (currentWord && !isAnimating) {
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentWord, isAnimating, playAudio]);

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (isAnimating || !currentWord) return;
    setIsAnimating(true);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    let status: WordStatus;
    let animationX = 0;
    let animationY = 0;
    let rotation = 0;

    switch (direction) {
      case 'right':
        status = 'green';
        animationX = 1000;
        rotation = 30;
        break;
      case 'up':
        status = 'yellow';
        animationY = -1000;
        break;
      case 'left':
        status = 'red';
        animationX = -1000;
        rotation = -30;
        break;
    }

    // If filtering is active, fade out, switch, then update status
    if (statusFilter !== 'all') {
      await controls.start({
        opacity: 0,
        transition: { duration: 0.1 },
      });
      const nextIndex = filteredWords.findIndex(word => word.id !== currentWord.id);
      setCurrentIndex(nextIndex === -1 ? 0 : nextIndex);
      setShowTranslation(false);
      setShowAssociation(false);
      await updateWordStatus(currentWord.id, status);
      await controls.set({ opacity: 1 });
      setIsAnimating(false);
      return;
    }

    // Normal mode with animation
    await controls.start({
      x: animationX,
      y: animationY,
      rotate: rotation,
      opacity: 0,
      transition: { duration: 0.3 }
    });

    await updateWordStatus(currentWord.id, status);

    setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, filteredWords.length - 1));
      setShowTranslation(false);
      setShowAssociation(false);
      setIsAnimating(false);
      controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
    }, 100);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isAnimating) return;

    switch (e.key) {
      case 'ArrowRight':
        handleSwipe('right');
        break;
      case 'ArrowLeft':
        handleSwipe('left');
        break;
      case 'ArrowUp':
        handleSwipe('up');
        break;
      case ' ':
        setShowTranslation(prev => !prev);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isAnimating]);

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev);
    setShowAssociation(false);
  };

  const toggleAssociation = () => {
    setShowAssociation(prev => !prev);
    setShowTranslation(false);
  };

  useEffect(() => {
    if (currentIndex >= filteredWords.length) {
      setCurrentIndex(0);
    }
  }, [filteredWords.length]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <button 
        className={styles.filterToggleButton}
        onClick={() => setShowFilter(prev => !prev)}
        aria-label="Toggle Filters"
      >
        <FaFilter />
      </button>

      <AnimatePresence>
        {showFilter && (
          <motion.div 
            ref={filterRef}
            className={styles.filterMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <label className={styles.filterLabel} htmlFor="statusFilter">
              <FaFilter style={{ marginRight: 4, fontSize: '1em', opacity: 0.7 }} />
              סטטוס
            </label>
            <select
              id="statusFilter"
              className={styles.filterDropdown}
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentIndex(0);
              }}
            >
              <option value="all">הכל</option>
              <option value="red">אדום</option>
              <option value="yellow">צהוב</option>
              <option value="green">ירוק</option>
            </select>
            <label className={styles.filterLabel} htmlFor="topicFilter">
              <FaFilter style={{ marginRight: 4, fontSize: '1em', opacity: 0.7 }} />
              נושא
            </label>
            <select
              id="topicFilter"
              className={styles.filterDropdown}
              value={topicFilter}
              onChange={e => {
                setTopicFilter(e.target.value);
                setCurrentIndex(0);
              }}
            >
              <option value="all">הכל</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            {filteredWords.length === 0 && (
              <div className={styles.noResultsSoft}>
                אין מילים מתאימות. נסו לשנות את המסננים.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {currentWord && (
        <motion.div
          className={`${styles.card} ${styles[currentWord.status || 'red']}`}
          animate={controls}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={(e, info) => {
            const offsetX = info.offset.x;
            const offsetY = info.offset.y;
            const velocityX = info.velocity.x;
            const velocityY = info.velocity.y;

            const isSignificantMove = 
              Math.abs(offsetX) > 100 || 
              Math.abs(offsetY) > 100 || 
              Math.abs(velocityX) > 500 || 
              Math.abs(velocityY) > 500;

            if (!isSignificantMove) return;

            if (Math.abs(offsetX) > Math.abs(offsetY)) {
              handleSwipe(offsetX > 0 ? 'right' : 'left');
            } else if (offsetY < 0) {
              handleSwipe('up');
            }
          }}
        >
          <button 
            className={styles.speakerButton}
            onClick={playAudio}
            aria-label="Play pronunciation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>

          <div className={styles.word}>{currentWord.russianWord}</div>
          
          <AnimatePresence mode="wait">
            {showTranslation && (
              <motion.div
                className={styles.translation}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentWord.hebrewTranslation}
              </motion.div>
            )}
            
            {showAssociation && currentWord.isAssociated && (
              <motion.div
                className={styles.association}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.associationWord}>
                  {currentWord.associationWord}
                </div>
                <div className={styles.associationSentence}>
                  {currentWord.associationSentence}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.translateButton} ${showTranslation ? styles.active : ''}`}
              onClick={toggleTranslation}
            >
              {showTranslation ? 'הסתר תרגום' : 'הצג תרגום'}
            </button>
            
            {currentWord.isAssociated && (
              <button
                className={`${styles.associationButton} ${showAssociation ? styles.active : ''}`}
                onClick={toggleAssociation}
              >
                {showAssociation ? 'הסתר אסוציאציה' : 'הצג אסוציאציה'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 
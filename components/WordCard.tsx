import { useState } from 'react';
import styles from '../styles/WordCard.module.css';

interface WordCardProps {
  id: string;
  russian: string;
  translation: string;
  initialStatus?: 'red' | 'yellow' | 'green' | null;
  onStatusChange?: (id: string, status: 'red' | 'yellow' | 'green') => void;
}

export default function WordCard({ 
  id, 
  russian, 
  translation, 
  initialStatus = null,
  onStatusChange 
}: WordCardProps) {
  const [status, setStatus] = useState<'red' | 'yellow' | 'green' | null>(initialStatus);

  const handleStatusChange = (newStatus: 'red' | 'yellow' | 'green') => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'red':
        return styles.red;
      case 'yellow':
        return styles.yellow;
      case 'green':
        return styles.green;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.card} ${getStatusColor()}`}>
      <div className={styles.content}>
        <h2 className={styles.russianWord}>{russian}</h2>
        <p className={styles.translation}>{translation}</p>
      </div>
      
      <div className={styles.statusButtons}>
        <button
          className={`${styles.statusButton} ${status === 'red' ? styles.active : ''}`}
          onClick={() => handleStatusChange('red')}
          aria-label="Mark as difficult"
        >
          🔴
        </button>
        <button
          className={`${styles.statusButton} ${status === 'yellow' ? styles.active : ''}`}
          onClick={() => handleStatusChange('yellow')}
          aria-label="Mark as in progress"
        >
          🟡
        </button>
        <button
          className={`${styles.statusButton} ${status === 'green' ? styles.active : ''}`}
          onClick={() => handleStatusChange('green')}
          aria-label="Mark as mastered"
        >
          🟢
        </button>
      </div>
    </div>
  );
}
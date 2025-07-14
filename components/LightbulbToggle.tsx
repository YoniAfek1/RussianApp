import { useState } from 'react';
import styles from '../styles/Grammar.module.css';

interface LightbulbToggleProps {
  children: React.ReactNode;
}

export const LightbulbToggle = ({ children }: LightbulbToggleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.ruleDisplay}>
      <button 
        className={styles.ruleToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '💡✨' : '💡'}
      </button>
      {isExpanded && (
        <div className={styles.ruleText}>
          {children}
        </div>
      )}
    </div>
  );
}; 
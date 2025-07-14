// קומפוננטת הקלטה: תשתית ראשונית להקלטת קול (בעתיד)
import { useState } from 'react';
import styles from '../styles/Recorder.module.css';

interface RecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
}

export default function Recorder({ onRecordingComplete }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording functionality
    console.log(isRecording ? 'Stopping recording...' : 'Starting recording...');
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
        onClick={handleRecordClick}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? '🎤' : '🎤'}
      </button>
      <p className={styles.status}>
        {isRecording ? 'Recording...' : 'Click to start recording'}
      </p>
    </div>
  );
}
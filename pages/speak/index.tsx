import { useState, useRef } from 'react';
import styles from '../../styles/Speak.module.css';

export default function SpeakPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;

          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audioData: base64Audio }),
            });

            if (!res.ok) {
              throw new Error('Transcription failed');
            }

            const data = await res.json();
            setTranscript(data.text || 'לא זוהה טקסט');
          } catch (error) {
            console.error('Error transcribing:', error);
            setTranscript('שגיאה בזיהוי הדיבור');
          } finally {
            setIsProcessing(false);
          }
        };

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Stop after 6 seconds max
      timeoutRef.current = setTimeout(() => stopRecording(), 6000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setTranscript('שגיאה בגישה למיקרופון');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRecording(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>דבר רוסית</h1>
      <div className={styles.microphoneContainer}>
        <button
          className={`${styles.microphoneButton} ${isRecording ? styles.recording : ''}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={isProcessing}
        >
          🎤
        </button>
        {isRecording && (
          <div className={styles.recordingIndicator}>
            הקלטה...
          </div>
        )}
      </div>
      <div className={styles.transcriptContainer}>
        {isProcessing ? (
          <div className={styles.processing}>מעבד את הדיבור...</div>
        ) : (
          <p className={styles.transcript}>
            {transcript || 'לחץ על המיקרופון ודבר...'}
          </p>
        )}
      </div>
    </div>
  );
} 
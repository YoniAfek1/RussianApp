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
      console.log('[FE] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('[FE] Microphone access granted');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      console.log('[FE] MediaRecorder created with mimeType:', mediaRecorder.mimeType);

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log('[FE] Received audio chunk, size:', e.data.size);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('[FE] MediaRecorder stopped, processing chunks...');
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('[FE] Created audio blob, size:', audioBlob.size);
        
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        console.log('[FE] Created FormData with audio blob');

        try {
          console.log('[FE] Sending audio to server...');
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Transcription failed: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();
          console.log('[FE] Received transcription response:', data);
          setTranscript(data.text || 'לא זוהה טקסט');
        } catch (error) {
          console.error('[FE] Error during transcription:', error);
          setTranscript('שגיאה בזיהוי הדיבור');
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks in the stream
        console.log('[FE] Stopping audio tracks...');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      console.log('[FE] Started recording');
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Stop after 6 seconds max
      timeoutRef.current = setTimeout(() => {
        console.log('[FE] Max recording time reached, stopping...');
        stopRecording();
      }, 6000);
    } catch (error) {
      console.error('[FE] Error accessing microphone:', error);
      setTranscript('שגיאה בגישה למיקרופון');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('[FE] Manually stopping recording...');
      mediaRecorderRef.current.stop();
    }
    if (timeoutRef.current) {
      console.log('[FE] Clearing recording timeout');
      clearTimeout(timeoutRef.current);
    }
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
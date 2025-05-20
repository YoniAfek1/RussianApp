import { useRef, useState } from 'react';
import Recorder from 'recorder-js';
import styles from '../../styles/Speak.module.css';

export default function SpeakPage() {
  const recorderRef = useRef<Recorder | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      console.log('[Frontend] Starting recording...');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('[Frontend] Got audio stream');
      
      const recorder = new Recorder(audioContext);
      await recorder.init(stream);
      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
      console.log('[Frontend] Recording started');

      setTimeout(stopRecording, 6000); // 6 sec max
    } catch (error) {
      console.error('[Frontend] Error starting recording:', error);
      setTranscript('Error accessing microphone');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) {
      console.error('[Frontend] No recorder instance found');
      return;
    }

    try {
      console.log('[Frontend] Stopping recording...');
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      console.log('[Frontend] Recording stopped, blob size:', blob.size);

      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');

      console.log('[Frontend] Sending audio to server...');
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('[Frontend] Server response:', data);
      setTranscript(data.text || data.error || 'Transcription failed');
    } catch (error) {
      console.error('[Frontend] Error processing recording:', error);
      setTranscript('Error processing recording');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Speak Russian</h1>
      <p className={styles.description}>
        Click the microphone button and speak in Russian. The app will transcribe your speech.
      </p>
      
      <div className={styles.controls}>
        <button 
          className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
          onClick={startRecording} 
          disabled={isRecording || isProcessing}
        >
          {isRecording ? '🎤 Recording...' : '🎤 Start Speaking'}
        </button>
      </div>

      <div className={styles.result}>
        {isProcessing ? (
          <div className={styles.processing}>Processing...</div>
        ) : (
          <div className={styles.transcript}>{transcript || 'Your transcription will appear here'}</div>
        )}
      </div>
    </div>
  );
} 
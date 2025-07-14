import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBJjYZif960Nh_FccIVcngUZcSFfPq_tgA"; // אתה יודע שזה גלוי
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiClientTest() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const sendToGemini = async () => {
    setLoading(true);
    setReply('');
    setLog([]);
    addLog('🚀 Initializing model...');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(input);
      const text = await result.response.text();

      setReply(text);
      addLog(`✅ Got response: ${text}`);
    } catch (err) {
      console.error(err);
      addLog(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌟 Gemini Client Test</h1>

      <textarea
        rows={5}
        style={{ width: '100%', fontSize: '1rem' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter prompt here..."
      />

      <button
        onClick={sendToGemini}
        disabled={loading || !input}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        {loading ? 'Generating...' : 'Send to Gemini'}
      </button>

      <h2>💬 Response</h2>
      <div style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        {reply || 'No reply yet'}
      </div>

      <h2>📋 Debug Log</h2>
      <ul>
        {log.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  );
}

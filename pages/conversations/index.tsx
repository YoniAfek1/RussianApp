import { useState } from 'react';

export default function GeminiClientTest() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const sendToServer = async () => {
    setLoading(true);
    setReply('');
    setLog([]);
    addLog('🚀 Sending request to /api/chat...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: input }
          ]
        })
      });

      const data = await response.json();
      if (data.reply) {
        setReply(data.reply);
        addLog(`✅ Server replied: ${data.reply}`);
      } else {
        addLog('⚠️ Server response has no "reply" field');
      }
    } catch (err) {
      console.error(err);
      addLog(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌟 Gemini Server Test</h1>

      <textarea
        rows={5}
        style={{ width: '100%', fontSize: '1rem' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="כתוב את ההודעה לג'מיני כאן..."
      />

      <button
        onClick={sendToServer}
        disabled={loading || !input}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        {loading ? 'טוען...' : 'שלח לשרת'}
      </button>

      <h2>💬 תשובת ג'מיני</h2>
      <div style={{
        whiteSpace: 'pre-wrap',
        background: '#f0f0f0',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        {reply || 'לא התקבלה תשובה עדיין'}
      </div>

      <h2>📋 Debug Log</h2>
      <ul>
        {log.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  );
}
